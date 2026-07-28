import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import captions from '../../scripts/store/screenshot-captions.json';

describe('screenshot captions', () => {
    it('cover exactly the same locales as src/_locales', () => {
        const locales = fs.readdirSync(path.join(import.meta.dirname, '../../src/_locales')).sort();

        expect(Object.keys(captions).sort()).toEqual(locales);
    });

    it('every locale has the full caption shape with non-empty texts', () => {
        for (const [locale, entry] of Object.entries(captions)) {
            expect(entry.headlines, locale).toHaveLength(4);
            expect(entry.sublines, locale).toHaveLength(4);
            expect(entry.apps, locale).toHaveLength(3);
            expect(entry.bullets, locale).toHaveLength(3);
            expect(entry.before.length, locale).toBeGreaterThan(0);
            expect(entry.after.length, locale).toBeGreaterThan(0);
            const texts = [...entry.headlines, ...entry.sublines, ...entry.apps, ...entry.bullets];
            for (const text of texts) {
                expect(text.trim().length, locale).toBeGreaterThan(0);
            }
        }
    });
});
