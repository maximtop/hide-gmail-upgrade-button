/**
 * @file Report link shared by the onboarding page and popup.
 */

import { BUTTON_REPORT_FORM_URL } from './constants';

/**
 * Builds the button report URL with the installed extension version prefilled.
 *
 * @returns URL of the GitHub issue form.
 */
export const getButtonReportUrl = (): string => {
    const url = new URL(BUTTON_REPORT_FORM_URL);
    url.searchParams.set('version', chrome.runtime.getManifest().version);
    return url.href;
};
