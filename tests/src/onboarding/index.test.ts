/**
 * @file Onboarding page behavior: localization and the Google Calendar
 * access button, kept in sync with permission changes made elsewhere.
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
let addedListeners: PermissionsListener[] = [];
let removedListeners: PermissionsListener[] = [];

const renderPage = (): void => {
    const parsed = new DOMParser().parseFromString(PAGE_HTML, 'text/html');
    document.title = '';
    document.body.innerHTML = parsed.body.innerHTML;
};

const getControl = () => {
    return {
        control: document.getElementById('calendar-control') as HTMLElement,
        enableButton: document.getElementById('calendar-enable') as HTMLButtonElement,
        enabledState: document.getElementById('calendar-enabled') as HTMLElement,
        disableButton: document.getElementById('calendar-disable') as HTMLButtonElement,
    };
};

const expectCalendarState = (enabled: boolean): void => {
    const { control, enableButton, enabledState, disableButton } = getControl();
    expect(control.hasAttribute('data-pending')).toBe(false);
    expect(enableButton.hidden).toBe(enabled);
    expect(enabledState.hidden).toBe(!enabled);
    expect(enableButton.disabled).toBe(false);
    expect(disableButton.disabled).toBe(false);
};

const loadPage = async (): Promise<void> => {
    await import('../../../src/onboarding/index');
    await vi.waitFor(() => {
        expect(getControl().control.hasAttribute('data-pending')).toBe(false);
    });
};

describe('onboarding page', () => {
    beforeEach(() => {
        vi.resetModules();
        renderPage();
        addedListeners = [];
        removedListeners = [];
        containsMock.mockReset().mockResolvedValue(false);
        requestMock.mockReset().mockResolvedValue(false);
        removeMock.mockReset().mockResolvedValue(false);

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
        });
    });

    it('localizes every text, the illustration and the document before the first paint', async () => {
        await import('../../../src/onboarding/index');

        expect(document.title).toBe('msg:onboarding_title');
        expect(document.documentElement.lang).toBe('he');
        expect(document.documentElement.dir).toBe('rtl');
        expect(document.querySelector('h1')?.textContent).toBe('msg:onboarding_title');
        expect(getControl().enableButton.textContent).toBe('msg:popup_calendar_access_label');
        expect(document.querySelector('img')?.alt).toBe('msg:onboarding_how_image_alt');
        for (const element of document.querySelectorAll('[data-i18n]')) {
            expect(element.textContent).toMatch(/^msg:(onboarding|popup)_/);
        }
    });

    it('keeps the Calendar control hidden until the permission state is known', async () => {
        let resolveAccess: ((value: boolean) => void) | undefined;
        containsMock.mockReturnValue(new Promise<boolean>((resolve) => {
            resolveAccess = resolve;
        }));

        await import('../../../src/onboarding/index');

        const { control, enableButton, disableButton } = getControl();
        expect(control.hasAttribute('data-pending')).toBe(true);
        expect(enableButton.disabled).toBe(true);
        expect(disableButton.disabled).toBe(true);

        resolveAccess?.(true);

        await vi.waitFor(() => {
            expectCalendarState(true);
        });
        expect(containsMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
    });

    it('keeps the Calendar control pending when the permission state is unavailable', async () => {
        containsMock.mockRejectedValue(new Error('permission state unavailable'));

        await import('../../../src/onboarding/index');
        await new Promise((resolve) => {
            setTimeout(resolve, 0);
        });

        expect(getControl().control.hasAttribute('data-pending')).toBe(true);
        expect(getControl().enableButton.disabled).toBe(true);
    });

    it('offers the enable button while Calendar access is not granted', async () => {
        await loadPage();

        expectCalendarState(false);
        expect(requestMock).not.toHaveBeenCalled();
    });

    it('requests Calendar access within the click and shows it as enabled', async () => {
        await loadPage();
        requestMock.mockResolvedValue(true);
        containsMock.mockResolvedValue(true);
        const { enableButton, disableButton } = getControl();
        enableButton.focus();

        enableButton.click();

        // Requested synchronously, so the browser still sees the user gesture.
        expect(requestMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
        expect(enableButton.disabled).toBe(true);
        await vi.waitFor(() => {
            expectCalendarState(true);
        });
        expect(document.activeElement).toBe(disableButton);
    });

    it('stays off when the user declines the browser prompt', async () => {
        await loadPage();
        requestMock.mockResolvedValue(false);

        getControl().enableButton.click();

        await vi.waitFor(() => {
            expect(containsMock).toHaveBeenCalledTimes(2);
            expectCalendarState(false);
        });
    });

    it('removes Calendar access with the turn-off button', async () => {
        containsMock.mockResolvedValue(true);
        await loadPage();
        removeMock.mockResolvedValue(true);
        containsMock.mockResolvedValue(false);

        getControl().disableButton.click();

        expect(removeMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
        await vi.waitFor(() => {
            expectCalendarState(false);
        });
    });

    it('follows Calendar access changed from the popup or browser settings', async () => {
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
