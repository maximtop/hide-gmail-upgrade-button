/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { findUpgradeButton } from '../../../src/content-script/detector';

/**
 * Minimal anonymized fixture of the Gmail chrome: a banner with regular
 * controls and page body content. Gmail markup is intentionally not copied —
 * only the semantics the detector relies on are reproduced.
 *
 * @param bannerExtraHtml Extra markup injected into the banner.
 * @param bodyExtraHtml Extra markup injected outside the banner.
 */
const renderPage = (bannerExtraHtml: string, bodyExtraHtml = ''): void => {
    document.body.innerHTML = `
        <div role="banner">
            <button aria-label="Search"></button>
            <button aria-label="Settings"></button>
            ${bannerExtraHtml}
        </div>
        <main>
            <span>Upgrade your plan today — read more</span>
            <a href="#">Upgrade</a>
            ${bodyExtraHtml}
        </main>
    `;
};

describe('findUpgradeButton', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('finds a single link labeled Upgrade inside the banner', () => {
        renderPage('<a id="target" href="https://example.test/upgrade"><span>Upgrade</span></a>');

        expect(findUpgradeButton(document)?.id).toBe('target');
    });

    it('finds a button via aria-label regardless of case and extra whitespace', () => {
        renderPage('<button id="target" aria-label="  UPGRADE "></button>');

        expect(findUpgradeButton(document)?.id).toBe('target');
    });

    it('treats a link wrapping an inner role=button as one candidate and returns the outermost', () => {
        renderPage('<a id="outer" href="#"><span role="button">Upgrade</span></a>');

        expect(findUpgradeButton(document)?.id).toBe('outer');
    });

    it('returns null when the button is absent', () => {
        renderPage('');

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('returns null when several unrelated candidates match (ambiguity is a safe no-op)', () => {
        renderPage('<a href="#">Upgrade</a><button>Upgrade</button>');

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('ignores matches outside the banner, e.g. email content mentioning Upgrade', () => {
        renderPage('', '<button id="in-body">Upgrade</button>');

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('ignores banner elements that only mention upgrade within longer text', () => {
        renderPage('<a href="#">Upgrade your storage now</a>');

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('ignores non-clickable banner elements labeled Upgrade', () => {
        renderPage('<span>Upgrade</span>');

        expect(findUpgradeButton(document)).toBeNull();
    });
});
