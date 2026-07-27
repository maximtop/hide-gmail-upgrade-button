/**
 * @file Gmail content script: hides the Upgrade button and keeps it hidden
 * across Gmail's dynamic re-renders via the mutation watcher.
 *
 * Scope note for follow-up tasks: the user-facing toggle with a stored
 * setting arrives separately; until it exists, hiding is unconditionally on.
 */

import { createUpgradeButtonWatcher } from './watcher';

const watcher = createUpgradeButtonWatcher(document);

/**
 * Starts the watcher once the document is ready enough to contain the header.
 */
const init = (): void => {
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

init();
