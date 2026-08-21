import { beforeEach, describe, expect, it, vi } from 'vitest';

import { injectIntoOpenTabs } from '../../../src/background/inject-open-tabs';

const queryMock = vi.fn();
const executeScriptMock = vi.fn();

describe('injectIntoOpenTabs', () => {
    beforeEach(() => {
        queryMock.mockReset();
        executeScriptMock.mockReset().mockResolvedValue([]);
        vi.stubGlobal('chrome', {
            tabs: { query: queryMock },
            scripting: { executeScript: executeScriptMock },
        });
        vi.spyOn(console, 'debug').mockImplementation(() => {});
    });

    it('queries only tabs matching the granted URL patterns', async () => {
        queryMock.mockResolvedValue([]);

        await injectIntoOpenTabs();

        expect(queryMock).toHaveBeenCalledWith({
            url: ['https://mail.google.com/*', 'https://drive.google.com/*', 'https://docs.google.com/*'],
        });
        expect(executeScriptMock).not.toHaveBeenCalled();
    });

    it('injects the content script into every matching tab', async () => {
        queryMock.mockResolvedValue([{ id: 5 }, { id: 9 }]);

        await injectIntoOpenTabs();

        expect(executeScriptMock).toHaveBeenCalledTimes(2);
        expect(executeScriptMock).toHaveBeenCalledWith({
            target: { tabId: 5 },
            files: ['content-script.js'],
        });
        expect(executeScriptMock).toHaveBeenCalledWith({
            target: { tabId: 9 },
            files: ['content-script.js'],
        });
    });

    it('can target an optional granted origin without querying required hosts', async () => {
        queryMock.mockResolvedValue([]);

        await injectIntoOpenTabs(['https://calendar.google.com/*']);

        expect(queryMock).toHaveBeenCalledWith({ url: ['https://calendar.google.com/*'] });
    });

    it('skips tabs without an id', async () => {
        queryMock.mockResolvedValue([{ id: undefined }, { id: 3 }]);

        await injectIntoOpenTabs();

        expect(executeScriptMock).toHaveBeenCalledTimes(1);
        expect(executeScriptMock).toHaveBeenCalledWith({
            target: { tabId: 3 },
            files: ['content-script.js'],
        });
    });

    it('continues with remaining tabs when one injection fails', async () => {
        queryMock.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
        executeScriptMock
            .mockRejectedValueOnce(new Error('tab was discarded'))
            .mockResolvedValue([]);

        await expect(injectIntoOpenTabs()).resolves.toBeUndefined();

        expect(executeScriptMock).toHaveBeenCalledTimes(3);
    });
});
