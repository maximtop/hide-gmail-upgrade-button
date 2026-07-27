/**
 * @file Background entrypoint: after install or update, injects the content
 * script into supported Google tabs that are already open, so the setting
 * takes effect without reloading them. Freshly loaded tabs are covered by
 * the manifest `content_scripts` declaration instead.
 */

import { injectIntoOpenTabs } from './inject-open-tabs';

chrome.runtime.onInstalled.addListener(() => {
    injectIntoOpenTabs().catch((error: unknown) => {
        console.debug('Injection into open tabs failed:', error);
    });
});
