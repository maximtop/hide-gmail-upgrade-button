/**
 * @file Programmatic injection of the content script into Gmail tabs that
 * were already open when the extension was installed or updated — a manifest
 * content script only reaches tabs loaded after that.
 */

import { CONTENT_SCRIPT_FILE, GMAIL_URL_PATTERN } from '../common/constants';

/**
 * Injects the content script into every open Gmail tab. Only tabs matching
 * the granted Gmail URL pattern are queried; a failure on one tab (closed,
 * discarded, not injectable) is logged and never interrupts the rest. The
 * content script itself guards against double injection, so re-running is
 * safe.
 */
export const injectIntoOpenGmailTabs = async (): Promise<void> => {
    const tabs = await chrome.tabs.query({ url: GMAIL_URL_PATTERN });

    for (const tab of tabs) {
        if (typeof tab.id !== 'number') {
            continue;
        }

        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: [CONTENT_SCRIPT_FILE],
            });
        } catch (error) {
            console.debug(`Could not inject into tab ${tab.id}:`, error);
        }
    }
};
