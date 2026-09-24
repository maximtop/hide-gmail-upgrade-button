/**
 * @file Tests for opening the onboarding page after installation.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { openOnboardingOnInstall } from '../../../src/background/onboarding';

const EXTENSION_ORIGIN = 'chrome-extension://test-id/';

const createMock = vi.fn();

describe('openOnboardingOnInstall', () => {
    beforeEach(() => {
        createMock.mockReset().mockResolvedValue({});
        vi.stubGlobal('chrome', {
            runtime: {
                getURL: (path: string) => `${EXTENSION_ORIGIN}${path}`,
            },
            tabs: { create: createMock },
        });
    });

    it('opens the onboarding page in a new tab after a fresh install', async () => {
        await openOnboardingOnInstall({ reason: 'install' });

        expect(createMock).toHaveBeenCalledOnce();
        expect(createMock).toHaveBeenCalledWith({ url: `${EXTENSION_ORIGIN}onboarding.html` });
    });

    it.each([
        { reason: 'update', previousVersion: '0.2.0' },
        { reason: 'chrome_update' },
        { reason: 'shared_module_update', id: 'shared' },
    ] as const)('does not open the page on $reason', async (details) => {
        await openOnboardingOnInstall(details);

        expect(createMock).not.toHaveBeenCalled();
    });
});
