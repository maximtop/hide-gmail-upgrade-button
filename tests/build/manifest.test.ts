import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { updateManifest } from '../../scripts/build/helpers';
import { ALL_BROWSER_TARGETS, BROWSER_TARGETS } from '../../scripts/constants';

const VERSION = '1.2.3';

const baseManifest = {
    manifest_version: 3,
    name: '__MSG_name__',
    permissions: ['storage', 'scripting'],
};

const transform = (browser: (typeof ALL_BROWSER_TARGETS)[number], manifest: object = baseManifest) => {
    return JSON.parse(updateManifest(JSON.stringify(manifest), { browser, version: VERSION }));
};

describe('updateManifest', () => {
    it.each([BROWSER_TARGETS.CHROME, BROWSER_TARGETS.EDGE])('%s: stamps version and service worker', (browser) => {
        const result = transform(browser);

        expect(result.version).toBe(VERSION);
        expect(result.background).toEqual({ service_worker: 'background.js' });
        expect(result.browser_specific_settings).toBeUndefined();
        expect(result.permissions).toEqual(baseManifest.permissions);
    });

    it('firefox: uses background scripts and gecko settings', () => {
        const result = transform(BROWSER_TARGETS.FIREFOX);

        expect(result.version).toBe(VERSION);
        expect(result.background.scripts).toContain('background.js');
        expect(result.background.service_worker).toBeUndefined();
        expect(result.browser_specific_settings.gecko.id).toContain('@');
        expect(result.browser_specific_settings.gecko.strict_min_version).toBeTruthy();
    });

    it('produces a valid MV3 manifest from the real src/manifest.json for every browser', () => {
        const realManifest = fs.readFileSync(path.join(import.meta.dirname, '../../src/manifest.json'), 'utf-8');

        for (const browser of ALL_BROWSER_TARGETS) {
            const result = JSON.parse(updateManifest(realManifest, { browser, version: VERSION }));

            expect(result.manifest_version).toBe(3);
            expect(result.default_locale).toBe('en');
            expect(result.version).toBe(VERSION);
            expect(result.background).toBeDefined();
        }
    });
});
