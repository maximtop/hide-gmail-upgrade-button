/**
 * @file Idempotent hide/restore operations for hidden header elements.
 *
 * Only the minimal original state — the inline `display` value — is saved,
 * in a data attribute on the element itself, so restoring returns the exact
 * pre-hide state and repeated calls never lose it or duplicate DOM changes.
 * The marker attribute stores the owning feature id, letting each feature
 * find and restore its own elements independently.
 */

import { HIDDEN_MARKER_ATTRIBUTE, ORIGINAL_DISPLAY_ATTRIBUTE } from '../common/constants';

/**
 * Checks whether the element is currently hidden by this extension.
 *
 * @param element Element to check.
 *
 * @returns Whether the element carries the hidden marker.
 */
export const isHiddenByExtension = (element: HTMLElement): boolean => {
    return element.hasAttribute(HIDDEN_MARKER_ATTRIBUTE);
};

/**
 * Hides the element via inline `display: none`, remembering its original
 * inline display value and the owning feature. Idempotent: hiding an
 * already hidden element does nothing and never overwrites the saved
 * original state.
 *
 * @param element Element to hide.
 * @param featureId Feature that owns the hidden element.
 */
export const hideElement = (element: HTMLElement, featureId: string): void => {
    if (isHiddenByExtension(element)) {
        return;
    }

    element.setAttribute(ORIGINAL_DISPLAY_ATTRIBUTE, element.style.display);
    element.setAttribute(HIDDEN_MARKER_ATTRIBUTE, featureId);
    element.style.display = 'none';
};

/**
 * Re-applies `display: none` to an element the extension already hid, in
 * case the page rewrote the inline style during a re-render. Does not touch
 * the saved original state; no-op for elements not hidden by the extension.
 *
 * @param element Element to check and repair.
 */
export const ensureHidden = (element: HTMLElement): void => {
    if (isHiddenByExtension(element) && element.style.display !== 'none') {
        element.style.display = 'none';
    }
};

/**
 * Restores an element previously hidden by {@link hideElement} to its exact
 * original inline display. Idempotent: restoring an element that is not
 * hidden by the extension does nothing.
 *
 * @param element Element to restore.
 */
export const restoreElement = (element: HTMLElement): void => {
    if (!isHiddenByExtension(element)) {
        return;
    }

    const originalDisplay = element.getAttribute(ORIGINAL_DISPLAY_ATTRIBUTE) ?? '';
    if (originalDisplay === '') {
        element.style.removeProperty('display');
    } else {
        element.style.display = originalDisplay;
    }

    element.removeAttribute(ORIGINAL_DISPLAY_ATTRIBUTE);
    element.removeAttribute(HIDDEN_MARKER_ATTRIBUTE);
};

/**
 * Restores every element the given feature has hidden within the root.
 *
 * @param root Document or element to search in.
 * @param featureId Feature whose elements are restored.
 */
export const restoreAllHidden = (root: Document | HTMLElement, featureId: string): void => {
    const hidden = root.querySelectorAll<HTMLElement>(`[${HIDDEN_MARKER_ATTRIBUTE}="${featureId}"]`);
    hidden.forEach(restoreElement);
};
