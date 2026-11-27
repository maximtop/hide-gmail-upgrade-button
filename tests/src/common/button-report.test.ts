/**
 * @file Tests the installed-version prefill on the shared report URL.
 */

import {
    afterEach,
    expect,
    it,
    vi,
} from 'vitest';

import { getButtonReportUrl } from '../../../src/common/button-report';

afterEach(() => {
    vi.unstubAllGlobals();
});

it('selects the button report form and uses the runtime manifest version', () => {
    vi.stubGlobal('chrome', { runtime: { getManifest: () => ({ version: '3.2.1.4' }) } });

    const url = new URL(getButtonReportUrl());
    expect(url.origin).toBe('https://github.com');
    expect(url.pathname).toBe('/maximtop/hide-gmail-upgrade-button/issues/new');
    expect(url.searchParams.get('template')).toBe('button-came-back.yml');
    expect(url.searchParams.get('version')).toBe('3.2.1.4');
});
