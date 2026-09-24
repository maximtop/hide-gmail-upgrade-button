/**
 * @file Onboarding page behavior: localization, the Google Calendar access
 * card kept in sync with permission changes made elsewhere, and the Pin card
 * following the toolbar state.
 *
 * @vitest-environment happy-dom
 */

import fs from 'node:fs';
import path from 'node:path';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CALENDAR_URL_PATTERN } from '../../../src/common/constants';

type PermissionsListener = (permissions: chrome.permissions.Permissions) => void;

const PAGE_HTML = fs.readFileSync(path.join(import.meta.dirname, '../../../src/onboarding/index.html'), 'utf-8');

const containsMock = vi.fn();
const requestMock = vi.fn();
const removeMock = vi.fn();
const getUserSettingsMock = vi.fn();
let addedListeners: PermissionsListener[] = [];
let removedListeners: PermissionsListener[] = [];
let userSettingsListeners: Array<() => void> = [];

const byId = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;

const calendar = () => {
    return {
        card: byId('calendar-card'),
        textOff: byId('calendar-text-off'),
        textOn: byId('calendar-text-on'),
        denied: byId('calendar-denied'),
        why: byId('calendar-why'),
        enableButton: byId<HTMLButtonElement>('calendar-enable'),
        enabledStatus: byId('calendar-enabled'),
        disableButton: byId<HTMLButtonElement>('calendar-disable'),
    };
};

const pin = () => {
    return {
        card: byId('pin-card'),
        text: byId('pin-text'),
        doneText: byId('pin-done-text'),
        art: byId('pin-art'),
        done: byId('pin-done'),
    };
};

const expectCalendarState = (enabled: boolean): void => {
    const { card, textOff, textOn, why, enableButton, enabledStatus, disableButton } = calendar();
    expect(card.hasAttribute('data-pending')).toBe(false);
    expect(textOff.hidden).toBe(enabled);
    expect(why.hidden).toBe(enabled);
    expect(enableButton.hidden).toBe(enabled);
    expect(textOn.hidden).toBe(!enabled);
    expect(enabledStatus.hidden).toBe(!enabled);
    expect(disableButton.hidden).toBe(!enabled);
    expect(enableButton.disabled).toBe(false);
    expect(disableButton.disabled).toBe(false);
};

const expectPinnedState = (pinned: boolean): void => {
    const { card, text, doneText, art, done } = pin();
    expect(card.hasAttribute('data-pending')).toBe(false);
    expect(text.hidden).toBe(pinned);
    expect(art.hidden).toBe(pinned);
    expect(doneText.hidden).toBe(!pinned);
    expect(done.hidden).toBe(!pinned);
};

const renderPage = (): void => {
    const parsed = new DOMParser().parseFromString(PAGE_HTML, 'text/html');
    document.title = '';
    document.body.innerHTML = parsed.body.innerHTML;
};

const loadPage = async (): Promise<void> => {
    await import('../../../src/onboarding/index');
    await vi.waitFor(() => {
        expect(calendar().card.hasAttribute('data-pending')).toBe(false);
        expect(pin().card.hasAttribute('data-pending')).toBe(false);
    });
};

const stubChrome = (action: object): void => {
    vi.stubGlobal('chrome', {
        i18n: {
            getMessage: (key: string) => (key === '@@bidi_dir' ? 'rtl' : `msg:${key}`),
            getUILanguage: () => 'he',
        },
        permissions: {
            contains: containsMock,
            request: requestMock,
            remove: removeMock,
            onAdded: { addListener: (listener: PermissionsListener) => addedListeners.push(listener) },
            onRemoved: { addListener: (listener: PermissionsListener) => removedListeners.push(listener) },
        },
        action,
    });
};

describe('onboarding page', () => {
    beforeEach(() => {
        vi.resetModules();
        renderPage();
        addedListeners = [];
        removedListeners = [];
        userSettingsListeners = [];
        containsMock.mockReset().mockResolvedValue(false);
        requestMock.mockReset().mockResolvedValue(false);
        removeMock.mockReset().mockResolvedValue(false);
        getUserSettingsMock.mockReset().mockResolvedValue({ isOnToolbar: false });

        stubChrome({
            getUserSettings: getUserSettingsMock,
            onUserSettingsChanged: { addListener: (listener: () => void) => userSettingsListeners.push(listener) },
        });
    });

    it('localizes every text, the illustration and the document before the first paint', async () => {
        await import('../../../src/onboarding/index');

        expect(document.title).toBe('msg:onboarding_title');
        expect(document.documentElement.lang).toBe('he');
        expect(document.documentElement.dir).toBe('rtl');
        expect(document.querySelector('h1')?.textContent).toBe('msg:onboarding_title');
        expect(calendar().enableButton.textContent).toBe('msg:popup_calendar_access_label');
        expect(document.querySelector('figure')?.getAttribute('aria-label')).toBe('msg:onboarding_how_image_alt');
        for (const element of document.querySelectorAll('[data-i18n]')) {
            expect(element.textContent).toMatch(/^msg:(onboarding|popup)_/);
        }
    });

    describe('Calendar card', () => {
        it('keeps its state hidden until the permission state is known', async () => {
            let resolveAccess: ((value: boolean) => void) | undefined;
            containsMock.mockReturnValue(new Promise<boolean>((resolve) => {
                resolveAccess = resolve;
            }));

            await import('../../../src/onboarding/index');

            expect(calendar().card.hasAttribute('data-pending')).toBe(true);
            expect(calendar().enableButton.disabled).toBe(true);

            resolveAccess?.(true);

            await vi.waitFor(() => {
                expectCalendarState(true);
            });
            expect(containsMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
        });

        it('stays pending when the permission state is unavailable', async () => {
            containsMock.mockRejectedValue(new Error('permission state unavailable'));

            await import('../../../src/onboarding/index');
            await new Promise((resolve) => {
                setTimeout(resolve, 0);
            });

            expect(calendar().card.hasAttribute('data-pending')).toBe(true);
            expect(calendar().enableButton.disabled).toBe(true);
        });

        it('offers the enable button and the explanation while access is off', async () => {
            await loadPage();

            expectCalendarState(false);
            expect(calendar().denied.hidden).toBe(true);
            expect(requestMock).not.toHaveBeenCalled();
        });

        it('requests access within the click and shows it as enabled', async () => {
            await loadPage();
            requestMock.mockResolvedValue(true);
            containsMock.mockResolvedValue(true);
            const { enableButton, disableButton } = calendar();
            enableButton.focus();

            enableButton.click();

            // Requested synchronously, so the browser still sees the user gesture.
            expect(requestMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
            expect(enableButton.disabled).toBe(true);
            await vi.waitFor(() => {
                expectCalendarState(true);
            });
            expect(calendar().denied.hidden).toBe(true);
            expect(document.activeElement).toBe(disableButton);
        });

        it('says so when the user declines the browser prompt, until the next attempt', async () => {
            await loadPage();
            requestMock.mockResolvedValue(false);

            calendar().enableButton.click();

            await vi.waitFor(() => {
                expect(calendar().denied.hidden).toBe(false);
            });
            expectCalendarState(false);

            let resolveRequest: ((value: boolean) => void) | undefined;
            requestMock.mockReturnValue(new Promise<boolean>((resolve) => {
                resolveRequest = resolve;
            }));
            calendar().enableButton.click();
            expect(calendar().denied.hidden).toBe(true);

            containsMock.mockResolvedValue(true);
            resolveRequest?.(true);
            await vi.waitFor(() => {
                expectCalendarState(true);
            });
            expect(calendar().denied.hidden).toBe(true);
        });

        it('removes access with the turn-off button', async () => {
            containsMock.mockResolvedValue(true);
            await loadPage();
            removeMock.mockResolvedValue(true);
            containsMock.mockResolvedValue(false);

            calendar().disableButton.click();

            expect(removeMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
            await vi.waitFor(() => {
                expectCalendarState(false);
            });
            expect(calendar().denied.hidden).toBe(true);
        });

        it('follows access changed from the popup or browser settings', async () => {
            await loadPage();

            for (const listener of addedListeners) {
                listener({ origins: ['https://example.com/*'] });
            }
            expectCalendarState(false);

            for (const listener of addedListeners) {
                listener({ origins: [CALENDAR_URL_PATTERN] });
            }
            expectCalendarState(true);

            for (const listener of removedListeners) {
                listener({ origins: [CALENDAR_URL_PATTERN] });
            }
            expectCalendarState(false);
        });
    });

    describe('Pin card', () => {
        it('keeps its state hidden until the toolbar state is known', async () => {
            let resolveSettings: ((value: chrome.action.UserSettings) => void) | undefined;
            getUserSettingsMock.mockReturnValue(new Promise<chrome.action.UserSettings>((resolve) => {
                resolveSettings = resolve;
            }));

            await import('../../../src/onboarding/index');
            expect(pin().card.hasAttribute('data-pending')).toBe(true);

            resolveSettings?.({ isOnToolbar: true });

            await vi.waitFor(() => {
                expectPinnedState(true);
            });
        });

        it('shows how to pin while the icon is not on the toolbar', async () => {
            await loadPage();

            expectPinnedState(false);
        });

        it('falls back to the instructions when the toolbar state cannot be read', async () => {
            getUserSettingsMock.mockRejectedValue(new Error('unsupported'));

            await loadPage();

            expectPinnedState(false);
        });

        it('switches to pinned when the user pins the icon', async () => {
            await loadPage();
            getUserSettingsMock.mockResolvedValue({ isOnToolbar: true });

            for (const listener of userSettingsListeners) {
                listener();
            }

            await vi.waitFor(() => {
                expectPinnedState(true);
            });
        });

        it('re-checks on returning to the tab where the change event is missing', async () => {
            stubChrome({ getUserSettings: getUserSettingsMock });
            await loadPage();
            getUserSettingsMock.mockResolvedValue({ isOnToolbar: true });

            document.dispatchEvent(new Event('visibilitychange'));

            await vi.waitFor(() => {
                expectPinnedState(true);
            });
        });
    });
});
