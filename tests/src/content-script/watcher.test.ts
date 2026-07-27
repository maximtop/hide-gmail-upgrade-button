/**
 * @vitest-environment happy-dom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SETTINGS } from '../../../src/common/settings';
import type { HidingWatcher } from '../../../src/content-script/watcher';
import { createHidingWatcher } from '../../../src/content-script/watcher';

const DEBOUNCE_MS = 10;

const sleep = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

const upgradeButtonHtml = (id: string) => `<button id="${id}" role="link"><span>Upgrade</span></button>`;

const geminiButtonHtml = (id: string) => `<button id="${id}" aria-label="Ask Gemini"></button>`;

describe('createHidingWatcher', () => {
    let watcher: HidingWatcher;
    let banner: HTMLElement;

    const isHidden = (id: string): boolean => {
        const el = document.getElementById(id);
        return el !== null && el.style.display === 'none';
    };

    beforeEach(() => {
        document.body.innerHTML = '<div role="banner"><button aria-label="Settings"></button></div><main></main>';
        banner = document.querySelector('[role="banner"]') as HTMLElement;
        watcher = createHidingWatcher(document, DEBOUNCE_MS);
    });

    afterEach(() => {
        watcher.stop();
    });

    it('hides both feature buttons that are already present when started', () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('upgrade') + geminiButtonHtml('gemini'));

        watcher.start();

        expect(isHidden('upgrade')).toBe(true);
        expect(isHidden('gemini')).toBe(true);
    });

    it('hides buttons that appear late', async () => {
        watcher.start();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('upgrade') + geminiButtonHtml('gemini'));

        await vi.waitFor(() => {
            expect(isHidden('upgrade')).toBe(true);
            expect(isHidden('gemini')).toBe(true);
        });
    });

    it('hides a recreated button after the previous one was removed', async () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('first'));
        watcher.start();

        (document.getElementById('first') as HTMLElement).remove();
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('second'));

        await vi.waitFor(() => { expect(isHidden('second')).toBe(true); });
    });

    it('re-applies hiding when the page rewrites the inline style of a hidden button', async () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('upgrade'));
        watcher.start();

        const button = document.getElementById('upgrade') as HTMLElement;
        button.style.display = '';
        (document.querySelector('main') as HTMLElement).appendChild(document.createElement('div'));

        await vi.waitFor(() => { expect(isHidden('upgrade')).toBe(true); });
    });

    it('restores a button when its feature is switched off and re-hides on switch-on', () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('upgrade') + geminiButtonHtml('gemini'));
        watcher.start();

        watcher.applySettings({ ...DEFAULT_SETTINGS, hideUpgrade: false });

        expect(isHidden('upgrade')).toBe(false);
        expect(isHidden('gemini')).toBe(true);

        watcher.applySettings(DEFAULT_SETTINGS);

        expect(isHidden('upgrade')).toBe(true);
    });

    it('does not hide anything while both features are off, even after mutations', async () => {
        watcher.applySettings({ hideUpgrade: false, hideGemini: false });
        watcher.start();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('upgrade') + geminiButtonHtml('gemini'));
        await sleep(DEBOUNCE_MS * 5);

        expect(isHidden('upgrade')).toBe(false);
        expect(isHidden('gemini')).toBe(false);
    });

    it('does not react to mutations after stop', async () => {
        watcher.start();
        watcher.stop();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('late'));
        await sleep(DEBOUNCE_MS * 5);

        expect(isHidden('late')).toBe(false);
    });

    it('start is idempotent and restart after stop resumes hiding', async () => {
        watcher.start();
        watcher.start();
        watcher.stop();
        watcher.start();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('late'));

        await vi.waitFor(() => { expect(isHidden('late')).toBe(true); });
    });

    it('reaches a stable state without observer feedback loops', async () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('upgrade') + geminiButtonHtml('gemini'));
        watcher.start();
        await sleep(DEBOUNCE_MS * 3);

        const snapshot = document.body.innerHTML;
        await sleep(DEBOUNCE_MS * 5);

        expect(document.body.innerHTML).toBe(snapshot);
    });
});
