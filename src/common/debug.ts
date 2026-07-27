/**
 * @file Timestamped diagnostic logging. Uses console.debug (hidden unless
 * the Verbose level is enabled in DevTools), prefixed and with elapsed
 * milliseconds since script start, to correlate hiding with page rendering.
 */

const scriptStart = performance.now();

const LOG_PREFIX = '[hgub]';

/**
 * Logs a diagnostic message with elapsed time since content script start.
 *
 * @param parts Message parts, passed through to console.debug.
 */
export const debugLog = (...parts: unknown[]): void => {
    console.debug(LOG_PREFIX, `+${Math.round(performance.now() - scriptStart)}ms`, ...parts);
};
