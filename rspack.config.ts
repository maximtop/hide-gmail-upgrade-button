/**
 * @file Factory of per-browser Rspack configurations for the extension build.
 */

import fs from 'node:fs';
import path from 'node:path';

import rspack from '@rspack/core';

import { ArchivePlugin } from './scripts/build/archive-plugin';
import { GeneratedFilePlugin } from './scripts/build/generated-file-plugin';
import { updateLocalesName, updateManifest } from './scripts/build/helpers';
import { CHANNEL_ENVS, STORE_LISTING_URLS } from './scripts/constants';
import { ONBOARDING_PAGE_FILE } from './src/common/constants';
import { buildPrehideCss } from './src/content-script/prehide';

import type { BrowserTarget, ChannelEnv } from './scripts/constants';
import type { Configuration } from '@rspack/core';

const ROOT_DIR = import.meta.dirname;

const BUILD_DIR = 'build';

/**
 * Reads the extension version from package.json — the single source of truth
 * stamped into every produced manifest.
 *
 * @returns Version string, e.g. "0.1.0".
 */
const readPackageVersion = (): string => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
    return packageJson.version;
};

/**
 * Creates the Rspack configuration for one browser target and build channel.
 *
 * @param browser Browser to build for.
 * @param buildEnv Build channel.
 *
 * @returns Rspack configuration emitting to `build/<channel>/<browser>/`
 * and archiving it to `build/<channel>/<browser>.zip`.
 */
export const createRspackConfig = (browser: BrowserTarget, buildEnv: ChannelEnv): Configuration => {
    const isDev = buildEnv === CHANNEL_ENVS.DEV;
    const outputPath = path.join(ROOT_DIR, BUILD_DIR, buildEnv, browser);
    const version = readPackageVersion();

    return {
        name: browser,
        mode: isDev ? 'development' : 'production',
        // Inline source map in dev; no separate .map files ever — loose map
        // files complicate store review.
        devtool: isDev ? 'inline-source-map' : false,
        target: 'web',
        entry: {
            background: './src/background/index.ts',
            'content-script': './src/content-script/index.ts',
            popup: './src/popup/index.ts',
            onboarding: './src/onboarding/index.ts',
        },
        output: {
            path: outputPath,
            filename: '[name].js',
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                            },
                            target: 'es2022',
                        },
                    },
                },
            ],
        },
        optimization: {
            // Unminified output keeps store review simple and avoids
            // submitting a separate source archive to AMO.
            minimize: false,
        },
        plugins: [
            new rspack.CopyRspackPlugin({
                patterns: [
                    {
                        from: 'src/manifest.json',
                        to: 'manifest.json',
                        transform: (content) => updateManifest(content, { browser, version }),
                    },
                    {
                        from: 'src/_locales',
                        to: '_locales',
                        transform: (content) => updateLocalesName(content, buildEnv),
                    },
                    {
                        from: 'src/assets',
                        to: 'assets',
                    },
                ],
            }),
            new GeneratedFilePlugin('prehide.css', buildPrehideCss()),
            new rspack.HtmlRspackPlugin({
                template: 'src/popup/index.html',
                filename: 'popup.html',
                chunks: ['popup'],
                // Blocking script at the end of body: the popup applies its
                // state synchronously before the first paint (no visible
                // state flip on open).
                inject: 'body',
                scriptLoading: 'blocking',
            }),
            new rspack.HtmlRspackPlugin({
                template: 'src/onboarding/index.html',
                filename: ONBOARDING_PAGE_FILE,
                chunks: ['onboarding'],
                // Same as the popup: localized copy is applied before the
                // first paint, so the page never shows empty headings.
                inject: 'body',
                scriptLoading: 'blocking',
                templateParameters: {
                    storeListingUrl: STORE_LISTING_URLS[browser],
                },
            }),
            new ArchivePlugin(outputPath, `${outputPath}.zip`),
        ],
    };
};
