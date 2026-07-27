/**
 * @file Synchronous popup-local cache of the last known settings.
 *
 * `chrome.storage` is async, so a popup that waits for it either flashes
 * default state or opens empty for a frame. The popup instead renders
 * instantly from this `localStorage` cache (synchronous, same extension
 * origin) and reconciles with the real storage right after. The cache is
 * refreshed on every load and save, so it only ever lags for the very first
 * popup open after install — when settings equal the defaults anyway.
 */

import { validateSettings } from '../common/settings';
import type { Settings } from '../common/settings';

const CACHE_KEY = 'settings-cache';

/**
 * Reads the cached settings synchronously.
 *
 * @returns Validated settings, or null when there is no usable cache.
 */
export const readCachedSettings = (): Settings | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw === null) {
            return null;
        }
        return validateSettings(JSON.parse(raw));
    } catch {
        return null;
    }
};

/**
 * Stores settings into the synchronous cache.
 *
 * @param settings Settings to cache.
 */
export const writeCachedSettings = (settings: Settings): void => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
    } catch {
        // Cache is best-effort; the popup still works without it.
    }
};
