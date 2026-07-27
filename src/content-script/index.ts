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

import { debugLog } from '../common/debug';
import { loadSettings, subscribeToSettings } from '../common/settings';
import { createHidingWatcher } from './watcher';

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

/**
 * Starts the watcher right away and reconciles with stored settings once
 * they load.
 */
const init = async (): Promise<void> => {
    debugLog('content script start', `readyState=${document.readyState}`, location.host);
    watcher.start();

    const settings = await loadSettings();
    debugLog('settings loaded', JSON.stringify(settings));
    watcher.applySettings(settings);
    subscribeToSettings((next) => {
        watcher.applySettings(next);
    });
};

if (!window.hgubContentScriptLoaded) {
    window.hgubContentScriptLoaded = true;
    init().catch(() => {
        // Settings unavailable (storage error): stay on the safe defaults —
        // the extension's single purpose is hiding, so defaults hide.
        // Toggling still works once storage recovers via the subscription.
    });
}
