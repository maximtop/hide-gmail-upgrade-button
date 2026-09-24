/**
 * @file Background entrypoint: injects required-host tabs after install or
 * update, opens the onboarding page after a fresh install and keeps optional
 * Google Calendar content-script registration in sync with its runtime host
 * permission.
 */

import { includesCalendarOrigin } from '../common/calendar-access';

import {
    hasCalendarAccess,
    reconcileCalendarSupport,
    restoreOpenCalendarTabs,
} from './calendar-support';
import { injectIntoOpenTabs } from './inject-open-tabs';
import { openOnboardingOnInstall } from './onboarding';

let calendarMaintenance = Promise.resolve();

/**
 * Serializes Calendar maintenance so simultaneous lifecycle and permission
 * events cannot race cleanup against registration or injection.
 *
 * @param task Maintenance operation to append.
 */
const scheduleCalendarMaintenance = (task: () => Promise<void>): void => {
    calendarMaintenance = calendarMaintenance
        .then(task)
        .catch((error: unknown) => {
            console.debug('Google Calendar support maintenance failed:', error);
        });
};

/**
 * Reconciles registration after install, startup, or a permission grant.
 */
const scheduleCalendarReconciliation = (): void => {
    scheduleCalendarMaintenance(reconcileCalendarSupport);
};

/**
 * Restores Calendar tabs and unregisters their script after permission
 * removal. A fast re-grant cancels the stale cleanup; its queued grant task
 * will reconcile the active state instead.
 */
const scheduleCalendarRemoval = (): void => {
    scheduleCalendarMaintenance(async () => {
        if (await hasCalendarAccess()) {
            return;
        }

        try {
            await restoreOpenCalendarTabs();
        } catch (error) {
            console.debug('Could not restore open Google Calendar tabs:', error);
        }
        await reconcileCalendarSupport();
    });
};

chrome.runtime.onInstalled.addListener((details) => {
    injectIntoOpenTabs().catch((error: unknown) => {
        console.debug('Injection into open tabs failed:', error);
    });
    openOnboardingOnInstall(details).catch((error: unknown) => {
        console.debug('Could not open the onboarding page:', error);
    });
    scheduleCalendarReconciliation();
});

chrome.runtime.onStartup.addListener(() => {
    scheduleCalendarReconciliation();
});

chrome.permissions.onAdded.addListener((permissions) => {
    if (includesCalendarOrigin(permissions)) {
        scheduleCalendarReconciliation();
    }
});

chrome.permissions.onRemoved.addListener((permissions) => {
    if (includesCalendarOrigin(permissions)) {
        scheduleCalendarRemoval();
    }
});
