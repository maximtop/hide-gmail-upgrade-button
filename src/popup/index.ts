/**
 * @file Popup: two toggles controlling which Gmail header buttons are
 * hidden. Reads and writes settings through the shared storage adapter;
 * open Gmail tabs pick changes up live via storage subscription.
 */

import { loadSettings, saveSettings } from '../common/settings';
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
 * Wires a checkbox to a boolean settings field.
 *
 * @param elementId DOM id of the checkbox.
 * @param settingKey Settings field the checkbox controls.
 * @param settings Current settings used for the initial state.
 */
const bindToggle = (elementId: string, settingKey: keyof Settings, settings: Settings): void => {
    const checkbox = document.getElementById(elementId);
    if (!(checkbox instanceof HTMLInputElement)) {
        return;
    }

    checkbox.checked = settings[settingKey];
    checkbox.addEventListener('change', () => {
        saveSettings({ [settingKey]: checkbox.checked });
    });
};

/**
 * Localizes the popup and binds both toggles to the stored settings.
 */
const init = async (): Promise<void> => {
    document.title = chrome.i18n.getMessage('popup_title');
    localize('title', 'popup_title');
    localize('hide-upgrade-label', 'popup_toggle_label');
    localize('hide-gemini-label', 'popup_toggle_gemini_label');

    const settings = await loadSettings();
    bindToggle('hide-upgrade', 'hideUpgrade', settings);
    bindToggle('hide-gemini', 'hideGemini', settings);
};

init().catch(() => {
    // Storage unavailable: the popup stays with unchecked defaults visible.
});
