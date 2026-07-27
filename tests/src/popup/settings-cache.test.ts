/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS } from '../../../src/common/settings';
import { readCachedSettings, writeCachedSettings } from '../../../src/popup/settings-cache';

describe('settings cache', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns null when nothing is cached', () => {
        expect(readCachedSettings()).toBeNull();
    });

    it('round-trips settings', () => {
        const settings = { hideUpgrade: false, hideGemini: true };

        writeCachedSettings(settings);

        expect(readCachedSettings()).toEqual(settings);
    });

    it('returns null for a corrupted cache entry', () => {
        localStorage.setItem('settings-cache', '{broken');

        expect(readCachedSettings()).toBeNull();
    });

    it('validates cached values, falling back to defaults per field', () => {
        localStorage.setItem('settings-cache', JSON.stringify({ hideUpgrade: 'yes' }));

        expect(readCachedSettings()).toEqual(DEFAULT_SETTINGS);
    });
});
