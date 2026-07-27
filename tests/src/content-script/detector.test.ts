/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { findGeminiButton, findHideTarget, findUpgradeButton } from '../../../src/content-script/detector';

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

    it('ignores hidden responsive duplicates, like the real Drive/Docs markup', () => {
        renderPage(`
            <button id="visible" role="link">Upgrade</button>
            <button role="link" aria-label="Upgrade" style="display: none;"></button>
        `);

        expect(findUpgradeButton(document)?.id).toBe('visible');
    });

    it('ignores candidates inside a display-none wrapper', () => {
        renderPage(`
            <button id="visible" role="link">Upgrade</button>
            <div style="display: none;"><button role="link">Upgrade</button></div>
        `);

        expect(findUpgradeButton(document)?.id).toBe('visible');
    });

    it('matches a hidden duplicate when no visible button mounted yet (pre-mount phase)', () => {
        renderPage(
            '<div id="cell"><button id="dup" role="link" aria-label="Upgrade" style="display: none;"></button></div>',
        );

        expect(findUpgradeButton(document)?.id).toBe('dup');
    });

    it('does not re-detect elements inside a wrapper the extension already hid', () => {
        renderPage(`
            <div data-hgub-hidden="upgrade" style="display: none;">
                <button role="link" aria-label="Upgrade"></button>
            </div>
        `);

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('finds a button[role=link] with an unknown localized label (structural fallback)', () => {
        renderPage('<button id="target" role="link"><span>Улучшить</span></button>');

        expect(findUpgradeButton(document)?.id).toBe('target');
    });

    it('prefers the labeled match when both a labeled element and a button[role=link] exist', () => {
        renderPage('<button id="labeled">Upgrade</button><button id="structural" role="link">Премиум</button>');

        expect(findUpgradeButton(document)?.id).toBe('labeled');
    });

    it('returns null when several button[role=link] candidates exist without a label match', () => {
        renderPage('<button role="link">Улучшить</button><button role="link">Премиум</button>');

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('ignores button[role=link] outside the banner', () => {
        renderPage('', '<button id="in-body" role="link">Читать далее</button>');

        expect(findUpgradeButton(document)).toBeNull();
    });

    it('matches the real Gmail markup shape: nested spans inside button[role=link]', () => {
        renderPage(`
            <button id="target" role="link" data-tooltip-enabled="true" aria-describedby="tt">
                <span><span>Upgrade</span></span>
            </button>
        `);

        expect(findUpgradeButton(document)?.id).toBe('target');
    });
});

describe('findGeminiButton', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('finds the button by its exact aria-label', () => {
        renderPage('<button id="target" aria-label="Ask Gemini"></button>');

        expect(findGeminiButton(document)?.id).toBe('target');
    });

    it('finds a localized button via the untranslated product-name fragment', () => {
        renderPage('<button id="target" aria-label="Спросить Gemini"></button>');

        expect(findGeminiButton(document)?.id).toBe('target');
    });

    it('finds the Docs editor variant labeled Try Gemini', () => {
        renderPage('<button id="target" aria-label="Try Gemini"></button>');

        expect(findGeminiButton(document)?.id).toBe('target');
    });

    it('returns null when the button is absent', () => {
        renderPage('');

        expect(findGeminiButton(document)).toBeNull();
    });

    it('returns null when several candidates mention gemini without an exact label match', () => {
        renderPage('<button aria-label="Gemini settings"></button><button aria-label="Открыть Gemini"></button>');

        expect(findGeminiButton(document)).toBeNull();
    });

    it('prefers the exact label when a second element merely mentions gemini', () => {
        renderPage(
            '<button id="exact" aria-label="Ask Gemini"></button><button aria-label="Gemini settings"></button>',
        );

        expect(findGeminiButton(document)?.id).toBe('exact');
    });

    it('ignores gemini mentions outside the banner', () => {
        renderPage('', '<button aria-label="Ask Gemini"></button>');

        expect(findGeminiButton(document)).toBeNull();
    });
});

describe('findHideTarget', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    /**
     * Overrides the reported width of an element — happy-dom performs no
     * layout, so geometry is stubbed where the climb must be width-limited.
     *
     * @param element Element to patch.
     * @param width Reported width in pixels.
     */
    const stubWidth = (element: HTMLElement, width: number): void => {
        element.getBoundingClientRect = () => ({ width } as DOMRect);
    };

    it('climbs single-purpose wrappers up to the row item, like the real Upgrade markup', () => {
        document.body.innerHTML = `
            <div role="banner">
                <div id="row">
                    <button aria-label="Settings"></button>
                    <div id="row-item"><span><span><div id="touch-wrap">
                        <button id="btn" role="link">Upgrade</button>
                    </div></span></span></div>
                </div>
            </div>
        `;

        const target = findHideTarget(document.getElementById('btn') as HTMLElement);

        expect(target.id).toBe('row-item');
    });

    it('stops at an ancestor wider than the button', () => {
        document.body.innerHTML = `
            <div role="banner">
                <div id="wide"><div id="narrow"><button id="btn">Upgrade</button></div></div>
            </div>
        `;
        stubWidth(document.getElementById('btn') as HTMLElement, 100);
        stubWidth(document.getElementById('narrow') as HTMLElement, 104);
        stubWidth(document.getElementById('wide') as HTMLElement, 500);

        const target = findHideTarget(document.getElementById('btn') as HTMLElement);

        expect(target.id).toBe('narrow');
    });

    it('never hides a wrapper containing other clickable controls', () => {
        document.body.innerHTML = `
            <div role="banner">
                <div id="shared"><button id="btn">Upgrade</button><button aria-label="Settings"></button></div>
            </div>
        `;

        const target = findHideTarget(document.getElementById('btn') as HTMLElement);

        expect(target.id).toBe('btn');
    });

    it('returns the button itself when it sits directly in the banner', () => {
        document.body.innerHTML = '<div role="banner"><button id="btn">Upgrade</button></div>';

        const target = findHideTarget(document.getElementById('btn') as HTMLElement);

        expect(target.id).toBe('btn');
    });

    it('climbs past hidden duplicate clickables, like the real Drive cell', () => {
        document.body.innerHTML = `
            <div role="banner">
                <button aria-label="Settings"></button>
                <div id="cell"><div id="inner">
                    <button id="btn" role="link">Upgrade</button>
                    <button role="link" aria-label="Upgrade" style="display: none;"></button>
                </div></div>
            </div>
        `;

        const target = findHideTarget(document.getElementById('btn') as HTMLElement);

        expect(target.id).toBe('cell');
    });
});

describe('prehide selector alignment', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('the upgrade prehide selector matches what the detector finds', () => {
        renderPage('<button id="target" role="link"><span>Upgrade</span></button>');

        const detected = findUpgradeButton(document);
        const bySelector = document.querySelector(':is(header, [role="banner"]) button[role="link"]');

        expect(detected).not.toBeNull();
        expect(bySelector).toBe(detected);
    });

    it('the gemini prehide selector matches what the detector finds', () => {
        renderPage('<button id="target" aria-label="Try Gemini"></button>');

        const detected = findGeminiButton(document);
        const selector = ':is(header, [role="banner"]) :is(a, button, [role="button"], [role="link"])'
            + '[aria-label*="gemini" i]';
        const bySelector = document.querySelector(selector);

        expect(detected).not.toBeNull();
        expect(bySelector).toBe(detected);
    });
});
