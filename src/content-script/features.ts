/**
 * @file Registry of hideable header features: one entry per button the
 * extension can hide, wiring a settings key to its detector.
 */

import type { Settings } from '../common/settings';
import { findGeminiButton, findUpgradeButton } from './detector';

/**
 * A hideable header feature.
 */
export interface HideFeature {
    /**
     * Stable feature id, stored in the hidden-marker attribute.
     */
    id: string;

    /**
     * Settings field controlling the feature.
     */
    settingKey: keyof Settings;

    /**
     * Detector returning the single unambiguous button, or null.
     */
    findButton: (root: Document | HTMLElement) => HTMLElement | null;

    /**
     * CSS selector for the pre-hide stylesheet applied at document_start,
     * so the button never paints before the detector runs. Deliberately a
     * close CSS approximation of the detector's signals; the JS detector
     * stays the source of truth for the actual layout-collapsing hide.
     */
    prehideSelector: string;
}

export const HIDE_FEATURES: readonly HideFeature[] = [
    {
        id: 'upgrade',
        settingKey: 'hideUpgrade',
        findButton: findUpgradeButton,
        prehideSelector: ':is(header, [role="banner"]) button[role="link"]',
    },
    {
        id: 'gemini',
        settingKey: 'hideGemini',
        findButton: findGeminiButton,
        prehideSelector: ':is(header, [role="banner"]) '
            + ':is(a, button, [role="button"], [role="link"])[aria-label*="gemini" i]',
    },
];
