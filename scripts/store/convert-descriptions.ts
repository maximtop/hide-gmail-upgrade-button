/**
 * @file CLI: converts docs/store/STORE_DESCRIPTIONS.md into plain-text
 * per-locale files under build/store-descriptions/ for pasting into store
 * description fields. Run via `pnpm store:descriptions`.
 */

import fs from 'node:fs';
import path from 'node:path';

import { convertMarkdownToPlainText, extractLanguageSections } from './convert';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');

const SOURCE_FILE = path.join(ROOT_DIR, 'docs/store/STORE_DESCRIPTIONS.md');

const OUTPUT_DIR = path.join(ROOT_DIR, 'build/store-descriptions');

/**
 * Converts every language section into a plain-text file.
 *
 * @throws Error when the source contains no language sections.
 */
const main = (): void => {
    const content = fs.readFileSync(SOURCE_FILE, 'utf-8');
    const sections = extractLanguageSections(content);

    const codes = Object.keys(sections);
    if (codes.length === 0) {
        throw new Error(`No language sections found in ${SOURCE_FILE}`);
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (const code of codes) {
        const output = path.join(OUTPUT_DIR, `${code}.txt`);
        fs.writeFileSync(output, `${convertMarkdownToPlainText(sections[code] ?? '')}\n`);
        console.log(`wrote ${path.relative(ROOT_DIR, output)}`);
    }
};

main();
