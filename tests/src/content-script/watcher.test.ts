/**
 * @vitest-environment happy-dom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { UpgradeButtonWatcher } from '../../../src/content-script/watcher';
import { createUpgradeButtonWatcher } from '../../../src/content-script/watcher';

const DEBOUNCE_MS = 10;

const sleep = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

const upgradeButtonHtml = (id: string) => `<button id="${id}" role="link"><span>Upgrade</span></button>`;

describe('createUpgradeButtonWatcher', () => {
    let watcher: UpgradeButtonWatcher;
    let banner: HTMLElement;

    const isHidden = (id: string): boolean => {
        const el = document.getElementById(id);
        return el !== null && el.style.display === 'none';
    };

    beforeEach(() => {
        document.body.innerHTML = '<div role="banner"><button aria-label="Settings"></button></div><main></main>';
        banner = document.querySelector('[role="banner"]') as HTMLElement;
        watcher = createUpgradeButtonWatcher(document, DEBOUNCE_MS);
    });

    afterEach(() => {
        watcher.stop();
    });

    it('hides a button that is already present when started', () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('target'));

        watcher.start();

        expect(isHidden('target')).toBe(true);
    });

    it('hides a button that appears late', async () => {
        watcher.start();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('late'));

        await vi.waitFor(() => { expect(isHidden('late')).toBe(true); });
    });

    it('hides a recreated button after the previous one was removed', async () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('first'));
        watcher.start();

        (document.getElementById('first') as HTMLElement).remove();
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('second'));

        await vi.waitFor(() => { expect(isHidden('second')).toBe(true); });
    });

    it('re-applies hiding when the page rewrites the inline style of the hidden button', async () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('target'));
        watcher.start();

        const button = document.getElementById('target') as HTMLElement;
        button.style.display = '';
        // Attribute changes are not observed; an unrelated childList mutation
        // triggers the next check, as constant Gmail re-renders would.
        (document.querySelector('main') as HTMLElement).appendChild(document.createElement('div'));

        await vi.waitFor(() => { expect(isHidden('target')).toBe(true); });
    });

    it('does not react to mutations after stop', async () => {
        watcher.start();
        watcher.stop();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('late'));
        await sleep(DEBOUNCE_MS * 5);

        expect(isHidden('late')).toBe(false);
    });

    it('start is idempotent and stop after double start still disconnects', async () => {
        watcher.start();
        watcher.start();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('late'));
        await vi.waitFor(() => { expect(isHidden('late')).toBe(true); });

        watcher.stop();
        banner.insertAdjacentHTML('beforeend', `${upgradeButtonHtml('after-stop')}<button role="link">Другая</button>`);
        await sleep(DEBOUNCE_MS * 5);

        expect(isHidden('after-stop')).toBe(false);
    });

    it('restart after stop resumes hiding', async () => {
        watcher.start();
        watcher.stop();
        watcher.start();

        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('late'));

        await vi.waitFor(() => { expect(isHidden('late')).toBe(true); });
    });

    it('reaches a stable state without observer feedback loops', async () => {
        banner.insertAdjacentHTML('beforeend', upgradeButtonHtml('target'));
        watcher.start();
        await sleep(DEBOUNCE_MS * 3);

        const snapshot = document.body.innerHTML;
        await sleep(DEBOUNCE_MS * 5);

        expect(document.body.innerHTML).toBe(snapshot);
    });
});
