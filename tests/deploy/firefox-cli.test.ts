// @vitest-environment node

/**
 * @file Verify Firefox preflight and status orchestration with simulated AMO responses.
 */

import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

import AdmZip from 'adm-zip';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import { GECKO_ID } from '../../scripts/deploy/constants';
import { AMO_STATUS } from '../../scripts/deploy/firefox';
import { AMO_OPERATION, run } from '../../scripts/deploy/firefox-cli';

vi.mock('node:fs', async (original) => ({
    ...await original<Record<string, unknown>>(),
    appendFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
}));
const env = {
    FIREFOX_CLIENT_ID: 'fixture-issuer',
    FIREFOX_CLIENT_SECRET: 'fixture-secret',
    FIREFOX_AMO_ID: 'fixture',
    VERSION: '1.2.3',
    GITHUB_OUTPUT: 'fixture-output',
    GITHUB_STEP_SUMMARY: 'fixture-summary',
};
const addon = {
    guid: GECKO_ID,
    slug: 'fixture',
    status: AMO_STATUS.Unreviewed,
    categories: ['appearance'],
};
const pending = {
    id: 123,
    version: '1.2.3',
    channel: 'listed',
    source: 'https://example.test/source.zip',
    file: { status: AMO_STATUS.Unreviewed },
};
const request = vi.fn<typeof fetch>();
const json = (value: unknown): Response => new Response(JSON.stringify(value));

const signedXpiFixture = (): { bytes: Buffer; hash: string } => {
    const zip = new AdmZip();
    zip.addFile('manifest.json', Buffer.from(JSON.stringify({
        manifest_version: 3,
        version: '1.2.3',
        browser_specific_settings: { gecko: { id: GECKO_ID } },
        background: { scripts: ['background.js'] },
    })));
    zip.addFile('META-INF/mozilla.rsa', Buffer.from('synthetic signature envelope'));
    const bytes = zip.toBuffer();
    const hash = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
    return { bytes, hash };
};

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', request);
    vi.mocked(readFileSync).mockReturnValue('Reproduce with pnpm install; pnpm release firefox');
    request.mockResolvedValueOnce(json(addon));
});
afterEach(() => {
    vi.unstubAllGlobals();
});

describe('Firefox deployment orchestration', () => {
    it.each(['', 'prefligth'])(
        'rejects invalid operation %j before contacting AMO',
        async (operation) => {
            await expect(run({ ...env, AMO_OPERATION: operation })).rejects
                .toThrow('Invalid AMO_OPERATION');
            expect(request).not.toHaveBeenCalled();
            expect(appendFileSync).not.toHaveBeenCalled();
            expect(writeFileSync).not.toHaveBeenCalled();
        },
    );
    it('permits one new version only when source reviewer notes are ready', async () => {
        request.mockResolvedValueOnce(new Response(null, { status: 404 }));
        await run({ ...env, AMO_OPERATION: AMO_OPERATION.Preflight });
        expect(appendFileSync).toHaveBeenCalledWith('fixture-output', 'submit=true\n');
        expect(request).toHaveBeenCalledTimes(2);
    });
    it('refuses new submission without reviewer notes', async () => {
        request.mockResolvedValueOnce(new Response(null, { status: 404 }));
        vi.mocked(readFileSync).mockReturnValue('');
        await expect(run({ ...env, AMO_OPERATION: AMO_OPERATION.Preflight })).rejects
            .toThrow('AMO_REVIEW.md');
        expect(appendFileSync).not.toHaveBeenCalled();
    });
    it('skips an existing historical version without requiring new source notes', async () => {
        request.mockResolvedValueOnce(json(pending));
        await run({ ...env, AMO_OPERATION: AMO_OPERATION.Preflight });
        expect(readFileSync).not.toHaveBeenCalled();
        expect(appendFileSync).toHaveBeenCalledWith('fixture-output', 'submit=false\n');
    });
    it.each([undefined, AMO_OPERATION.Status])(
        'reports pending review in status mode %j',
        async (operation) => {
            request.mockResolvedValueOnce(json(pending));
            await run({ ...env, AMO_OPERATION: operation });
            expect(request).toHaveBeenCalledTimes(2);
            expect(writeFileSync).not.toHaveBeenCalled();
            expect(appendFileSync).toHaveBeenCalledWith(
                'fixture-summary',
                expect.stringContaining('awaiting Mozilla'),
            );
        },
    );
    it('never treats a status outage as permission to upload', async () => {
        request.mockResolvedValueOnce(new Response(null, { status: 503 }));
        await expect(run({ ...env, AMO_OPERATION: AMO_OPERATION.Preflight })).rejects
            .toThrow('HTTP 503');
        expect(appendFileSync).not.toHaveBeenCalled();
    });
    it('rejects an unexpected listing identity before looking up versions', async () => {
        request.mockReset().mockResolvedValueOnce(json({ ...addon, guid: 'wrong@test' }));
        await expect(run({ ...env, AMO_OPERATION: AMO_OPERATION.Preflight })).rejects
            .toThrow('Gecko ID mismatch');
        expect(request).toHaveBeenCalledTimes(1);
    });
    it('downloads, verifies and writes the signed XPI once AMO publishes the version', async () => {
        const { bytes, hash } = signedXpiFixture();
        request.mockResolvedValueOnce(json({
            ...pending,
            file: { status: AMO_STATUS.Public, url: 'https://addons.mozilla.org/files/fixture.xpi', hash },
        }));
        request.mockResolvedValueOnce(new Response(new Uint8Array(bytes)));

        await run({ ...env, AMO_OPERATION: AMO_OPERATION.Status });

        expect(writeFileSync).toHaveBeenCalledWith(expect.stringContaining('firefox-1.2.3.xpi'), bytes);
        expect(writeFileSync).toHaveBeenCalledWith(
            expect.stringContaining('SHA256SUMS.txt'),
            `${hash.slice('sha256:'.length)}  firefox-1.2.3.xpi\n`,
        );
        expect(appendFileSync).toHaveBeenCalledWith('fixture-output', 'signed=true\n');
    });
    it('refuses a download URL that is not an AMO HTTPS host, without fetching it', async () => {
        request.mockResolvedValueOnce(json({
            ...pending,
            file: { status: AMO_STATUS.Public, url: 'https://evil.example.test/fixture.xpi', hash: 'sha256:aa' },
        }));

        await expect(run({ ...env, AMO_OPERATION: AMO_OPERATION.Status })).rejects
            .toThrow('Unexpected AMO download URL');
        expect(request).toHaveBeenCalledTimes(2);
        expect(writeFileSync).not.toHaveBeenCalled();
    });
    it('reports an approved version with no signed artifact yet, without downloading', async () => {
        request.mockResolvedValueOnce(json({ ...pending, file: { status: AMO_STATUS.Public } }));

        await expect(run({ ...env, AMO_OPERATION: AMO_OPERATION.Status })).rejects
            .toThrow('no downloadable signed artifact');
        expect(writeFileSync).not.toHaveBeenCalled();
    });
    it('refuses a signed download whose hash does not match the AMO-supplied one', async () => {
        const { bytes } = signedXpiFixture();
        request.mockResolvedValueOnce(json({
            ...pending,
            file: {
                status: AMO_STATUS.Public,
                url: 'https://addons.mozilla.org/files/fixture.xpi',
                hash: `sha256:${'0'.repeat(64)}`,
            },
        }));
        request.mockResolvedValueOnce(new Response(new Uint8Array(bytes)));

        await expect(run({ ...env, AMO_OPERATION: AMO_OPERATION.Status })).rejects
            .toThrow('hash does not match');
        expect(writeFileSync).not.toHaveBeenCalled();
    });
});
