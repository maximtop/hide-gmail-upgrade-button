/**
 * @file Tests for hiding the Google Docs subscription promo banner (the
 * Gemini offer) through the detector and the mutation watcher.
 *
 * @vitest-environment happy-dom
 */

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import { DEFAULT_SETTINGS } from '../../../src/common/settings';
import { findBannerHideTarget, findSubscriptionPromoBanner } from '../../../src/content-script/detector';
import { createHidingWatcher } from '../../../src/content-script/watcher';

import type { HidingWatcher } from '../../../src/content-script/watcher';

const DOCS_HOSTNAME = 'docs.google.com';

/**
 * The supplied Docs Gemini offer banner, reduced to its structure: original
 * element nesting, roles, labels and the gstatic subscriptions graphic.
 */
const PROMO_BANNER_HTML = `
    <div id="container" class="appsDocsUiWizBannerBannerContainerEl" style="order: 17;">
        <div id="banner" class="javascriptMaterialdesignGm3WizBannerBanner" style="block-size: 60px;">
            <span class="elevation"><span class="overlay"></span></span>
            <div class="content" role="complementary" aria-label="Try Gemini in Docs, Gmail, and more">
                <div class="graphicTextWrapper">
                    <div class="graphic">
                        <img src="https://www.gstatic.com/subscriptions/img/aurora_gemini_spark_a7cc33cd.svg"
                            aria-hidden="true">
                    </div>
                    <div class="text">
                        <div>Try Gemini in Docs, Gmail, and more</div>
                        <div>Boost your productivity with AI, plus 5 TB of storage for 57% off for 1 month</div>
                    </div>
                </div>
                <div class="actions"><button aria-label="Get offer">Get offer</button></div>
                <span><button aria-label="Close banner"><svg></svg></button></span>
            </div>
        </div>
    </div>
`;

const INFO_BANNER_HTML = `
    <div id="info-container" style="order: 18;">
        <div class="banner">
            <div role="complementary" aria-label="You are offline">
                <div>You are offline. Changes will sync when you reconnect.</div>
                <button aria-label="Dismiss">Dismiss</button>
            </div>
        </div>
    </div>
`;

/**
 * Docs-like app shell: a flex column holding the toolbar, banners and the
 * editor surface as siblings.
 *
 * @param bannersHtml Banner markup placed between toolbar and editor.
 */
const renderDocs = (bannersHtml: string): void => {
    document.body.innerHTML = `
        <div id="app" style="display: flex; flex-direction: column;">
            <div id="toolbar" style="order: 1;"><button aria-label="Share">Share</button></div>
            ${bannersHtml}
            <div id="editor" style="order: 30;"><canvas></canvas></div>
        </div>
    `;
};

afterEach(() => {
    vi.unstubAllGlobals();
});

const isHidden = (id: string): boolean => {
    return (document.getElementById(id) as HTMLElement).style.display === 'none';
};

describe('findSubscriptionPromoBanner', () => {
    beforeEach(() => {
        vi.stubGlobal('location', { hostname: DOCS_HOSTNAME });
    });

    it('finds the Gemini offer banner region in Docs', () => {
        renderDocs(PROMO_BANNER_HTML);

        expect(findSubscriptionPromoBanner(document)).toBe(document.querySelector('.content'));
    });

    it('ignores ordinary informational banners', () => {
        renderDocs(INFO_BANNER_HTML);

        expect(findSubscriptionPromoBanner(document)).toBeNull();
    });

    it('is not fooled by promo wording without the subscription graphic', () => {
        renderDocs(PROMO_BANNER_HTML.replace(/<img[^>]*>/s, ''));

        expect(findSubscriptionPromoBanner(document)).toBeNull();
    });

    it('does nothing outside Docs', () => {
        vi.stubGlobal('location', { hostname: 'mail.google.com' });
        renderDocs(PROMO_BANNER_HTML);

        expect(findSubscriptionPromoBanner(document)).toBeNull();
    });
});

describe('findBannerHideTarget', () => {
    beforeEach(() => {
        vi.stubGlobal('location', { hostname: DOCS_HOSTNAME });
    });

    it('resolves the banner container so the reserved space collapses', () => {
        renderDocs(PROMO_BANNER_HTML + INFO_BANNER_HTML);
        const region = findSubscriptionPromoBanner(document) as HTMLElement;

        expect(findBannerHideTarget(region)).toBe(document.getElementById('container'));
    });

    it('never climbs into a parent that holds other content', () => {
        renderDocs(PROMO_BANNER_HTML);
        const region = findSubscriptionPromoBanner(document) as HTMLElement;

        expect(findBannerHideTarget(region)).not.toBe(document.getElementById('app'));
    });
});

describe('hiding the promo banner with the watcher', () => {
    let watcher: HidingWatcher;

    beforeEach(() => {
        vi.stubGlobal('location', { hostname: DOCS_HOSTNAME });
        watcher = createHidingWatcher(document);
    });

    afterEach(() => {
        watcher.stop();
    });

    it('hides a banner already present and leaves informational banners and the editor alone', () => {
        renderDocs(PROMO_BANNER_HTML + INFO_BANNER_HTML);

        watcher.start();

        expect(isHidden('container')).toBe(true);
        expect(isHidden('info-container')).toBe(false);
        expect(isHidden('editor')).toBe(false);
        expect(isHidden('toolbar')).toBe(false);
    });

    it('hides a dynamically inserted banner and a re-inserted one after dismissal', async () => {
        renderDocs(INFO_BANNER_HTML);
        watcher.start();

        document.getElementById('toolbar')?.insertAdjacentHTML('afterend', PROMO_BANNER_HTML);
        await vi.waitFor(() => {
            expect(isHidden('container')).toBe(true);
        });

        document.getElementById('container')?.remove();
        document.getElementById('toolbar')?.insertAdjacentHTML('afterend', PROMO_BANNER_HTML);
        await vi.waitFor(() => {
            expect(isHidden('container')).toBe(true);
        });
        expect(isHidden('info-container')).toBe(false);
    });

    it('restores the banner when the upgrade setting is switched off', () => {
        renderDocs(PROMO_BANNER_HTML);
        watcher.start();
        expect(isHidden('container')).toBe(true);

        watcher.applySettings({ ...DEFAULT_SETTINGS, hideUpgrade: false });

        expect(isHidden('container')).toBe(false);
        expect(document.querySelector('[data-hgub-hidden]')).toBeNull();
    });

    it('keeps the banner when the Gemini setting alone is switched off', () => {
        renderDocs(PROMO_BANNER_HTML);
        watcher.start();

        watcher.applySettings({ ...DEFAULT_SETTINGS, hideGemini: false });

        expect(isHidden('container')).toBe(true);
    });
});
