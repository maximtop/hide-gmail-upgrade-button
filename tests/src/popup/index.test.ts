/**
 * @file Popup behavior tests for optional Google Calendar access.
 *
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CALENDAR_URL_PATTERN } from '../../../src/common/constants';

const containsMock = vi.fn();
const requestMock = vi.fn();
const removeMock = vi.fn();
let animationFrameCallbacks: FrameRequestCallback[] = [];

const flushAnimationFrame = (): void => {
    const callbacks = animationFrameCallbacks;
    animationFrameCallbacks = [];
    for (const callback of callbacks) {
        callback(performance.now());
    }
};

const renderPopupFixture = (): void => {
    document.body.className = '';
    document.body.innerHTML = `
        <main>
            <span id="title"></span>
            <span id="hide-upgrade-label"></span>
            <input type="checkbox" id="hide-upgrade">
            <span id="hide-gemini-label"></span>
            <input type="checkbox" id="hide-gemini">
            <label id="calendar-access-row" data-pending>
                <span id="calendar-access-label"></span>
                <input type="checkbox" id="calendar-access" disabled>
            </label>
            <span id="markup-note"></span>
            <a id="report-link"></a>
        </main>
    `;
};

const loadPopup = async (): Promise<void> => {
    await import('../../../src/popup/index');
    await vi.waitFor(() => {
        expect(document.getElementById('calendar-access-row')?.hasAttribute('data-pending')).toBe(false);
        expect(document.body.classList.contains('ready')).toBe(true);
    });
};

describe('popup Calendar access', () => {
    beforeEach(() => {
        vi.resetModules();
        localStorage.clear();
        renderPopupFixture();
        animationFrameCallbacks = [];
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
            animationFrameCallbacks.push(callback);
            return animationFrameCallbacks.length;
        });

        containsMock.mockReset().mockResolvedValue(false);
        requestMock.mockReset().mockResolvedValue(false);
        removeMock.mockReset().mockResolvedValue(false);

        vi.stubGlobal('chrome', {
            i18n: { getMessage: (key: string) => key },
            permissions: {
                contains: containsMock,
                request: requestMock,
                remove: removeMock,
            },
            storage: {
                local: {
                    get: vi.fn().mockResolvedValue({}),
                    set: vi.fn().mockResolvedValue(undefined),
                },
                onChanged: {
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                },
            },
        });
    });

    it('renders granted access from the browser permission state', async () => {
        containsMock.mockResolvedValue(true);

        await loadPopup();

        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        expect(toggle.checked).toBe(true);
        expect(document.getElementById('calendar-access-label')?.textContent)
            .toBe('popup_calendar_access_label');
        expect(containsMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
    });

    it('reveals async access only after applying its authoritative state', async () => {
        let resolveAccess: ((value: boolean) => void) | undefined;
        containsMock.mockReturnValue(new Promise<boolean>((resolve) => {
            resolveAccess = resolve;
        }));

        await import('../../../src/popup/index');

        const row = document.getElementById('calendar-access-row') as HTMLElement;
        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        expect(document.body.classList.contains('ready')).toBe(false);
        expect(row.hasAttribute('data-pending')).toBe(true);
        expect(toggle.disabled).toBe(true);

        let checkedWhenRevealed: boolean | undefined;
        const observer = new MutationObserver(() => {
            if (!row.hasAttribute('data-pending')) {
                checkedWhenRevealed = toggle.checked;
            }
        });
        observer.observe(row, { attributes: true, attributeFilter: ['data-pending'] });

        resolveAccess?.(true);

        await vi.waitFor(() => {
            expect(row.hasAttribute('data-pending')).toBe(false);
        });
        observer.disconnect();

        expect(checkedWhenRevealed).toBe(true);
        expect(toggle.checked).toBe(true);
        expect(toggle.disabled).toBe(false);
        expect(document.body.classList.contains('ready')).toBe(true);
        expect(document.body.classList.contains('interactive')).toBe(false);

        flushAnimationFrame();
        expect(document.body.classList.contains('interactive')).toBe(false);

        flushAnimationFrame();
        expect(document.body.classList.contains('interactive')).toBe(true);
    });

    it('keeps async access pending when the authoritative state is unavailable', async () => {
        containsMock.mockRejectedValue(new Error('permission state unavailable'));

        await import('../../../src/popup/index');
        await vi.waitFor(() => {
            expect(containsMock).toHaveBeenCalledTimes(1);
        });
        await new Promise((resolve) => {
            setTimeout(resolve, 0);
        });

        const row = document.getElementById('calendar-access-row') as HTMLElement;
        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        expect(row.hasAttribute('data-pending')).toBe(true);
        expect(toggle.disabled).toBe(true);
        expect(document.body.classList.contains('ready')).toBe(true);
        expect(document.body.classList.contains('interactive')).toBe(false);

        flushAnimationFrame();
        flushAnimationFrame();

        expect(document.body.classList.contains('interactive')).toBe(true);
        expect(row.hasAttribute('data-pending')).toBe(true);
    });

    it('requests optional Calendar access only after the user enables it', async () => {
        await loadPopup();
        requestMock.mockResolvedValue(true);
        containsMock.mockResolvedValue(true);

        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change', { bubbles: true }));

        expect(requestMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
        await vi.waitFor(() => {
            expect(toggle.checked).toBe(true);
            expect(toggle.disabled).toBe(false);
        });
    });

    it('removes Calendar access when the user disables it', async () => {
        containsMock.mockResolvedValue(true);
        await loadPopup();
        removeMock.mockResolvedValue(true);
        containsMock.mockResolvedValue(false);

        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change', { bubbles: true }));

        await vi.waitFor(() => {
            expect(removeMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
            expect(toggle.checked).toBe(false);
            expect(toggle.disabled).toBe(false);
        });
    });

    it('keeps Calendar enabled when the browser refuses to remove access', async () => {
        containsMock.mockResolvedValue(true);
        await loadPopup();
        removeMock.mockResolvedValue(false);

        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change', { bubbles: true }));

        await vi.waitFor(() => {
            expect(removeMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
            expect(toggle.checked).toBe(true);
            expect(toggle.disabled).toBe(false);
        });
    });

    it.each([
        { initial: false, requested: true, authoritative: true, operation: 'request' },
        { initial: true, requested: false, authoritative: false, operation: 'remove' },
    ])(
        'renders authoritative access when $operation rejects',
        async ({ initial, requested, authoritative, operation }) => {
            containsMock.mockResolvedValue(initial);
            await loadPopup();
            const operationMock = operation === 'request' ? requestMock : removeMock;
            operationMock.mockRejectedValueOnce(new Error(`${operation} failed after changing access`));
            containsMock.mockResolvedValue(authoritative);

            const toggle = document.getElementById('calendar-access') as HTMLInputElement;
            toggle.checked = requested;
            toggle.dispatchEvent(new Event('change', { bubbles: true }));

            await vi.waitFor(() => {
                expect(operationMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
                expect(containsMock).toHaveBeenCalledTimes(2);
                expect(toggle.checked).toBe(authoritative);
                expect(toggle.disabled).toBe(false);
            });
        },
    );

    it.each([
        { initial: false, next: true, operation: 'request' },
        { initial: true, next: false, operation: 'remove' },
    ])('restores $initial when $operation cannot confirm its result', async ({ initial, next }) => {
        containsMock.mockResolvedValue(initial);
        await loadPopup();
        containsMock.mockRejectedValueOnce(new Error('permission state unavailable'));

        const toggle = document.getElementById('calendar-access') as HTMLInputElement;
        toggle.checked = next;
        toggle.dispatchEvent(new Event('change', { bubbles: true }));

        await vi.waitFor(() => {
            expect(toggle.disabled).toBe(false);
            expect(toggle.checked).toBe(initial);
        });
    });
});
