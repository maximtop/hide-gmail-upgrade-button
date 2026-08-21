/**
 * @file Runtime constants shared across extension entrypoints.
 */

/**
 * Accessible labels the Upgrade button is known to carry, lowercase.
 * The detector matches the whole normalized label, never a substring, so
 * elements that merely mention "upgrade" in longer text are not touched.
 * Unknown locales simply produce no match — the extension safely does nothing.
 */
export const UPGRADE_BUTTON_LABELS: readonly string[] = [
    'upgrade',
];

/**
 * Accessible labels the Gemini button is known to carry, lowercase.
 * Matched against the whole normalized label first. "Ask Gemini" is the
 * Gmail wording; "Try Gemini" is what the Docs editor uses (verified live).
 */
export const GEMINI_BUTTON_LABELS: readonly string[] = [
    'ask gemini',
    'try gemini',
];

/**
 * Product-name fragment for the locale-independent Gemini fallback:
 * "Gemini" is a brand name and stays untranslated in localized Gmail UIs.
 */
export const GEMINI_NAME_FRAGMENT = 'gemini';

/**
 * How much wider than the target button an ancestor may be while still
 * counting as its layout wrapper (accounts for wrapper padding/margins).
 */
export const WRAPPER_WIDTH_TOLERANCE_PX = 16;

/**
 * URL patterns of the required Google apps — mirror the manifest
 * `content_scripts.matches` and `host_permissions`, so programmatic
 * injection never reaches beyond what the user already granted.
 * docs.google.com covers the Docs/Sheets/Slides editors and their home
 * screens.
 */
export const REQUIRED_URL_PATTERNS: readonly string[] = [
    'https://mail.google.com/*',
    'https://drive.google.com/*',
    'https://docs.google.com/*',
];

/**
 * Optional Google Calendar origin. It deliberately stays out of the static
 * content-script matches and required host permissions so adding Calendar in
 * an update never disables existing installations pending re-approval.
 */
export const CALENDAR_URL_PATTERN = 'https://calendar.google.com/*';

/**
 * Google Calendar hostname used to scope cleanup messages that may be
 * broadcast after the optional host permission has already been removed.
 */
export const CALENDAR_HOSTNAME = 'calendar.google.com';

/**
 * Stable id of the dynamically registered Google Calendar content script.
 */
export const CALENDAR_CONTENT_SCRIPT_ID = 'google-calendar';

/**
 * Runtime message sent before optional Calendar access is removed so an
 * already-running content script can restore the page immediately.
 */
export const CALENDAR_DISABLE_MESSAGE_TYPE = 'disable-google-calendar';

/**
 * Bundled content script file name, as emitted by the build.
 */
export const CONTENT_SCRIPT_FILE = 'content-script.js';

/**
 * Pre-paint stylesheet emitted by the build and paired with the content
 * script for both required and optional hosts.
 */
export const PREHIDE_STYLESHEET_FILE = 'prehide.css';

/**
 * Marker attribute set on an element hidden by this extension.
 * Also serves as the idempotency guard for repeated hide calls.
 */
export const HIDDEN_MARKER_ATTRIBUTE = 'data-hgub-hidden';

/**
 * Attribute preserving the element's original inline `display` value so that
 * restoring returns the element to its exact pre-hide state.
 */
export const ORIGINAL_DISPLAY_ATTRIBUTE = 'data-hgub-original-display';
