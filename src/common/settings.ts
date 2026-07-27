/**
 * @file Typed extension settings: contract, safe defaults, validation and a
 * storage adapter over `chrome.storage.local`.
 *
 * The adapter is the single read/write point for settings — popup and
 * content script never touch raw storage keys directly, and change
 * propagation relies on `chrome.storage.onChanged`, so there is no separate
 * messaging layer to keep in sync.
 */

/**
 * User-facing settings of the extension.
 */
export interface Settings {
    /**
     * Whether the Gmail Upgrade button is hidden.
     */
    hideUpgrade: boolean;

    /**
     * Whether the Gmail Ask Gemini button is hidden.
     */
    hideGemini: boolean;
}

/**
 * Safe defaults: the extension hides both buttons out of the box — that is
 * its single purpose; the user can switch either off in the popup.
 */
export const DEFAULT_SETTINGS: Settings = {
    hideUpgrade: true,
    hideGemini: true,
};

const STORAGE_KEY = 'settings';

/**
 * Validates a raw storage value into a complete settings object: unknown
 * shapes and missing or non-boolean fields fall back to defaults, extra
 * fields are dropped.
 *
 * @param raw Value read from storage, of unknown shape.
 *
 * @returns Complete, valid settings.
 */
export const validateSettings = (raw: unknown): Settings => {
    const source = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;

    return {
        hideUpgrade: typeof source.hideUpgrade === 'boolean' ? source.hideUpgrade : DEFAULT_SETTINGS.hideUpgrade,
        hideGemini: typeof source.hideGemini === 'boolean' ? source.hideGemini : DEFAULT_SETTINGS.hideGemini,
    };
};

/**
 * Loads settings from local storage.
 *
 * @returns Validated settings, defaults when nothing is stored.
 */
export const loadSettings = async (): Promise<Settings> => {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return validateSettings(stored[STORAGE_KEY]);
};

/**
 * Merges a partial update into the stored settings and persists the result.
 *
 * @param patch Fields to change.
 *
 * @returns The complete settings that were persisted.
 */
export const saveSettings = async (patch: Partial<Settings>): Promise<Settings> => {
    const current = await loadSettings();
    const next: Settings = { ...current, ...patch };
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
    return next;
};

/**
 * Subscribes to settings changes made anywhere in the extension.
 *
 * @param onChange Called with the new validated settings.
 *
 * @returns Unsubscribe function.
 */
export const subscribeToSettings = (onChange: (settings: Settings) => void): () => void => {
    const listener = (
        changes: Record<string, chrome.storage.StorageChange>,
        area: string,
    ): void => {
        if (area === 'local' && changes[STORAGE_KEY]) {
            onChange(validateSettings(changes[STORAGE_KEY].newValue));
        }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
        chrome.storage.onChanged.removeListener(listener);
    };
};
