/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { hideElement, isHiddenByExtension, restoreElement } from '../../../src/content-script/visibility';

describe('hideElement / restoreElement', () => {
    let element: HTMLElement;
    let sibling: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="wrap"><a id="target">Upgrade</a><button id="sibling">Ok</button></div>';
        element = document.getElementById('target') as HTMLElement;
        sibling = document.getElementById('sibling') as HTMLElement;
    });

    it('hide sets display none and marks the element', () => {
        hideElement(element);

        expect(element.style.display).toBe('none');
        expect(isHiddenByExtension(element)).toBe(true);
    });

    it('restore returns the element to no inline display when there was none', () => {
        hideElement(element);
        restoreElement(element);

        expect(element.style.display).toBe('');
        expect(element.getAttribute('style') ?? '').not.toContain('none');
        expect(isHiddenByExtension(element)).toBe(false);
    });

    it('restore returns the original inline display value', () => {
        element.style.display = 'inline-flex';

        hideElement(element);
        restoreElement(element);

        expect(element.style.display).toBe('inline-flex');
    });

    it('repeated hide calls are idempotent and never lose the original state', () => {
        element.style.display = 'inline-flex';

        hideElement(element);
        hideElement(element);
        restoreElement(element);

        expect(element.style.display).toBe('inline-flex');
    });

    it('restore without a prior hide is a no-op', () => {
        element.style.display = 'flex';

        restoreElement(element);

        expect(element.style.display).toBe('flex');
    });

    it('hide/restore cycle leaves no extension attributes behind', () => {
        hideElement(element);
        restoreElement(element);

        expect(element.outerHTML).not.toContain('data-hgub');
    });

    it('does not touch sibling elements', () => {
        const siblingHtmlBefore = sibling.outerHTML;

        hideElement(element);
        restoreElement(element);

        expect(sibling.outerHTML).toBe(siblingHtmlBefore);
    });

    it('works on an element already removed from the document', () => {
        hideElement(element);
        element.remove();

        restoreElement(element);

        expect(element.style.display).toBe('');
    });
});
