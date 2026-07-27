/**
 * @file Build entrypoint: `CHANNEL_ENV=dev|release tsx scripts/build/bundle.ts [browser] [--watch]`.
 * Builds all browser targets when no browser argument is given.
 */

import rspack from '@rspack/core';
import type { MultiStats } from '@rspack/core';

import { createRspackConfig } from '../../rspack.config';
import {
    ALL_BROWSER_TARGETS,
    ALL_CHANNEL_ENVS,
    CHANNEL_ENVS,
} from '../constants';
import type { BrowserTarget, ChannelEnv } from '../constants';

const WATCH_FLAG = '--watch';

/**
 * Validates the CHANNEL_ENV environment variable.
 *
 * @returns The build channel.
 *
 * @throws Error when CHANNEL_ENV is missing or not a known channel.
 */
const readChannelEnv = (): ChannelEnv => {
    const channelEnv = process.env.CHANNEL_ENV;
    if (!channelEnv || !(ALL_CHANNEL_ENVS as string[]).includes(channelEnv)) {
        throw new Error(`CHANNEL_ENV must be one of: ${ALL_CHANNEL_ENVS.join(', ')}; got "${channelEnv}"`);
    }
    return channelEnv as ChannelEnv;
};

/**
 * Parses CLI arguments into browser targets and the watch flag.
 *
 * @returns Requested targets (all browsers when none given) and watch mode.
 *
 * @throws Error when an argument is not a known browser target.
 */
const parseArgs = (): { targets: BrowserTarget[]; watch: boolean } => {
    const args = process.argv.slice(2);
    const watch = args.includes(WATCH_FLAG);
    const browsers = args.filter((arg) => !arg.startsWith('--'));

    const unknown = browsers.filter((browser) => !(ALL_BROWSER_TARGETS as string[]).includes(browser));
    if (unknown.length > 0) {
        throw new Error(`Unknown browser target(s): ${unknown.join(', ')}. Known: ${ALL_BROWSER_TARGETS.join(', ')}`);
    }

    const targets = browsers.length > 0 ? (browsers as BrowserTarget[]) : ALL_BROWSER_TARGETS;
    return { targets, watch };
};

/**
 * Prints compilation stats and marks the process as failed on errors.
 *
 * @param stats Rspack multi-compiler stats.
 */
const reportStats = (stats: MultiStats): void => {
    console.log(stats.toString({ colors: true, preset: 'errors-warnings' }));
    if (stats.hasErrors()) {
        process.exitCode = 1;
    }
};

/**
 * Builds the requested targets once, or watches a single dev target.
 *
 * @throws Error when watch mode is requested for a release build or for
 * more than one browser target at a time.
 */
const main = async (): Promise<void> => {
    const buildEnv = readChannelEnv();
    const { targets, watch } = parseArgs();

    if (watch && (buildEnv !== CHANNEL_ENVS.DEV || targets.length !== 1)) {
        throw new Error(
            'Watch mode requires the dev channel and exactly one browser target, e.g. "pnpm dev chrome --watch"',
        );
    }

    const configs = targets.map((browser) => createRspackConfig(browser, buildEnv));
    const compiler = rspack(configs);

    if (watch) {
        compiler.watch({}, (error, stats) => {
            if (error) {
                console.error(error);
                process.exitCode = 1;
                return;
            }
            if (stats) {
                reportStats(stats);
            }
        });
        return;
    }

    await new Promise<void>((resolve, reject) => {
        compiler.run((error, stats) => {
            if (error) {
                reject(error);
                return;
            }
            if (stats) {
                reportStats(stats);
            }
            compiler.close((closeError) => {
                if (closeError) {
                    reject(closeError);
                    return;
                }
                resolve();
            });
        });
    });
};

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
