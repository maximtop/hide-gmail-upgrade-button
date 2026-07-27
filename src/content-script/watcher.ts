/**
 * @file Mutation watcher that keeps the enabled header buttons hidden across
 * Gmail's dynamic re-renders and SPA navigation.
 *
 * The buttons are rendered into the header asynchronously after load
 * (verified on live Gmail), and navigation re-renders can recreate them, so
 * a one-shot pass is not enough. Design decisions:
 *
 * - The whole document is observed (childList only): Gmail can replace the
 *   header wholesale, and an observer scoped to a detached header would go
 *   silent forever. Cost stays bounded — mutation bursts are coalesced into
 *   one check per microtask, and while a button stays hidden its check
 *   short-circuits without scanning the DOM.
 * - Checks run in the same frame as the mutation (microtask, before paint),
 *   so a late-inserted button's reserved space collapses before it ever
 *   renders — a timer-based debounce would let the empty gap flash.
 * - Only `childList` mutations are observed, never attributes, so the
 *   watcher's own style/attribute writes cannot re-trigger it — no loops by
 *   construction.
 */

import { DEFAULT_SETTINGS } from '../common/settings';
import type { Settings } from '../common/settings';
import { findHideTarget } from './detector';
import { HIDE_FEATURES } from './features';
import { syncPrehideOverrides } from './prehide';
import {
    ensureHidden,
    hideElement,
    isHiddenByExtension,
    restoreAllHidden,
} from './visibility';

/**
 * Lifecycle handle of the hiding watcher.
 */
export interface HidingWatcher {
    /**
     * Applies hiding for the current settings immediately and starts
     * observing. Idempotent.
     */
    start(): void;

    /**
     * Stops observing and cancels any pending check. Idempotent; hidden
     * elements are left as is.
     */
    stop(): void;

    /**
     * Replaces the active settings, restoring elements of features that got
     * switched off and hiding buttons of features that got switched on.
     *
     * @param next New settings.
     */
    applySettings(next: Settings): void;
}

/**
 * Creates a watcher that hides the enabled header buttons and re-applies
 * hiding after DOM changes.
 *
 * @param doc Document to watch.
 *
 * @returns Watcher handle; starts out with {@link DEFAULT_SETTINGS}.
 */
export const createHidingWatcher = (doc: Document): HidingWatcher => {
    let observer: MutationObserver | null = null;
    let checkQueued = false;
    let stopped = true;
    let settings: Settings = DEFAULT_SETTINGS;
    const hiddenByFeature = new Map<string, HTMLElement>();

    /**
     * Runs one hiding pass over the enabled features: cheap short-circuit
     * while a previously hidden element is still in place, full detector
     * scan otherwise.
     */
    const check = (): void => {
        for (const feature of HIDE_FEATURES) {
            if (!settings[feature.settingKey]) {
                continue;
            }

            const tracked = hiddenByFeature.get(feature.id);
            if (tracked && tracked.isConnected && isHiddenByExtension(tracked)) {
                ensureHidden(tracked);
                continue;
            }

            hiddenByFeature.delete(feature.id);
            const button = feature.findButton(doc);
            if (button) {
                const target = findHideTarget(button);
                hideElement(target, feature.id);
                hiddenByFeature.set(feature.id, target);
            }
        }
    };

    /**
     * Coalesces mutation bursts into a single check per microtask — still
     * within the current frame, so hiding lands before the next paint.
     */
    const scheduleCheck = (): void => {
        if (checkQueued) {
            return;
        }
        checkQueued = true;
        queueMicrotask(() => {
            checkQueued = false;
            if (!stopped) {
                check();
            }
        });
    };

    return {
        start: (): void => {
            if (observer) {
                return;
            }
            stopped = false;
            check();
            observer = new MutationObserver(scheduleCheck);
            observer.observe(doc.documentElement ?? doc, { childList: true, subtree: true });
        },

        stop: (): void => {
            stopped = true;
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        },

        applySettings: (next: Settings): void => {
            for (const feature of HIDE_FEATURES) {
                if (settings[feature.settingKey] && !next[feature.settingKey]) {
                    restoreAllHidden(doc, feature.id);
                    hiddenByFeature.delete(feature.id);
                }
            }
            settings = next;
            syncPrehideOverrides(doc, next);
            check();
        },
    };
};
