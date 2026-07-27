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
 * Accessible labels the Ask Gemini button is known to carry, lowercase.
 * Matched against the whole normalized label first.
 */
export const GEMINI_BUTTON_LABELS: readonly string[] = [
    'ask gemini',
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
 * URL pattern of Gmail tabs — mirrors the manifest `content_scripts.matches`
 * and `host_permissions`, so programmatic injection never reaches beyond
 * what the user already granted.
 */
export const GMAIL_URL_PATTERN = 'https://mail.google.com/*';

/**
 * Bundled content script file name, as emitted by the build.
 */
export const CONTENT_SCRIPT_FILE = 'content-script.js';

/**
 * Debounce window for coalescing DOM mutations before re-running the
 * detector. Gmail mutates the page constantly; one check per window keeps
 * the observer cheap while re-hiding the button quickly after re-renders.
 */
export const MUTATION_DEBOUNCE_MS = 100;

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
