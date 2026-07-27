import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS, validateSettings } from '../../../src/common/settings';

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
