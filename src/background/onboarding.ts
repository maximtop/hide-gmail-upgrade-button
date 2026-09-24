/**
 * @file Opens the onboarding page once, right after the extension is
 * installed. Updates and browser updates never open it.
 */

import { ONBOARDING_PAGE_FILE } from '../common/constants';

/**
 * Opens the onboarding page in a new tab when the extension has just been
 * installed. `tabs.create` needs no permission.
 *
 * @param details Details of the `runtime.onInstalled` event.
 */
export const openOnboardingOnInstall = async (details: chrome.runtime.InstalledDetails): Promise<void> => {
    if (details.reason !== 'install') {
        return;
    }

    await chrome.tabs.create({ url: chrome.runtime.getURL(ONBOARDING_PAGE_FILE) });
};
