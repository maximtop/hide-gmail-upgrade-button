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
 * Marker attribute set on an element hidden by this extension.
 * Also serves as the idempotency guard for repeated hide calls.
 */
export const HIDDEN_MARKER_ATTRIBUTE = 'data-hgub-hidden';

/**
 * Attribute preserving the element's original inline `display` value so that
 * restoring returns the element to its exact pre-hide state.
 */
export const ORIGINAL_DISPLAY_ATTRIBUTE = 'data-hgub-original-display';
