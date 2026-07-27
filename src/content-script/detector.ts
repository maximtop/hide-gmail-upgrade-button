/**
 * @file Detector of the Gmail Upgrade button.
 *
 * Gmail's CSS classes are obfuscated and unstable, so the detector relies on
 * several semantic signals instead: the element must be clickable, live in
 * the page header (banner) area and carry a known accessible label. When the
 * signals are ambiguous — no candidate or several unrelated candidates — the
 * detector returns null and the extension safely does nothing.
 */

import { UPGRADE_BUTTON_LABELS } from '../common/constants';

const CLICKABLE_SELECTOR = 'a, button, [role="button"]';

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
 * Finds the Gmail Upgrade button within the given root.
 *
 * @param root Document or element to search in.
 *
 * @returns The single unambiguous match, or null when the button is absent
 * or the match is ambiguous (several unrelated candidates).
 */
export const findUpgradeButton = (root: Document | HTMLElement): HTMLElement | null => {
    const headers = Array.from(root.querySelectorAll<HTMLElement>(HEADER_SELECTOR));

    const candidates = headers.flatMap((header) => {
        const clickables = Array.from(header.querySelectorAll<HTMLElement>(CLICKABLE_SELECTOR));
        return clickables.filter(hasUpgradeLabel);
    });

    const outermost = keepOutermost(candidates);

    if (outermost.length !== 1) {
        return null;
    }

    return outermost[0] ?? null;
};
