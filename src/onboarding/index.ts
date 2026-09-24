/**
 * @file Onboarding page opened after installation and from the popup:
 * explains what the extension does and offers optional Google Calendar
 * access right on the page.
 *
 * All copy is static and localized synchronously before the first paint.
 * The Calendar control depends on the asynchronous permission state, so it
 * stays hidden with its layout preserved until that state is applied, and
 * then follows permission changes made from the popup or browser settings.
 */

import { changeCalendarAccess, readCalendarAccess, subscribeToCalendarAccess } from '../common/calendar-access';

const calendarControl = document.getElementById('calendar-control') as HTMLElement;
const enableButton = document.getElementById('calendar-enable') as HTMLButtonElement;
const enabledState = document.getElementById('calendar-enabled') as HTMLElement;
const disableButton = document.getElementById('calendar-disable') as HTMLButtonElement;

/**
 * Applies localized messages to every element marked with `data-i18n` (text)
 * or `data-i18n-alt` (image alternative text), plus the document language
 * and text direction.
 */
const localizePage = (): void => {
    document.documentElement.lang = chrome.i18n.getUILanguage();
    document.documentElement.dir = chrome.i18n.getMessage('@@bidi_dir');
    document.title = chrome.i18n.getMessage('onboarding_title');

    for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
        element.textContent = chrome.i18n.getMessage(element.dataset.i18n as string);
    }
    for (const image of document.querySelectorAll<HTMLImageElement>('img[data-i18n-alt]')) {
        image.alt = chrome.i18n.getMessage(image.dataset.i18nAlt as string);
    }
};

/**
 * Renders the authoritative Calendar access state and reveals the control.
 *
 * @param enabled Whether Calendar access is granted.
 */
const renderCalendarAccess = (enabled: boolean): void => {
    enableButton.hidden = enabled;
    enabledState.hidden = !enabled;
    enableButton.disabled = false;
    disableButton.disabled = false;
    calendarControl.removeAttribute('data-pending');
};

/**
 * Requests or removes Calendar access after a click, then renders the
 * browser's authoritative state. The clicked button is replaced by the other
 * one, so focus follows it and keyboard users do not lose their place.
 *
 * @param enabled Requested state.
 */
const updateCalendarAccess = async (enabled: boolean): Promise<void> => {
    const hadFocus = document.activeElement === enableButton || document.activeElement === disableButton;
    enableButton.disabled = true;
    disableButton.disabled = true;

    const granted = await changeCalendarAccess(enabled, !enabled);
    renderCalendarAccess(granted);
    if (hadFocus) {
        (granted ? disableButton : enableButton).focus();
    }
};

localizePage();

enableButton.addEventListener('click', () => {
    void updateCalendarAccess(true);
});
disableButton.addEventListener('click', () => {
    void updateCalendarAccess(false);
});
subscribeToCalendarAccess(renderCalendarAccess);

readCalendarAccess()
    .then(renderCalendarAccess)
    .catch(() => {
        // Without an authoritative state the control stays pending rather
        // than guessing.
    });
