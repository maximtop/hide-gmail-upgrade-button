/**
 * @file Popup: two toggles controlling which Gmail header buttons are
 * hidden.
 *
 * Rendering is synchronous to avoid any visible state change on open: the
 * bundle loads as a blocking script, applies the last known settings from
 * the synchronous cache and reveals the content — all before the first
 * paint. The authoritative `chrome.storage` state is reconciled right
 * after; open Gmail tabs pick changes up live via storage subscription.
 */

import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../common/settings';
import type { Settings } from '../common/settings';
import { readCachedSettings, writeCachedSettings } from './settings-cache';

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

const TOGGLES: ReadonlyArray<{ elementId: string; settingKey: keyof Settings }> = [
    { elementId: 'hide-upgrade', settingKey: 'hideUpgrade' },
    { elementId: 'hide-gemini', settingKey: 'hideGemini' },
];

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
 * Synchronous part of startup: localized texts, last known state, reveal.
 * Runs before the first paint (blocking script), so the popup opens already
 * in its final state.
 */
const initSync = (): void => {
    document.title = chrome.i18n.getMessage('popup_title');
    localize('title', 'popup_title');
    localize('hide-upgrade-label', 'popup_toggle_label');
    localize('hide-gemini-label', 'popup_toggle_gemini_label');

    renderSettings(readCachedSettings() ?? DEFAULT_SETTINGS);

    for (const { elementId, settingKey } of TOGGLES) {
        getToggle(elementId)?.addEventListener('change', (event) => {
            const checked = (event.target as HTMLInputElement).checked;
            saveSettings({ [settingKey]: checked }).then(writeCachedSettings);
        });
    }

    document.body.classList.add('ready');
};

/**
 * Reconciles the rendered state with the authoritative storage and
 * refreshes the synchronous cache.
 */
const reconcile = async (): Promise<void> => {
    const settings = await loadSettings();
    renderSettings(settings);
    writeCachedSettings(settings);
};

initSync();
reconcile().catch(() => {
    // Storage unavailable: the popup keeps showing the cached state.
});
