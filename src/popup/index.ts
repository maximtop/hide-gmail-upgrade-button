/**
 * @file Popup: two feature toggles plus optional Google Calendar access.
 *
 * Rendering avoids visible initialization transitions: the popup stays hidden
 * while its one authoritative async snapshot is loaded, then reveals the
 * resolved controls without transitions. Animations are armed only after the
 * first visible frame. Open supported tabs pick setting changes up live via
 * storage subscription.
 */

import { changeCalendarAccess, readCalendarAccess, subscribeToCalendarAccess } from '../common/calendar-access';
import { ONBOARDING_PAGE_FILE } from '../common/constants';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../common/settings';

import { readCachedSettings, writeCachedSettings } from './settings-cache';

import type { Settings } from '../common/settings';

/**
 * Sets the localized text of an element.
 *
 * @param elementId DOM id of the element.
 * @param messageKey Key in `_locales` messages.
 */
const localize = (elementId: string, messageKey: string): void => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = chrome.i18n.getMessage(messageKey);
    }
};

/**
 * Returns the checkbox controlling a settings field.
 *
 * @param elementId DOM id of the checkbox.
 *
 * @returns The checkbox, or null when missing.
 */
const getToggle = (elementId: string): HTMLInputElement | null => {
    const element = document.getElementById(elementId);
    return element instanceof HTMLInputElement ? element : null;
};

const TOGGLES: readonly { elementId: string; settingKey: keyof Settings }[] = [
    { elementId: 'hide-upgrade', settingKey: 'hideUpgrade' },
    { elementId: 'hide-gemini', settingKey: 'hideGemini' },
];

const CALENDAR_ACCESS_TOGGLE_ID = 'calendar-access';

const CALENDAR_ACCESS_ROW_ID = 'calendar-access-row';

/**
 * Reveals the fully resolved popup without transitions, then arms animations
 * after one complete visible frame so no control can animate from its markup
 * default to its authoritative initial state.
 */
const revealPopup = (): void => {
    document.body.classList.add('ready');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.add('interactive');
        });
    });
};

/**
 * Renders the authoritative Calendar permission state and reveals its row.
 *
 * @param enabled Whether Calendar access is granted.
 */
const renderCalendarAccess = (enabled: boolean): void => {
    const toggle = getToggle(CALENDAR_ACCESS_TOGGLE_ID);
    const row = document.getElementById(CALENDAR_ACCESS_ROW_ID);
    if (!toggle || !row) {
        return;
    }

    toggle.checked = enabled;
    toggle.disabled = false;
    row.removeAttribute('data-pending');
};

/**
 * Requests or removes Calendar host access after a direct checkbox gesture,
 * then re-renders from the browser's authoritative permission state.
 *
 * @param toggle Calendar permission checkbox.
 */
const updateCalendarAccess = async (toggle: HTMLInputElement): Promise<void> => {
    const requestedEnabled = toggle.checked;
    toggle.toggleAttribute('disabled', true);
    renderCalendarAccess(await changeCalendarAccess(requestedEnabled));
};

/**
 * Applies a settings object to the toggle states.
 *
 * @param settings Settings to render.
 */
const renderSettings = (settings: Settings): void => {
    for (const { elementId, settingKey } of TOGGLES) {
        const toggle = getToggle(elementId);
        if (toggle) {
            toggle.checked = settings[settingKey];
        }
    }
};

/**
 * Synchronous part of startup: localized texts, cached state and listeners.
 * The popup remains hidden until asynchronous authoritative state resolves.
 */
const initSync = (): void => {
    document.title = chrome.i18n.getMessage('popup_title');
    localize('title', 'popup_title');
    localize('hide-upgrade-label', 'popup_toggle_label');
    localize('hide-gemini-label', 'popup_toggle_gemini_label');
    localize('calendar-access-label', 'popup_calendar_access_label');
    localize('markup-note', 'popup_markup_note');
    localize('report-link', 'popup_report_link');
    localize('onboarding-link', 'popup_onboarding_link');
    document.getElementById('onboarding-link')?.setAttribute('href', chrome.runtime.getURL(ONBOARDING_PAGE_FILE));

    renderSettings(readCachedSettings() ?? DEFAULT_SETTINGS);

    for (const { elementId, settingKey } of TOGGLES) {
        getToggle(elementId)?.addEventListener('change', (event) => {
            const { checked } = (event.target as HTMLInputElement);
            void saveSettings({ [settingKey]: checked }).then(writeCachedSettings);
        });
    }

    getToggle(CALENDAR_ACCESS_TOGGLE_ID)?.addEventListener('change', (event) => {
        void updateCalendarAccess(event.target as HTMLInputElement);
    });

    // Access may also change on the onboarding page while the popup is open.
    subscribeToCalendarAccess(renderCalendarAccess);
};

/**
 * Reconciles the rendered state with the authoritative storage and
 * refreshes the synchronous cache.
 */
const reconcile = async (): Promise<void> => {
    const [settingsResult, calendarAccessResult] = await Promise.allSettled([
        loadSettings(),
        readCalendarAccess(),
    ]);

    if (settingsResult.status === 'fulfilled') {
        renderSettings(settingsResult.value);
        writeCachedSettings(settingsResult.value);
    }

    if (calendarAccessResult.status === 'fulfilled') {
        renderCalendarAccess(calendarAccessResult.value);
    }
};

initSync();
reconcile()
    .catch(() => {
        // Promise.allSettled itself cannot reject. If a non-standard runtime
        // does, keep asynchronous controls pending instead of guessing.
    })
    .finally(revealPopup);
