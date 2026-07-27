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

export const GECKO_ID = 'hide-gmail-upgrade-button@maximtop.dev';

export const FIREFOX_STRICT_MIN_VERSION = '128.0';

export const DEV_NAME_SUFFIX = ' (Dev)';
