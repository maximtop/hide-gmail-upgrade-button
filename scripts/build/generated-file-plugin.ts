/**
 * @file Rspack plugin emitting a build-time generated text asset, used for
 * the pre-hide stylesheet derived from the feature registry.
 */

import { Compilation, sources } from '@rspack/core';
import type { Compiler } from '@rspack/core';

/**
 * Emits a single generated file into the compilation output.
 */
export class GeneratedFilePlugin {
    private readonly filename: string;

    private readonly content: string;

    /**
     * Creates the plugin.
     *
     * @param filename Output file name relative to the output directory.
     * @param content File content.
     */
    constructor(filename: string, content: string) {
        this.filename = filename;
        this.content = content;
    }

    /**
     * Registers asset emission on the compiler.
     *
     * @param compiler Rspack compiler instance.
     */
    apply(compiler: Compiler): void {
        compiler.hooks.thisCompilation.tap(GeneratedFilePlugin.name, (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: GeneratedFilePlugin.name,
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                () => {
                    compilation.emitAsset(this.filename, new sources.RawSource(this.content));
                },
            );
        });
    }
}
