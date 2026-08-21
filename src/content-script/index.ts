/**
 * @file Content script entrypoint: hides the enabled header buttons and
 * keeps them hidden across re-renders via the mutation watcher.
 *
 * Runs at document_start and starts watching immediately with the default
 * settings (hide everything): Drive builds its header during the initial
 * page load, so waiting for document readiness or for the async settings
 * read would let the buttons' reserved space paint and then collapse — a
 * visible flash. The stored settings are applied as soon as they load
 * (milliseconds later), restoring anything the user switched off; settings
 * changes keep applying live through the storage subscription.
 */

import {
    CALENDAR_DISABLE_MESSAGE_TYPE,
    CALENDAR_HOSTNAME,
} from '../common/constants';
import type { ExtensionMessage } from '../common/messages';
import { loadSettings, subscribeToSettings } from '../common/settings';
import type { Settings } from '../common/settings';
import { createHidingWatcher } from './watcher';

const SHOW_ALL_SETTINGS: Settings = {
    hideUpgrade: false,
    hideGemini: false,
};

declare global {
    /**
     * Extension-world window state.
     */
    interface Window {
        /**
         * Set on first run; guards against double initialization when the
         * background re-injects into a tab that already has the manifest
         * content script (same isolated world).
         */
        hgubContentScriptLoaded?: boolean;
    }
}

const watcher = createHidingWatcher(document);
let unsubscribeFromSettings: (() => void) | undefined;
let active = true;

/**
 * Stops this content-script instance and restores the page. Resetting the
 * load guard lets a later Calendar permission grant re-inject cleanly into
 * the same tab.
 */
const cleanup = (): void => {
    if (!active) {
        return;
    }
    active = false;
    unsubscribeFromSettings?.();
    watcher.stop();
    watcher.applySettings(SHOW_ALL_SETTINGS);
    chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
    window.hgubContentScriptLoaded = false;
};

/**
 * Handles lifecycle messages relevant to a running content script.
 *
 * @param message Runtime message payload.
 * @param sender Runtime message sender.
 */
const handleRuntimeMessage = (
    message: ExtensionMessage | null | undefined,
    sender: chrome.runtime.MessageSender,
): void => {
    if (
        sender.id === chrome.runtime.id
        && message?.type === CALENDAR_DISABLE_MESSAGE_TYPE
        && location.hostname === CALENDAR_HOSTNAME
    ) {
        cleanup();
    }
};

/**
 * Starts the watcher right away and reconciles with stored settings once
 * they load.
 */
const init = async (): Promise<void> => {
    watcher.start();

    const settings = await loadSettings();
    if (!active) {
        return;
    }
    watcher.applySettings(settings);
    unsubscribeFromSettings = subscribeToSettings((next) => {
        watcher.applySettings(next);
    });
};

if (!window.hgubContentScriptLoaded) {
    window.hgubContentScriptLoaded = true;
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    init().catch(() => {
        // Settings unavailable (storage error): stay on the safe defaults —
        // the extension's single purpose is hiding, so defaults hide.
        // Toggling still works once storage recovers via the subscription.
    });
}
