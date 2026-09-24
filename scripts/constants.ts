/**
 * @file Shared build constants: browser targets, build channels and extension identifiers.
 */

export const BROWSER_TARGETS = {
    CHROME: 'chrome',
    EDGE: 'edge',
    FIREFOX: 'firefox',
} as const;

/**
 * Browser a bundle is produced for.
 */
export type BrowserTarget = typeof BROWSER_TARGETS[keyof typeof BROWSER_TARGETS];

export const ALL_BROWSER_TARGETS: BrowserTarget[] = Object.values(BROWSER_TARGETS);

export const CHANNEL_ENVS = {
    DEV: 'dev',
    RELEASE: 'release',
} as const;

/**
 * Build channel: `dev` produces unminified builds with a "(Dev)" name suffix,
 * `release` produces store-ready builds.
 */
export type ChannelEnv = typeof CHANNEL_ENVS[keyof typeof CHANNEL_ENVS];

export const ALL_CHANNEL_ENVS: ChannelEnv[] = Object.values(CHANNEL_ENVS);

export const FIREFOX_STRICT_MIN_VERSION = '128.0';

export const CHROMIUM_STRICT_MIN_VERSION = '102';

export const DEV_NAME_SUFFIX = ' (Dev)';

/**
 * Public store listing each browser package is published to. The onboarding
 * page links to the listing of the package it ships in, since that is where
 * the user installed it from (Chrome Web Store packages installed in Edge
 * still come from the Chrome build).
 */
export const STORE_LISTING_URLS: Record<BrowserTarget, string> = {
    [BROWSER_TARGETS.CHROME]: 'https://chromewebstore.google.com/detail/flakajdfnklpgiefoffmecgbfbckmpcb',
    [BROWSER_TARGETS.EDGE]: 'https://microsoftedge.microsoft.com/addons/detail/oifpjlhikjiifjlcihandpghdiechhik',
    [BROWSER_TARGETS.FIREFOX]: 'https://addons.mozilla.org/firefox/addon/hide-upgrade-gmail-drive-docs/',
};

// The store deployment code (scripts/deploy) is shared with the other extension repositories
// and owns the release constants; the build keeps importing them from here.
export {
    GECKO_ID,
    RELEASE_ASSET_PREFIX,
    RELEASE_TAG_PATTERN,
    STORE_UPLOAD_DIRECTORY,
} from './deploy/constants';
