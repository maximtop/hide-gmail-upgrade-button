import {
    beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
    DEFAULT_SETTINGS, loadSettings, saveSettings, subscribeToSettings, validateSettings,
} from '../../../src/common/settings';

describe('validateSettings', () => {
    it('returns defaults for missing or malformed storage values', () => {
        expect(validateSettings(undefined)).toEqual(DEFAULT_SETTINGS);
        expect(validateSettings(null)).toEqual(DEFAULT_SETTINGS);
        expect(validateSettings('broken')).toEqual(DEFAULT_SETTINGS);
        expect(validateSettings(42)).toEqual(DEFAULT_SETTINGS);
    });

    it('keeps valid fields and fills the rest with defaults', () => {
        expect(validateSettings({ hideUpgrade: false })).toEqual({
            hideUpgrade: false,
            hideGemini: DEFAULT_SETTINGS.hideGemini,
        });
        expect(validateSettings({ hideGemini: false })).toEqual({
            hideUpgrade: DEFAULT_SETTINGS.hideUpgrade,
            hideGemini: false,
        });
    });

    it('rejects non-boolean field values', () => {
        expect(validateSettings({ hideUpgrade: 'yes', hideGemini: 1 })).toEqual(DEFAULT_SETTINGS);
    });

    it('drops unknown fields', () => {
        const result = validateSettings({ hideUpgrade: false, legacyField: true });

        expect(result).toEqual({ hideUpgrade: false, hideGemini: DEFAULT_SETTINGS.hideGemini });
        expect('legacyField' in result).toBe(false);
    });

    it('defaults hide both buttons', () => {
        expect(DEFAULT_SETTINGS).toEqual({ hideUpgrade: true, hideGemini: true });
    });
});

describe('settings storage adapter', () => {
    const getMock = vi.fn();
    const setMock = vi.fn();
    const addListenerMock = vi.fn();
    const removeListenerMock = vi.fn();

    beforeEach(() => {
        getMock.mockReset().mockResolvedValue({});
        setMock.mockReset().mockResolvedValue(undefined);
        addListenerMock.mockReset();
        removeListenerMock.mockReset();
        vi.stubGlobal('chrome', {
            storage: {
                local: { get: getMock, set: setMock },
                onChanged: { addListener: addListenerMock, removeListener: removeListenerMock },
            },
        });
    });

    it('loadSettings reads the settings key and falls back to defaults when nothing is stored', async () => {
        await expect(loadSettings()).resolves.toEqual(DEFAULT_SETTINGS);

        expect(getMock).toHaveBeenCalledWith('settings');
    });

    it('loadSettings validates whatever was actually stored', async () => {
        getMock.mockResolvedValue({ settings: { hideUpgrade: false, legacyField: true } });

        await expect(loadSettings()).resolves.toEqual({ hideUpgrade: false, hideGemini: true });
    });

    it('saveSettings merges the patch onto the currently stored settings, keeping the other field', async () => {
        getMock.mockResolvedValue({ settings: { hideUpgrade: false, hideGemini: true } });

        const result = await saveSettings({ hideGemini: false });

        expect(result).toEqual({ hideUpgrade: false, hideGemini: false });
        expect(setMock).toHaveBeenCalledWith({ settings: { hideUpgrade: false, hideGemini: false } });
    });

    it('subscribeToSettings reports the new value, validated, for a local settings change', () => {
        const onChange = vi.fn();
        subscribeToSettings(onChange);
        const listener = addListenerMock.mock.calls[0]?.[0] as (
            changes: Record<string, chrome.storage.StorageChange>,
            area: string,
        ) => void;

        listener({ settings: { newValue: { hideUpgrade: false, hideGemini: 'not-a-boolean' } } }, 'local');

        expect(onChange).toHaveBeenCalledWith({ hideUpgrade: false, hideGemini: true });
    });

    it.each([
        {
            caseName: 'a non-local storage area',
            area: 'sync',
            changes: { settings: { newValue: { hideUpgrade: false } } },
        },
        { caseName: 'an unrelated storage key', area: 'local', changes: { otherKey: { newValue: 1 } } },
    ])('ignores $caseName', ({ area, changes }) => {
        const onChange = vi.fn();
        subscribeToSettings(onChange);
        const listener = addListenerMock.mock.calls[0]?.[0] as (
            changes: Record<string, chrome.storage.StorageChange>,
            area: string,
        ) => void;

        listener(changes, area);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('unsubscribe removes exactly the registered listener', () => {
        const unsubscribe = subscribeToSettings(vi.fn());
        const listener = addListenerMock.mock.calls[0]?.[0];

        unsubscribe();

        expect(removeListenerMock).toHaveBeenCalledWith(listener);
    });
});
