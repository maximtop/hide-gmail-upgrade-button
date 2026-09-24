/**
 * @file Onboarding page opened after installation and from the popup: shows
 * what the extension hides, offers optional Google Calendar access right on
 * the page and tells the user how to pin the extension.
 *
 * All copy is static and localized synchronously before the first paint.
 * The Calendar and Pin cards depend on asynchronous browser state, so their
 * state-dependent parts stay hidden with their layout preserved until that
 * state is applied, and then follow changes made elsewhere (the popup, the
 * browser's extension settings, the toolbar).
 */

import { changeCalendarAccess, readCalendarAccess, subscribeToCalendarAccess } from '../common/calendar-access';

const calendarCard = document.getElementById('calendar-card') as HTMLElement;
const calendarTextOff = document.getElementById('calendar-text-off') as HTMLElement;
const calendarTextOn = document.getElementById('calendar-text-on') as HTMLElement;
const calendarDenied = document.getElementById('calendar-denied') as HTMLElement;
const calendarWhy = document.getElementById('calendar-why') as HTMLDetailsElement;
const enableButton = document.getElementById('calendar-enable') as HTMLButtonElement;
const enabledStatus = document.getElementById('calendar-enabled') as HTMLElement;
const disableButton = document.getElementById('calendar-disable') as HTMLButtonElement;

const pinCard = document.getElementById('pin-card') as HTMLElement;
const pinText = document.getElementById('pin-text') as HTMLElement;
const pinDoneText = document.getElementById('pin-done-text') as HTMLElement;
const pinArt = document.getElementById('pin-art') as HTMLElement;
const pinDone = document.getElementById('pin-done') as HTMLElement;

/**
 * Applies localized messages to every element marked with `data-i18n` (text)
 * or `data-i18n-aria-label` (accessible name), plus the document language and
 * text direction.
 */
const localizePage = (): void => {
    // Taken from the catalog that served the strings, not from the browser
    // UI language: a UI locale without a catalog falls back to English and
    // must not be mirrored.
    document.documentElement.lang = chrome.i18n.getMessage('locale_code');
    document.documentElement.dir = chrome.i18n.getMessage('locale_dir');
    document.title = chrome.i18n.getMessage('onboarding_title');

    for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
        element.textContent = chrome.i18n.getMessage(element.dataset.i18n as string);
    }
    for (const element of document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]')) {
        element.setAttribute('aria-label', chrome.i18n.getMessage(element.dataset.i18nAriaLabel as string));
    }
};

/**
 * Renders the authoritative Calendar access state and reveals the card.
 * The "why optional" explanation only matters while access is off.
 *
 * @param enabled Whether Calendar access is granted.
 */
const renderCalendarAccess = (enabled: boolean): void => {
    calendarTextOff.hidden = enabled;
    calendarWhy.hidden = enabled;
    calendarTextOn.hidden = !enabled;
    enableButton.hidden = enabled;
    enabledStatus.hidden = !enabled;
    disableButton.hidden = !enabled;
    if (enabled) {
        calendarDenied.hidden = true;
    }
    enableButton.disabled = false;
    disableButton.disabled = false;
    calendarCard.removeAttribute('data-pending');
};

/**
 * Requests or removes Calendar access after a click, then renders the
 * browser's authoritative state. A request that ends without access (prompt
 * declined or closed) says so, otherwise the click would look ignored. The
 * clicked button is replaced by the other one, so focus follows it and
 * keyboard users do not lose their place.
 *
 * @param enabled Requested state.
 */
const updateCalendarAccess = async (enabled: boolean): Promise<void> => {
    const hadFocus = document.activeElement === enableButton || document.activeElement === disableButton;
    enableButton.disabled = true;
    disableButton.disabled = true;
    calendarDenied.hidden = true;

    const granted = await changeCalendarAccess(enabled);
    renderCalendarAccess(granted);
    calendarDenied.hidden = !enabled || granted;
    if (hadFocus) {
        (granted ? disableButton : enableButton).focus();
    }
};

/**
 * Renders whether the extension icon is pinned to the toolbar and reveals
 * the card.
 *
 * @param pinned Whether the action icon is on the toolbar.
 */
const renderPinned = (pinned: boolean): void => {
    pinText.hidden = pinned;
    pinArt.hidden = pinned;
    pinDoneText.hidden = !pinned;
    pinDone.hidden = !pinned;
    pinCard.removeAttribute('data-pending');
};

/**
 * Reads the toolbar state. The instructions are the safe fallback when it
 * cannot be read: they are correct for an unpinned icon and harmless for a
 * pinned one.
 */
const refreshPinned = async (): Promise<void> => {
    try {
        const { isOnToolbar } = await chrome.action.getUserSettings();
        renderPinned(isOnToolbar);
    } catch {
        renderPinned(false);
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

void refreshPinned();
// `onUserSettingsChanged` exists only in newer browsers (Chrome 130,
// Firefox 142); returning to the tab re-checks everywhere else.
chrome.action.onUserSettingsChanged?.addListener(() => {
    void refreshPinned();
});
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        void refreshPinned();
    }
});
