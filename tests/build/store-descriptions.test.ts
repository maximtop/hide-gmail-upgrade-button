import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { convertMarkdownToPlainText, extractLanguageSections } from '../../scripts/store/convert';

describe('convertMarkdownToPlainText', () => {
    it('strips headings, emphasis and code markers', () => {
        const result = convertMarkdownToPlainText('#### Key **features** with `code`');

        expect(result).toBe('Key features with code');
    });

    it('turns list markers into bullets', () => {
        const result = convertMarkdownToPlainText('- first\n- second\n1. third');

        expect(result).toBe('• first\n• second\n• third');
    });

    it('drops rules and collapses excessive blank lines', () => {
        const result = convertMarkdownToPlainText('a\n\n\n\n---\nb\n====');

        expect(result).not.toContain('---');
        expect(result).not.toContain('====');
        expect(result).not.toContain('\n\n\n');
    });
});

describe('extractLanguageSections', () => {
    it('splits a document into locale sections', () => {
        const doc = '# Title\nintro\n\n## English (en)\nhello\n\n## Russian (ru)\nпривет\n';

        const sections = extractLanguageSections(doc);

        expect(Object.keys(sections).sort()).toEqual(['en', 'ru']);
        expect(sections.en).toBe('hello');
        expect(sections.ru).toBe('привет');
    });
});

describe('real store descriptions', () => {
    const source = fs.readFileSync(
        path.join(import.meta.dirname, '../../docs/store/STORE_DESCRIPTIONS.md'),
        'utf-8',
    );
    const sections = extractLanguageSections(source);

    it('contain at least en and ru sections', () => {
        expect(Object.keys(sections)).toEqual(expect.arrayContaining(['en', 'ru']));
    });

    it('convert to store-ready plain text without markdown leftovers, within the 16k limit', () => {
        for (const [, body] of Object.entries(sections)) {
            const plain = convertMarkdownToPlainText(body);

            expect(plain.length).toBeGreaterThan(500);
            expect(plain.length).toBeLessThanOrEqual(16000);
            expect(plain).not.toMatch(/^#{1,6}\s/m);
            expect(plain).not.toContain('**');
        }
    });

    it('mention permissions, privacy and the non-affiliation disclaimer in every language', () => {
        expect(sections.en).toContain('Permissions');
        expect(sections.en).toContain('PRIVACY.md');
        expect(sections.en).toContain('not affiliated');
        expect(sections.ru).toContain('Разрешения');
        expect(sections.ru).toContain('PRIVACY.md');
        expect(sections.ru).toContain('не аффилировано');
    });
});
