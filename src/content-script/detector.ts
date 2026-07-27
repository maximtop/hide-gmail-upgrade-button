/**
 * @file Detectors of the Gmail header buttons this extension can hide.
 *
 * Gmail's CSS classes are obfuscated and unstable, and (verified on live
 * Gmail, July 2026) the header buttons carry no href and no semantic data
 * attributes, so the detectors rely on semantic signals only and never on
 * class names:
 *
 * - Upgrade: exact accessible label, with a locale-independent structural
 *   fallback — the only `<button role="link">` in the banner (a button that
 *   acts as a link is the upsell pattern; regular header controls are
 *   `role="button"` or real links).
 * - Ask Gemini: exact accessible label, with a fallback on the "gemini"
 *   product-name fragment, which stays untranslated in localized UIs.
 *
 * When a signal is ambiguous — no candidate or several unrelated candidates
 * — a detector returns null and the extension safely does nothing.
 *
 * Hiding the button element alone leaves a gap in the header layout, so
 * {@link findHideTarget} resolves the button's single-purpose layout wrapper
 * to hide instead: it climbs ancestors that are no wider than the button and
 * contain no other clickable controls.
 */

import {
    GEMINI_BUTTON_LABELS,
    GEMINI_NAME_FRAGMENT,
    HIDDEN_MARKER_ATTRIBUTE,
    UPGRADE_BUTTON_LABELS,
    WRAPPER_WIDTH_TOLERANCE_PX,
} from '../common/constants';

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
 * Checks whether an element takes part in layout: neither it nor any
 * ancestor is `display: none`. Google apps keep hidden responsive
 * duplicates of the Upgrade button in the DOM (verified on Drive and Docs)
 * — those must not count as detector candidates.
 *
 * @param element Element to check.
 *
 * @returns Whether the element is displayed.
 */
const isDisplayed = (element: HTMLElement): boolean => {
    for (let node: HTMLElement | null = element; node; node = node.parentElement) {
        if (getComputedStyle(node).display === 'none') {
            return false;
        }
    }
    return true;
};

/**
 * Collects clickable elements living in the page header (banner) areas.
 *
 * @param root Document or element to search in.
 *
 * @returns Clickable header elements, displayed or not, excluding anything
 * inside an element this extension already hid.
 */
const getHeaderClickables = (root: Document | HTMLElement): HTMLElement[] => {
    const headers = Array.from(root.querySelectorAll<HTMLElement>(HEADER_SELECTOR));
    return headers
        .flatMap((header) => {
            return Array.from(header.querySelectorAll<HTMLElement>(CLICKABLE_SELECTOR));
        })
        .filter((el) => el.closest(`[${HIDDEN_MARKER_ATTRIBUTE}]`) === null);
};

/**
 * Picks the single unambiguous candidate from a clickable pool: by exact
 * label first, by the locale-independent fallback when no label matched.
 *
 * @param clickables Candidate pool.
 * @param labels Known exact labels, lowercase.
 * @param fallback Locale-independent predicate used when no label matched.
 *
 * @returns The single unambiguous match, or null.
 */
const pickCandidate = (
    clickables: HTMLElement[],
    labels: readonly string[],
    fallback: (element: HTMLElement) => boolean,
): HTMLElement | null => {
    const byLabel = keepOutermost(clickables.filter((el) => labels.includes(getAccessibleLabel(el))));
    const labelMatch = singleOrNull(byLabel);
    if (labelMatch) {
        return labelMatch;
    }

    // The fallback applies only when no label matched at all, so an unknown
    // locale still works while a labeled match is never overridden.
    if (byLabel.length === 0) {
        return singleOrNull(keepOutermost(clickables.filter(fallback)));
    }

    return null;
};

/**
 * Finds a single button by label or fallback, in two phases.
 *
 * Phase one considers only displayed elements — hidden responsive
 * duplicates never create false ambiguity. When nothing displayed matches,
 * phase two considers the hidden elements too: Google apps mount the header
 * cell with a hidden duplicate before the visible button (observed on
 * Drive), and matching the duplicate lets the cell collapse before the
 * visible button ever mounts.
 *
 * @param root Document or element to search in.
 * @param labels Known exact labels, lowercase.
 * @param fallback Locale-independent predicate used when no label matched.
 *
 * @returns The single unambiguous match, or null.
 */
const findByLabelWithFallback = (
    root: Document | HTMLElement,
    labels: readonly string[],
    fallback: (element: HTMLElement) => boolean,
): HTMLElement | null => {
    const clickables = getHeaderClickables(root);
    const matchesFeature = (el: HTMLElement): boolean => {
        return labels.includes(getAccessibleLabel(el)) || fallback(el);
    };

    const displayed = clickables.filter(isDisplayed);
    const displayedMatch = pickCandidate(displayed, labels, fallback);
    if (displayedMatch) {
        return displayedMatch;
    }

    // Ambiguity among displayed candidates stays a safe no-op; the hidden
    // phase runs only when nothing displayed matches at all.
    if (displayed.some(matchesFeature)) {
        return null;
    }

    const hidden = clickables.filter((el) => !isDisplayed(el));
    return pickCandidate(hidden, labels, fallback);
};

/**
 * Finds the Gmail Upgrade button within the given root.
 *
 * @param root Document or element to search in.
 *
 * @returns The single unambiguous match, or null when the button is absent
 * or the match is ambiguous.
 */
export const findUpgradeButton = (root: Document | HTMLElement): HTMLElement | null => {
    return findByLabelWithFallback(root, UPGRADE_BUTTON_LABELS, (element) => {
        return element.tagName === 'BUTTON' && element.getAttribute('role') === 'link';
    });
};

/**
 * Finds the Gmail Ask Gemini button within the given root.
 *
 * @param root Document or element to search in.
 *
 * @returns The single unambiguous match, or null when the button is absent
 * or the match is ambiguous.
 */
export const findGeminiButton = (root: Document | HTMLElement): HTMLElement | null => {
    return findByLabelWithFallback(root, GEMINI_BUTTON_LABELS, (element) => {
        return getAccessibleLabel(element).includes(GEMINI_NAME_FRAGMENT);
    });
};

/**
 * Checks whether a node contains a displayed clickable element unrelated to
 * the given button — hiding such a node would take out neighboring
 * controls. Non-displayed clickables (hidden responsive duplicates, or
 * elements this extension already hid) do not count: on Drive the Upgrade
 * cell keeps a `display: none` duplicate, and stopping at it would leave
 * an empty cell taking up header space.
 *
 * @param node Candidate wrapper.
 * @param button The button being hidden.
 *
 * @returns Whether an unrelated displayed clickable exists inside the node.
 */
const containsForeignClickable = (node: HTMLElement, button: HTMLElement): boolean => {
    return Array.from(node.querySelectorAll<HTMLElement>(CLICKABLE_SELECTOR)).some((clickable) => {
        return clickable !== button
            && !clickable.contains(button)
            && !button.contains(clickable)
            && isDisplayed(clickable);
    });
};

/**
 * Resolves the element to actually hide for a detected button: the highest
 * single-purpose layout wrapper of the button, so the header row collapses
 * and neighboring controls shift instead of leaving a gap.
 *
 * A wrapper qualifies while it is no wider than the button itself (within a
 * small tolerance; zero-width inline wrappers qualify too) and contains no
 * clickable elements other than the button. The climb never crosses the
 * header (banner) element.
 *
 * @param button Detected button.
 *
 * @returns The wrapper to hide; the button itself when it has no wrapper.
 */
export const findHideTarget = (button: HTMLElement): HTMLElement => {
    const boundary = button.closest(HEADER_SELECTOR);
    // A hidden pre-mount duplicate reports zero width; the foreign-clickable
    // guard alone bounds the climb then.
    const buttonWidth = button.getBoundingClientRect().width;
    const widthLimit = buttonWidth > 0
        ? buttonWidth + WRAPPER_WIDTH_TOLERANCE_PX
        : Number.POSITIVE_INFINITY;

    let target = button;
    let ancestor = button.parentElement;

    while (ancestor && ancestor !== boundary) {
        if (ancestor.getBoundingClientRect().width > widthLimit) {
            break;
        }
        if (containsForeignClickable(ancestor, button)) {
            break;
        }
        target = ancestor;
        ancestor = ancestor.parentElement;
    }

    return target;
};
