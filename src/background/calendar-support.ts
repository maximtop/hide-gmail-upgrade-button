/**
 * @file Optional Calendar host-access and dynamic content-script lifecycle.
 */

import {
    CALENDAR_CONTENT_SCRIPT_ID,
    CALENDAR_DISABLE_MESSAGE_TYPE,
    CALENDAR_URL_PATTERN,
    CONTENT_SCRIPT_FILE,
    PREHIDE_STYLESHEET_FILE,
} from '../common/constants';
import type { ExtensionMessage } from '../common/messages';
import { injectIntoOpenTabs } from './inject-open-tabs';

const CALENDAR_CONTENT_SCRIPT: chrome.scripting.RegisteredContentScript = {
    id: CALENDAR_CONTENT_SCRIPT_ID,
    matches: [CALENDAR_URL_PATTERN],
    js: [CONTENT_SCRIPT_FILE],
    css: [PREHIDE_STYLESHEET_FILE],
    runAt: 'document_start',
    persistAcrossSessions: true,
};

const CALENDAR_DISABLE_MESSAGE = {
    type: CALENDAR_DISABLE_MESSAGE_TYPE,
} satisfies ExtensionMessage;

/**
 * Checks whether the user has granted access to Google Calendar.
 *
 * @returns Whether the optional Calendar origin is currently granted.
 */
export const hasCalendarAccess = async (): Promise<boolean> => {
    return chrome.permissions.contains({ origins: [CALENDAR_URL_PATTERN] });
};

/**
 * Broadcasts Calendar cleanup to extension content scripts in open tabs.
 * This intentionally queries without a URL filter: after browser-side
 * permission revocation the Calendar URL is no longer visible to the
 * extension. Content scripts scope the message to the Calendar hostname.
 */
export const restoreOpenCalendarTabs = async (): Promise<void> => {
    const tabs = await chrome.tabs.query({});
    await Promise.allSettled(tabs.map(async (tab) => {
        if (typeof tab.id === 'number') {
            await chrome.tabs.sendMessage(tab.id, CALENDAR_DISABLE_MESSAGE);
        }
    }));
};

/**
 * Aligns the persistent Calendar content-script registration with the current
 * optional host permission. A newly granted registration is also injected
 * into matching tabs that were already open.
 */
export const reconcileCalendarSupport = async (): Promise<void> => {
    const [hasAccess, registrations] = await Promise.all([
        hasCalendarAccess(),
        chrome.scripting.getRegisteredContentScripts({ ids: [CALENDAR_CONTENT_SCRIPT_ID] }),
    ]);
    const isRegistered = registrations.some((registration) => {
        return registration.id === CALENDAR_CONTENT_SCRIPT_ID;
    });

    if (!hasAccess) {
        if (isRegistered) {
            await chrome.scripting.unregisterContentScripts({ ids: [CALENDAR_CONTENT_SCRIPT_ID] });
        }
        return;
    }

    if (isRegistered) {
        await chrome.scripting.updateContentScripts([CALENDAR_CONTENT_SCRIPT]);
    } else {
        await chrome.scripting.registerContentScripts([CALENDAR_CONTENT_SCRIPT]);
    }

    await injectIntoOpenTabs([CALENDAR_URL_PATTERN]);
};
