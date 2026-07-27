/**
 * @file Runtime counterpart of the pre-hide stylesheet.
 *
 * The static `prehide.css` (generated at build time from the feature
 * registry) is injected at document_start and keeps candidate buttons
 * `visibility: hidden` from the very first paint — this is what prevents
 * any flash before the detector runs. For features the user switched OFF,
 * this module appends per-feature override styles that win over the
 * injected stylesheet, so disabled buttons stay visible.
 */

import type { Settings } from '../common/settings';
import { HIDE_FEATURES } from './features';
import type { HideFeature } from './features';

const OVERRIDE_ATTRIBUTE = 'data-hgub-prehide-override';

/**
 * Builds the content of the generated `prehide.css` stylesheet: one
 * visibility rule per feature. Used by the build; kept next to the override
 * builder so both sides always share the same selectors.
 *
 * @returns CSS text of the pre-hide stylesheet.
 */
export const buildPrehideCss = (): string => {
    const rules = HIDE_FEATURES.map((feature) => {
        return `${feature.prehideSelector} {\n    visibility: hidden !important;\n}`;
    });
    return `${rules.join('\n\n')}\n`;
};

/**
 * Builds the CSS text revealing a feature's pre-hidden candidates. The
 * `:root` prefix gives the rule higher specificity than the pre-hide rule,
 * so it wins regardless of stylesheet order.
 *
 * @param feature Feature to reveal.
 *
 * @returns CSS text of the override.
 */
export const buildOverrideCss = (feature: HideFeature): string => {
    return `:root ${feature.prehideSelector} { visibility: visible !important; }`;
};

/**
 * Ensures the pre-hide override styles match the settings: features that
 * are switched off get an override (their buttons stay visible), enabled
 * features get none. Idempotent.
 *
 * @param doc Document to sync overrides in.
 * @param settings Current settings.
 */
export const syncPrehideOverrides = (doc: Document, settings: Settings): void => {
    for (const feature of HIDE_FEATURES) {
        const existing = doc.querySelector(`style[${OVERRIDE_ATTRIBUTE}="${feature.id}"]`);
        const wantOverride = !settings[feature.settingKey];

        if (wantOverride && !existing) {
            const style = doc.createElement('style');
            style.setAttribute(OVERRIDE_ATTRIBUTE, feature.id);
            style.textContent = buildOverrideCss(feature);
            (doc.head ?? doc.documentElement).appendChild(style);
        }

        if (!wantOverride && existing) {
            existing.remove();
        }
    }
};
