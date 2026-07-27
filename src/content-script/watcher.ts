/**
 * @file Mutation watcher that keeps the Upgrade button hidden across Gmail's
 * dynamic re-renders and SPA navigation.
 *
 * The button is rendered into the header asynchronously after load (verified
 * on live Gmail), and navigation re-renders can recreate it, so a one-shot
 * pass is not enough. Design decisions:
 *
 * - The whole document is observed (childList only): Gmail can replace the
 *   header wholesale, and an observer scoped to a detached header would go
 *   silent forever. Cost stays bounded — mutations are coalesced into one
 *   check per debounce window, and while the button stays hidden the check
 *   short-circuits without scanning the DOM.
 * - Only `childList` mutations are observed, never attributes, so the
 *   watcher's own style/attribute writes cannot re-trigger it — no loops by
 *   construction.
 */

import { MUTATION_DEBOUNCE_MS } from '../common/constants';
import { findUpgradeButton } from './detector';
import { ensureHidden, hideElement, isHiddenByExtension } from './visibility';

/**
 * Lifecycle handle of the upgrade button watcher.
 */
export interface UpgradeButtonWatcher {
    /**
     * Applies hiding immediately and starts observing. Idempotent.
     */
    start(): void;

    /**
     * Stops observing and cancels any pending check. Idempotent; hidden
     * state of the button is left as is.
     */
    stop(): void;
}

/**
 * Creates a watcher that hides the Upgrade button and re-applies hiding
 * after DOM changes.
 *
 * @param doc Document to watch.
 * @param debounceMs Mutation coalescing window; defaults to
 * {@link MUTATION_DEBOUNCE_MS}.
 *
 * @returns Watcher lifecycle handle.
 */
export const createUpgradeButtonWatcher = (
    doc: Document,
    debounceMs: number = MUTATION_DEBOUNCE_MS,
): UpgradeButtonWatcher => {
    let observer: MutationObserver | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let hiddenButton: HTMLElement | null = null;

    /**
     * Runs one hiding pass: cheap short-circuit while the previously hidden
     * button is still in place, full detector scan otherwise.
     */
    const check = (): void => {
        if (hiddenButton && hiddenButton.isConnected && isHiddenByExtension(hiddenButton)) {
            ensureHidden(hiddenButton);
            return;
        }

        hiddenButton = null;
        const button = findUpgradeButton(doc);
        if (button) {
            hideElement(button);
            hiddenButton = button;
        }
    };

    /**
     * Coalesces mutation bursts into a single delayed check.
     */
    const scheduleCheck = (): void => {
        if (debounceTimer !== null) {
            return;
        }
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            check();
        }, debounceMs);
    };

    return {
        start: (): void => {
            if (observer) {
                return;
            }
            check();
            observer = new MutationObserver(scheduleCheck);
            observer.observe(doc.documentElement ?? doc, { childList: true, subtree: true });
        },

        stop: (): void => {
            if (debounceTimer !== null) {
                clearTimeout(debounceTimer);
                debounceTimer = null;
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        },
    };
};
