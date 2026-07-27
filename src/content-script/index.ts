/**
 * @file Gmail content script: loads the user settings, hides the enabled
 * header buttons and keeps them hidden across Gmail's re-renders via the
 * mutation watcher. Settings changes apply live through storage
 * subscription — no Gmail reload needed.
 */

import { loadSettings, subscribeToSettings } from '../common/settings';
import { createHidingWatcher } from './watcher';

const watcher = createHidingWatcher(document);

/**
 * Starts the watcher once the document is ready enough to contain the header.
 */
const startWhenReady = (): void => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        watcher.start();
        return;
    }

    document.addEventListener(
        'readystatechange',
        () => {
            watcher.start();
        },
        { once: true },
    );
};

/**
 * Loads settings, starts the watcher and keeps settings in sync.
 */
const init = async (): Promise<void> => {
    const settings = await loadSettings();
    watcher.applySettings(settings);
    startWhenReady();
    subscribeToSettings((next) => {
        watcher.applySettings(next);
    });
};

init().catch(() => {
    // Settings unavailable (storage error): fail closed by doing nothing
    // rather than hiding against an unknown user preference.
});
