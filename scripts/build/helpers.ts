/**
 * @file Build-time transforms applied to static extension resources while
 * they are copied into the per-browser output directory.
 */

import {
    BROWSER_TARGETS,
    CHANNEL_ENVS,
    DEV_NAME_SUFFIX,
    FIREFOX_STRICT_MIN_VERSION,
    GECKO_ID,
} from '../constants';
import type { BrowserTarget, ChannelEnv } from '../constants';

const JSON_INDENT = 4;

/**
 * Options for {@link updateManifest}.
 */
interface UpdateManifestOptions {
    /**
     * Browser the manifest is produced for.
     */
    browser: BrowserTarget;

    /**
     * Extension version taken from package.json.
     */
    version: string;
}

/**
 * Finalizes the static manifest for a concrete browser: stamps the version,
 * declares the background entry in the browser-specific shape and adds the
 * Firefox `browser_specific_settings` block when needed.
 *
 * @param content Raw contents of src/manifest.json.
 * @param options Browser target and extension version.
 *
 * @returns Serialized manifest JSON.
 */
export const updateManifest = (content: Buffer | string, options: UpdateManifestOptions): string => {
    const manifest = JSON.parse(content.toString());

    manifest.version = options.version;

    if (options.browser === BROWSER_TARGETS.FIREFOX) {
        // Firefox MV3 runs background as an event page, not a service worker.
        manifest.background = {
            scripts: ['background.js'],
        };
        manifest.browser_specific_settings = {
            gecko: {
                id: GECKO_ID,
                strict_min_version: FIREFOX_STRICT_MIN_VERSION,
                data_collection_permissions: {
                    required: ['none'],
                },
            },
        };
    } else {
        manifest.background = {
            service_worker: 'background.js',
        };
        delete manifest.browser_specific_settings;
    }

    return JSON.stringify(manifest, null, JSON_INDENT);
};

/**
 * Appends the dev channel suffix to the localized extension name so that a
 * dev build installed next to a store build is distinguishable.
 *
 * @param content Raw contents of a `_locales/<lang>/messages.json` file.
 * @param buildEnv Current build channel.
 *
 * @returns Serialized messages JSON.
 */
export const updateLocalesName = (content: Buffer | string, buildEnv: ChannelEnv): string => {
    const messages = JSON.parse(content.toString());

    if (buildEnv === CHANNEL_ENVS.DEV && messages.name?.message) {
        messages.name.message += DEV_NAME_SUFFIX;
    }

    return JSON.stringify(messages, null, JSON_INDENT);
};
