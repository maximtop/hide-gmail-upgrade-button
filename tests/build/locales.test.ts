import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { updateLocalesName } from '../../scripts/build/helpers';
import { CHANNEL_ENVS } from '../../scripts/constants';

const messages = {
    name: { message: 'Hide Upgrade Button for Gmail', description: 'Extension name.' },
    description: { message: 'Hides the Upgrade button', description: 'Short description.' },
};

describe('updateLocalesName', () => {
    it('dev: appends a suffix to the name and keeps other keys intact', () => {
        const result = JSON.parse(updateLocalesName(JSON.stringify(messages), CHANNEL_ENVS.DEV));

        expect(result.name.message.startsWith(messages.name.message)).toBe(true);
        expect(result.name.message).toMatch(/\(Dev\)$/);
        expect(result.description).toEqual(messages.description);
    });

    it('release: leaves messages unchanged', () => {
        const result = JSON.parse(updateLocalesName(JSON.stringify(messages), CHANNEL_ENVS.RELEASE));

        expect(result).toEqual(messages);
    });
});

describe('locale files', () => {
    const localesDir = path.join(import.meta.dirname, '../../src/_locales');
    const locales = fs.readdirSync(localesDir);

    it('ship at least en and ru among the 40 locales', () => {
        expect(locales).toEqual(expect.arrayContaining(['en', 'ru']));
        expect(locales.length).toBeGreaterThanOrEqual(40);
    });

    it('keep every description within the Chrome Web Store limit of 132 characters', () => {
        for (const locale of locales) {
            const filePath = path.join(localesDir, locale, 'messages.json');
            const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            expect(messages.description.message.length).toBeLessThanOrEqual(132);
        }
    });

    it('all locales have the same keys, including required name and description', () => {
        const keySets = locales.map((locale) => {
            const filePath = path.join(localesDir, locale, 'messages.json');
            return Object.keys(JSON.parse(fs.readFileSync(filePath, 'utf-8'))).sort();
        });

        for (const keys of keySets) {
            expect(keys).toEqual(keySets[0]);
            expect(keys).toContain('name');
            expect(keys).toContain('description');
        }
    });
});
