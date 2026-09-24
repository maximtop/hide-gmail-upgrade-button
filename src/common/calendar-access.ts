/**
 * @file Optional Google Calendar host access as seen by extension pages:
 * the popup toggle and the onboarding page button share one request/remove
 * flow and follow the browser's permission events, so both always show the
 * same authoritative state.
 */

import { CALENDAR_URL_PATTERN } from './constants';

/**
 * Creates the exact optional host request declared in the manifest.
 *
 * @returns Calendar host permission request.
 */
const getCalendarPermission = (): chrome.permissions.Permissions => {
    return { origins: [CALENDAR_URL_PATTERN] };
};

/**
 * Checks whether a permissions event concerns the optional Calendar origin.
 *
 * @param permissions Permission delta emitted by the browser.
 *
 * @returns Whether the Calendar origin is present in the delta.
 */
export const includesCalendarOrigin = (permissions: chrome.permissions.Permissions): boolean => {
    return permissions.origins?.includes(CALENDAR_URL_PATTERN) ?? false;
};

/**
 * Reads whether Google Calendar access is currently granted.
 *
 * @returns Authoritative permission state.
 */
export const readCalendarAccess = async (): Promise<boolean> => {
    return chrome.permissions.contains(getCalendarPermission());
};

/**
 * Requests or removes Calendar host access, then reads back the browser's
 * authoritative state. Must be called directly from a user gesture handler:
 * the browser API is invoked synchronously, before the first await, so the
 * gesture is not lost (Firefox rejects requests made after it).
 *
 * @param enabled Requested state.
 * @param previousEnabled State to report when the result cannot be confirmed.
 *
 * @returns Calendar access state after the operation.
 */
export const changeCalendarAccess = async (enabled: boolean, previousEnabled: boolean): Promise<boolean> => {
    try {
        await (enabled
            ? chrome.permissions.request(getCalendarPermission())
            : chrome.permissions.remove(getCalendarPermission()));
    } catch {
        // The operation may still have changed browser state before failing,
        // so the authoritative check below remains necessary.
    }

    try {
        return await readCalendarAccess();
    } catch {
        return previousEnabled;
    }
};

/**
 * Follows Calendar access changes made anywhere: the popup, the onboarding
 * page or the browser's own extension settings.
 *
 * @param onChange Called with the new access state.
 */
export const subscribeToCalendarAccess = (onChange: (enabled: boolean) => void): void => {
    chrome.permissions.onAdded.addListener((permissions) => {
        if (includesCalendarOrigin(permissions)) {
            onChange(true);
        }
    });
    chrome.permissions.onRemoved.addListener((permissions) => {
        if (includesCalendarOrigin(permissions)) {
            onChange(false);
        }
    });
};
