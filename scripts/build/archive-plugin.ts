/**
 * @file Rspack plugin producing a zip archive of the emitted build directory,
 * ready to be uploaded to extension stores.
 */

import fs from 'node:fs';
import path from 'node:path';

import AdmZip from 'adm-zip';
import type { Compiler } from '@rspack/core';

/**
 * Zips a directory into an archive file, creating parent directories as needed.
 *
 * @param sourceDir Directory whose contents are archived.
 * @param archivePath Destination path of the zip file.
 */
export const writeArchive = (sourceDir: string, archivePath: string): void => {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    fs.mkdirSync(path.dirname(archivePath), { recursive: true });
    zip.writeZip(archivePath);
};

/**
 * Rspack plugin that archives the output directory after every emit.
 */
export class ArchivePlugin {
    private readonly sourceDir: string;

    private readonly archivePath: string;

    /**
     * Creates the plugin.
     *
     * @param sourceDir Directory whose contents are archived.
     * @param archivePath Destination path of the zip file.
     */
    constructor(sourceDir: string, archivePath: string) {
        this.sourceDir = sourceDir;
        this.archivePath = archivePath;
    }

    /**
     * Registers the archive step on the compiler.
     *
     * @param compiler Rspack compiler instance.
     */
    apply(compiler: Compiler): void {
        compiler.hooks.afterEmit.tap(ArchivePlugin.name, () => {
            writeArchive(this.sourceDir, this.archivePath);
        });
    }
}
