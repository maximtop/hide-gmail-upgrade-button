/**
 * @file Background lifecycle wiring tests for optional Calendar support.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CALENDAR_URL_PATTERN } from '../../../src/common/constants';

const reconcileCalendarSupportMock = vi.hoisted(() => vi.fn());
const restoreOpenCalendarTabsMock = vi.hoisted(() => vi.fn());
const hasCalendarAccessMock = vi.hoisted(() => vi.fn());
const injectIntoOpenTabsMock = vi.hoisted(() => vi.fn());

vi.mock('../../../src/background/calendar-support', () => {
    return {
        hasCalendarAccess: hasCalendarAccessMock,
        reconcileCalendarSupport: reconcileCalendarSupportMock,
        restoreOpenCalendarTabs: restoreOpenCalendarTabsMock,
    };
});

vi.mock('../../../src/background/inject-open-tabs', () => {
    return { injectIntoOpenTabs: injectIntoOpenTabsMock };
});

const onInstalledAddListenerMock = vi.fn();
const onStartupAddListenerMock = vi.fn();
const onAddedAddListenerMock = vi.fn();
const onRemovedAddListenerMock = vi.fn();

type PermissionsListener = (permissions: chrome.permissions.Permissions) => void;

describe('background entrypoint', () => {
    beforeEach(async () => {
        vi.resetModules();
        reconcileCalendarSupportMock.mockReset().mockResolvedValue(undefined);
        restoreOpenCalendarTabsMock.mockReset().mockResolvedValue(undefined);
        hasCalendarAccessMock.mockReset().mockResolvedValue(false);
        injectIntoOpenTabsMock.mockReset().mockResolvedValue(undefined);
        onInstalledAddListenerMock.mockReset();
        onStartupAddListenerMock.mockReset();
        onAddedAddListenerMock.mockReset();
        onRemovedAddListenerMock.mockReset();

        vi.stubGlobal('chrome', {
            runtime: {
                onInstalled: { addListener: onInstalledAddListenerMock },
                onStartup: { addListener: onStartupAddListenerMock },
            },
            permissions: {
                onAdded: { addListener: onAddedAddListenerMock },
                onRemoved: { addListener: onRemovedAddListenerMock },
            },
        });
        vi.spyOn(console, 'debug').mockImplementation(() => {});

        await import('../../../src/background/index');
    });

    it('injects required hosts and reconciles Calendar after install or update', async () => {
        const listener = onInstalledAddListenerMock.mock.calls[0]?.[0] as () => void;

        listener();

        expect(injectIntoOpenTabsMock).toHaveBeenCalledWith();
        await vi.waitFor(() => {
            expect(reconcileCalendarSupportMock).toHaveBeenCalledOnce();
        });
    });

    it('reconciles the persistent Calendar registration at browser startup', async () => {
        const listener = onStartupAddListenerMock.mock.calls[0]?.[0] as () => void;

        listener();

        await vi.waitFor(() => {
            expect(reconcileCalendarSupportMock).toHaveBeenCalledOnce();
        });
    });

    it('reacts only to permission changes for the Calendar origin', async () => {
        const addedListener = onAddedAddListenerMock.mock.calls[0]?.[0] as PermissionsListener;
        const removedListener = onRemovedAddListenerMock.mock.calls[0]?.[0] as PermissionsListener;

        addedListener({ origins: ['https://example.com/*'] });
        removedListener({ origins: ['https://example.com/*'] });
        await Promise.resolve();
        expect(reconcileCalendarSupportMock).not.toHaveBeenCalled();

        addedListener({ origins: [CALENDAR_URL_PATTERN] });
        removedListener({ origins: [CALENDAR_URL_PATTERN] });

        await vi.waitFor(() => {
            expect(reconcileCalendarSupportMock).toHaveBeenCalledTimes(2);
        });
        expect(restoreOpenCalendarTabsMock).toHaveBeenCalledOnce();
    });

    it('does not let stale removal cleanup win over a fast permission re-grant', async () => {
        hasCalendarAccessMock.mockResolvedValue(true);
        const addedListener = onAddedAddListenerMock.mock.calls[0]?.[0] as PermissionsListener;
        const removedListener = onRemovedAddListenerMock.mock.calls[0]?.[0] as PermissionsListener;

        removedListener({ origins: [CALENDAR_URL_PATTERN] });
        addedListener({ origins: [CALENDAR_URL_PATTERN] });

        await vi.waitFor(() => {
            expect(reconcileCalendarSupportMock).toHaveBeenCalledOnce();
        });
        expect(restoreOpenCalendarTabsMock).not.toHaveBeenCalled();
    });
});
