/**
 * @file Tests for optional Calendar host-access reconciliation.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    CALENDAR_CONTENT_SCRIPT_ID,
    CALENDAR_DISABLE_MESSAGE_TYPE,
    CALENDAR_URL_PATTERN,
    CONTENT_SCRIPT_FILE,
    PREHIDE_STYLESHEET_FILE,
} from '../../../src/common/constants';
import {
    hasCalendarAccess,
    reconcileCalendarSupport,
    restoreOpenCalendarTabs,
} from '../../../src/background/calendar-support';

const injectIntoOpenTabsMock = vi.hoisted(() => {
    return vi.fn();
});

vi.mock('../../../src/background/inject-open-tabs', () => {
    return { injectIntoOpenTabs: injectIntoOpenTabsMock };
});

const containsMock = vi.fn();
const getRegisteredContentScriptsMock = vi.fn();
const registerContentScriptsMock = vi.fn();
const updateContentScriptsMock = vi.fn();
const unregisterContentScriptsMock = vi.fn();
const queryMock = vi.fn();
const sendMessageMock = vi.fn();

const expectedRegistration = {
    id: CALENDAR_CONTENT_SCRIPT_ID,
    matches: [CALENDAR_URL_PATTERN],
    js: [CONTENT_SCRIPT_FILE],
    css: [PREHIDE_STYLESHEET_FILE],
    runAt: 'document_start',
    persistAcrossSessions: true,
};

describe('Calendar support', () => {
    beforeEach(() => {
        containsMock.mockReset();
        getRegisteredContentScriptsMock.mockReset().mockResolvedValue([]);
        registerContentScriptsMock.mockReset().mockResolvedValue(undefined);
        updateContentScriptsMock.mockReset().mockResolvedValue(undefined);
        unregisterContentScriptsMock.mockReset().mockResolvedValue(undefined);
        injectIntoOpenTabsMock.mockReset().mockResolvedValue(undefined);
        queryMock.mockReset().mockResolvedValue([]);
        sendMessageMock.mockReset().mockResolvedValue(undefined);

        vi.stubGlobal('chrome', {
            permissions: { contains: containsMock },
            scripting: {
                getRegisteredContentScripts: getRegisteredContentScriptsMock,
                registerContentScripts: registerContentScriptsMock,
                updateContentScripts: updateContentScriptsMock,
                unregisterContentScripts: unregisterContentScriptsMock,
            },
            tabs: {
                query: queryMock,
                sendMessage: sendMessageMock,
            },
        });
    });

    it.each([true, false])('reports Calendar access as %s', async (hasAccess) => {
        containsMock.mockResolvedValue(hasAccess);

        await expect(hasCalendarAccess()).resolves.toBe(hasAccess);

        expect(containsMock).toHaveBeenCalledWith({ origins: [CALENDAR_URL_PATTERN] });
    });

    it('registers the Calendar content script and injects already-open tabs after access is granted', async () => {
        containsMock.mockResolvedValue(true);

        await reconcileCalendarSupport();

        expect(getRegisteredContentScriptsMock).toHaveBeenCalledWith({ ids: [CALENDAR_CONTENT_SCRIPT_ID] });
        expect(registerContentScriptsMock).toHaveBeenCalledWith([expectedRegistration]);
        expect(updateContentScriptsMock).not.toHaveBeenCalled();
        expect(unregisterContentScriptsMock).not.toHaveBeenCalled();
        expect(injectIntoOpenTabsMock).toHaveBeenCalledWith([CALENDAR_URL_PATTERN]);
    });

    it('updates an existing Calendar registration after access is granted', async () => {
        containsMock.mockResolvedValue(true);
        getRegisteredContentScriptsMock.mockResolvedValue([{ id: CALENDAR_CONTENT_SCRIPT_ID }]);

        await reconcileCalendarSupport();

        expect(updateContentScriptsMock).toHaveBeenCalledWith([expectedRegistration]);
        expect(registerContentScriptsMock).not.toHaveBeenCalled();
        expect(unregisterContentScriptsMock).not.toHaveBeenCalled();
        expect(injectIntoOpenTabsMock).toHaveBeenCalledWith([CALENDAR_URL_PATTERN]);
    });

    it('unregisters the Calendar content script after access is absent or revoked', async () => {
        containsMock.mockResolvedValue(false);
        getRegisteredContentScriptsMock.mockResolvedValue([{ id: CALENDAR_CONTENT_SCRIPT_ID }]);

        await reconcileCalendarSupport();

        expect(unregisterContentScriptsMock).toHaveBeenCalledWith({ ids: [CALENDAR_CONTENT_SCRIPT_ID] });
        expect(registerContentScriptsMock).not.toHaveBeenCalled();
        expect(updateContentScriptsMock).not.toHaveBeenCalled();
        expect(injectIntoOpenTabsMock).not.toHaveBeenCalled();
    });

    it('does nothing when Calendar access and registration are both absent', async () => {
        containsMock.mockResolvedValue(false);

        await reconcileCalendarSupport();

        expect(registerContentScriptsMock).not.toHaveBeenCalled();
        expect(updateContentScriptsMock).not.toHaveBeenCalled();
        expect(unregisterContentScriptsMock).not.toHaveBeenCalled();
        expect(injectIntoOpenTabsMock).not.toHaveBeenCalled();
    });

    it('does not inject open tabs when dynamic registration fails', async () => {
        const registrationError = new Error('registration failed');
        containsMock.mockResolvedValue(true);
        registerContentScriptsMock.mockRejectedValue(registrationError);

        await expect(reconcileCalendarSupport()).rejects.toBe(registrationError);

        expect(injectIntoOpenTabsMock).not.toHaveBeenCalled();
    });

    it('broadcasts cleanup after browser-side revocation without needing URL access', async () => {
        queryMock.mockResolvedValue([{ id: 4 }, { id: undefined }, { id: 9 }]);
        sendMessageMock.mockRejectedValueOnce(new Error('no content script')).mockResolvedValue(undefined);

        await expect(restoreOpenCalendarTabs()).resolves.toBeUndefined();

        expect(queryMock).toHaveBeenCalledWith({});
        expect(sendMessageMock).toHaveBeenCalledTimes(2);
        expect(sendMessageMock).toHaveBeenCalledWith(4, { type: CALENDAR_DISABLE_MESSAGE_TYPE });
        expect(sendMessageMock).toHaveBeenCalledWith(9, { type: CALENDAR_DISABLE_MESSAGE_TYPE });
    });
});
