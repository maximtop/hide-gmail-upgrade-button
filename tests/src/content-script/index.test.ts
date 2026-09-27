/**
 * @file Content-script lifecycle test for restoring Calendar on revocation.
 *
 * @vitest-environment happy-dom
 */

import {
    beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
    CALENDAR_DISABLE_MESSAGE_TYPE,
    CALENDAR_HOSTNAME,
} from '../../../src/common/constants';

const addMessageListenerMock = vi.fn();
const removeMessageListenerMock = vi.fn();
const storageGetMock = vi.fn();
const storageOnChangedAddListenerMock = vi.fn();
const storageOnChangedRemoveListenerMock = vi.fn();
const EXTENSION_ID = 'test-extension-id';

type RuntimeMessageListener = (
    message: unknown,
    sender: chrome.runtime.MessageSender,
) => void;

type StorageChangeListener = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
) => void;

describe('content-script lifecycle', () => {
    beforeEach(() => {
        vi.resetModules();
        document.documentElement.innerHTML = `
            <head></head>
            <body>
                <div role="banner">
                    <button id="upgrade" role="link">Upgrade</button>
                </div>
            </body>
        `;
        delete window.hgubContentScriptLoaded;
        vi.stubGlobal('location', { hostname: CALENDAR_HOSTNAME });
        addMessageListenerMock.mockReset();
        removeMessageListenerMock.mockReset();
        storageGetMock.mockReset().mockResolvedValue({});
        storageOnChangedAddListenerMock.mockReset();
        storageOnChangedRemoveListenerMock.mockReset();

        vi.stubGlobal('chrome', {
            runtime: {
                id: EXTENSION_ID,
                onMessage: {
                    addListener: addMessageListenerMock,
                    removeListener: removeMessageListenerMock,
                },
            },
            storage: {
                local: { get: storageGetMock },
                onChanged: {
                    addListener: storageOnChangedAddListenerMock,
                    removeListener: storageOnChangedRemoveListenerMock,
                },
            },
        });
    });

    it('restores hidden elements and permits clean reinjection when Calendar access is removed', async () => {
        await import('../../../src/content-script');
        const upgrade = document.getElementById('upgrade') as HTMLElement;
        expect(upgrade.style.display).toBe('none');

        const listener = addMessageListenerMock.mock.calls[0]?.[0] as RuntimeMessageListener;
        listener({ type: CALENDAR_DISABLE_MESSAGE_TYPE }, { id: EXTENSION_ID });

        expect(upgrade.style.display).toBe('');
        expect(upgrade.hasAttribute('data-hgub-hidden')).toBe(false);
        expect(window.hgubContentScriptLoaded).toBe(false);
        expect(removeMessageListenerMock).toHaveBeenCalledWith(listener);
    });

    it('ignores the broadcast cleanup message on required non-Calendar hosts', async () => {
        vi.stubGlobal('location', { hostname: 'mail.google.com' });
        await import('../../../src/content-script');
        const upgrade = document.getElementById('upgrade') as HTMLElement;
        const listener = addMessageListenerMock.mock.calls[0]?.[0] as RuntimeMessageListener;

        listener({ type: CALENDAR_DISABLE_MESSAGE_TYPE }, { id: EXTENSION_ID });

        expect(upgrade.style.display).toBe('none');
        expect(window.hgubContentScriptLoaded).toBe(true);
        expect(removeMessageListenerMock).not.toHaveBeenCalled();
    });

    it.each([
        {
            caseName: 'a different extension sends the command',
            message: { type: CALENDAR_DISABLE_MESSAGE_TYPE },
            sender: { id: 'different-extension-id' },
        },
        {
            caseName: 'the payload is malformed',
            message: undefined,
            sender: { id: EXTENSION_ID },
        },
        {
            caseName: 'the message type is unsupported',
            message: { type: 'unsupported-message' },
            sender: { id: EXTENSION_ID },
        },
    ])('ignores cleanup when $caseName', async ({ message, sender }) => {
        await import('../../../src/content-script');
        const upgrade = document.getElementById('upgrade') as HTMLElement;
        const listener = addMessageListenerMock.mock.calls[0]?.[0] as RuntimeMessageListener;

        listener(message, sender);

        expect(upgrade.style.display).toBe('none');
        expect(window.hgubContentScriptLoaded).toBe(true);
        expect(removeMessageListenerMock).not.toHaveBeenCalled();
    });

    describe('live settings updates', () => {
        it('restores a button when its feature is switched off through the storage subscription', async () => {
            await import('../../../src/content-script');
            const upgrade = document.getElementById('upgrade') as HTMLElement;
            await vi.waitFor(() => {
                expect(upgrade.style.display).toBe('none');
            });

            const listener = storageOnChangedAddListenerMock.mock.calls[0]?.[0] as StorageChangeListener;
            listener({ settings: { newValue: { hideUpgrade: false, hideGemini: true } } }, 'local');

            expect(upgrade.style.display).toBe('');
        });

        // BUG: init() only reaches `subscribeToSettings(...)` after the awaited
        // `loadSettings()` call resolves (src/content-script/index.ts). When the
        // first load rejects, `init().catch()` swallows the error and the tab
        // never subscribes, so a later settings change is never applied — even
        // though the file's own header comment promises "Toggling still works
        // once storage recovers via the subscription." This reproducer commits
        // as `test.fails` so it starts failing (i.e. flips green) once init()
        // subscribes regardless of the initial load outcome.
        it.fails('re-subscribes to live settings once storage recovers after an initial load failure', async () => {
            storageGetMock.mockRejectedValueOnce(new Error('storage unavailable'));

            await import('../../../src/content-script');
            await new Promise((resolve) => {
                setTimeout(resolve, 0);
            });

            const listener = storageOnChangedAddListenerMock.mock.calls[0]?.[0] as
                StorageChangeListener | undefined;
            expect(listener).toBeDefined();

            const upgrade = document.getElementById('upgrade') as HTMLElement;
            listener?.({ settings: { newValue: { hideUpgrade: false, hideGemini: true } } }, 'local');

            expect(upgrade.style.display).toBe('');
        });
    });
});
