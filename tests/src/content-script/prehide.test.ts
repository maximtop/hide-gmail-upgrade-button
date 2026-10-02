/**
 * @file Tests for the build-time pre-hide stylesheet text and its per-feature
 * override rule, kept next to each other so both sides never drift.
 *
 * @vitest-environment happy-dom
 */

import { describe, expect, it } from 'vitest';

import { HIDE_FEATURES } from '../../../src/content-script/features';
import { buildOverrideCss, buildPrehideCss } from '../../../src/content-script/prehide';

describe('buildPrehideCss', () => {
    it('emits one visibility:hidden rule per registered feature, in registry order', () => {
        const css = buildPrehideCss();
        const selectors = css.trim().split('\n\n').map((rule) => rule.split(' {')[0]);

        expect(selectors).toEqual(HIDE_FEATURES.flatMap((feature) => feature.prehideSelector ?? []));
    });

    it('hides exactly what each feature selector matches, nothing else', () => {
        document.body.innerHTML = `
            <div role="banner">
                <button aria-label="Settings"></button>
                <button id="upgrade" role="link">Upgrade</button>
                <button id="gemini" aria-label="Ask Gemini"></button>
            </div>
        `;
        const style = document.createElement('style');
        style.textContent = buildPrehideCss();
        document.head.appendChild(style);

        expect(getComputedStyle(document.getElementById('upgrade') as HTMLElement).visibility).toBe('hidden');
        expect(getComputedStyle(document.getElementById('gemini') as HTMLElement).visibility).toBe('hidden');
        expect(getComputedStyle(document.querySelector('[aria-label="Settings"]') as HTMLElement).visibility)
            .not.toBe('hidden');
    });
});

describe('buildOverrideCss', () => {
    it('builds a :root-scoped rule that reveals exactly the feature selector', () => {
        for (const feature of HIDE_FEATURES.filter((candidate) => candidate.prehideSelector)) {
            expect(buildOverrideCss(feature)).toBe(
                `:root ${feature.prehideSelector} { visibility: visible !important; }`,
            );
        }
    });

    it('wins over the pre-hide rule for the same element', () => {
        document.body.innerHTML = '<div role="banner"><button id="upgrade" role="link">Upgrade</button></div>';
        const prehide = document.createElement('style');
        prehide.textContent = buildPrehideCss();
        const upgradeFeature = HIDE_FEATURES.find((feature) => feature.id === 'upgrade');
        if (!upgradeFeature) {
            throw new Error('upgrade feature must be registered');
        }
        const override = document.createElement('style');
        override.textContent = buildOverrideCss(upgradeFeature);
        document.head.append(prehide, override);

        expect(getComputedStyle(document.getElementById('upgrade') as HTMLElement).visibility).toBe('visible');
    });
});
