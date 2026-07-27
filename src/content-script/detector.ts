/**
 * @file Detector of the Gmail Upgrade button.
 *
 * Gmail's CSS classes are obfuscated and unstable, and (verified on live
 * Gmail, July 2026) the Upgrade control is a `<button role="link">` with no
 * href and no semantic data attributes, rendered into the header (banner)
 * asynchronously after page load. The detector therefore combines two
 * signals, most reliable first:
 *
 * 1. Label: a clickable element in the banner whose whole accessible label
 *    matches a known Upgrade label — precise but locale-dependent.
 * 2. Structure: a `<button role="link">` in the banner — a button that acts
 *    as a link is the upsell pattern (regular header controls are
 *    `role="button"` or real links), and it is locale-independent.
 *
 * When either signal is ambiguous — no candidate or several unrelated
 * candidates — the detector returns null and the extension safely does
 * nothing.
 */

import { UPGRADE_BUTTON_LABELS } from '../common/constants';

const CLICKABLE_SELECTOR = 'a, button, [role="button"], [role="link"]';

const HEADER_SELECTOR = 'header, [role="banner"]';

/**
 * Normalizes a label for comparison: trims and collapses whitespace,
 * lowercases.
 *
 * @param value Raw label text.
 *
 * @returns Normalized label.
 */
const normalizeLabel = (value: string): string => {
    return value.replace(/\s+/g, ' ').trim().toLowerCase();
};

/**
 * Reads the accessible label of an element: `aria-label` when present,
 * otherwise its visible text content.
 *
 * @param element Element to read the label from.
 *
 * @returns Normalized label, possibly empty.
 */
const getAccessibleLabel = (element: HTMLElement): string => {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
        return normalizeLabel(ariaLabel);
    }
    return normalizeLabel(element.textContent ?? '');
};

/**
 * Checks whether an element's whole label matches a known Upgrade label.
 *
 * @param element Candidate element.
 *
 * @returns Whether the label matches exactly.
 */
const hasUpgradeLabel = (element: HTMLElement): boolean => {
    return UPGRADE_BUTTON_LABELS.includes(getAccessibleLabel(element));
};

/**
 * Checks whether an element matches the structural upsell pattern: a real
 * `<button>` declaring itself a link.
 *
 * @param element Candidate element.
 *
 * @returns Whether the element is a button with `role="link"`.
 */
const isLinkRoleButton = (element: HTMLElement): boolean => {
    return element.tagName === 'BUTTON' && element.getAttribute('role') === 'link';
};

/**
 * Drops candidates nested inside another candidate, keeping only the
 * outermost element of each cluster. A link wrapping an inner
 * `role="button"` span is one button, not two.
 *
 * @param candidates Matched clickable elements.
 *
 * @returns Outermost candidates only.
 */
const keepOutermost = (candidates: HTMLElement[]): HTMLElement[] => {
    return candidates.filter((candidate) => {
        return !candidates.some((other) => other !== candidate && other.contains(candidate));
    });
};

/**
 * Returns the only element of the list, or null when the list is empty or
 * ambiguous.
 *
 * @param candidates Filtered candidate list.
 *
 * @returns The single candidate or null.
 */
const singleOrNull = (candidates: HTMLElement[]): HTMLElement | null => {
    return candidates.length === 1 ? (candidates[0] ?? null) : null;
};

/**
 * Finds the Gmail Upgrade button within the given root.
 *
 * @param root Document or element to search in.
 *
 * @returns The single unambiguous match, or null when the button is absent
 * or the match is ambiguous (several unrelated candidates).
 */
export const findUpgradeButton = (root: Document | HTMLElement): HTMLElement | null => {
    const headers = Array.from(root.querySelectorAll<HTMLElement>(HEADER_SELECTOR));

    const clickables = headers.flatMap((header) => {
        return Array.from(header.querySelectorAll<HTMLElement>(CLICKABLE_SELECTOR));
    });

    const byLabel = keepOutermost(clickables.filter(hasUpgradeLabel));
    const labelMatch = singleOrNull(byLabel);
    if (labelMatch) {
        return labelMatch;
    }

    // Locale-independent fallback: only when no label matched at all, so an
    // unknown locale still works while a labeled match is never overridden.
    if (byLabel.length === 0) {
        return singleOrNull(keepOutermost(clickables.filter(isLinkRoleButton)));
    }

    return null;
};
