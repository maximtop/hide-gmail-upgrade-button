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
}

export const HIDE_FEATURES: readonly HideFeature[] = [
    {
        id: 'upgrade',
        settingKey: 'hideUpgrade',
        findButton: findUpgradeButton,
    },
    {
        id: 'gemini',
        settingKey: 'hideGemini',
        findButton: findGeminiButton,
    },
];
