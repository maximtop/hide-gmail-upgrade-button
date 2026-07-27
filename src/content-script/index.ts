/**
 * @file Gmail content script: finds the Upgrade button and hides it once the
 * document is ready.
 *
 * Scope notes for follow-up tasks: re-applying after Gmail SPA re-renders
 * (MutationObserver) and the user-facing toggle with a stored setting arrive
 * separately; until the toggle exists, hiding is unconditionally on.
 */

import { findUpgradeButton } from './detector';
import { hideElement } from './visibility';

/**
 * Runs the detector and hides the button when a single unambiguous match is
 * found. Safe to call repeatedly.
 */
export const applyHiding = (): void => {
    const button = findUpgradeButton(document);
    if (button) {
        hideElement(button);
    }
};

/**
 * Applies hiding once the document is ready enough to contain the header.
 */
const init = (): void => {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        applyHiding();
        return;
    }

    document.addEventListener(
        'readystatechange',
        () => {
            applyHiding();
        },
        { once: true },
    );
};

init();
