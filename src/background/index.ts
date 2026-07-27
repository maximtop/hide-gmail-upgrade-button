/**
 * @file Background entrypoint: after install or update, injects the content
 * script into Gmail tabs that are already open, so the setting takes effect
 * without reloading Gmail. Freshly loaded tabs are covered by the manifest
 * `content_scripts` declaration instead.
 */

import { injectIntoOpenGmailTabs } from './inject-open-tabs';

chrome.runtime.onInstalled.addListener(() => {
    injectIntoOpenGmailTabs().catch((error: unknown) => {
        console.debug('Injection into open Gmail tabs failed:', error);
    });
});
