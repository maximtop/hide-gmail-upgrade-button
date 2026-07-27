/**
 * @file Renders the extension icon PNG set from the master SVGs in
 * assets/icon/ into src/assets/icons/. Run via `pnpm icons` after changing
 * the master artwork; the generated PNGs are committed.
 */

import fs from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');

const MASTER_SVG = path.join(ROOT_DIR, 'assets/icon/icon.svg');

const MASTER_SVG_16 = path.join(ROOT_DIR, 'assets/icon/icon-16.svg');

const OUTPUT_DIR = path.join(ROOT_DIR, 'src/assets/icons');

/**
 * SVG rasterization density: high enough that every target size downscales
 * from a sharp oversampled render instead of upscaling.
 */
const SVG_DENSITY = 300;

/**
 * Icon sizes required by the manifest, mapped to their master file — 16 px
 * uses the thick-slash variant so the white line survives downscaling.
 */
const EXPORTS: ReadonlyArray<{ size: number; source: string }> = [
    { size: 16, source: MASTER_SVG_16 },
    { size: 32, source: MASTER_SVG },
    { size: 48, source: MASTER_SVG },
    { size: 128, source: MASTER_SVG },
];

/**
 * Renders all icon sizes.
 */
const main = async (): Promise<void> => {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const { size, source } of EXPORTS) {
        const output = path.join(OUTPUT_DIR, `icon-${size}.png`);
        await sharp(source, { density: SVG_DENSITY })
            .resize(size, size)
            .png()
            .toFile(output);
        console.log(`rendered ${path.relative(ROOT_DIR, output)}`);
    }
};

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
