/**
 * @file Exercise the deployment preparation protocol against simulated GitHub and Git responses.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, readFileSync } from 'node:fs';
import AdmZip from 'adm-zip';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateManifest } from '../../scripts/build/helpers';
import { prepare } from '../../scripts/deploy/prepare';

vi.mock('node:child_process', () => ({ execFileSync: vi.fn() }));
vi.mock('node:fs', async (original) => ({
    ...await original<typeof import('node:fs')>(),
    appendFileSync: vi.fn(), mkdirSync: vi.fn(), readFileSync: vi.fn(), writeFileSync: vi.fn(),
}));

const env = {
    STORE_TARGET: 'firefox', DEPLOY_MODE: 'status', GITHUB_REPOSITORY: 'fixture/repository',
    GITHUB_OUTPUT: 'fixture-output', GH_TOKEN: 'fixture-token',
    FIREFOX_CLIENT_ID: 'fixture-issuer', FIREFOX_CLIENT_SECRET: 'fixture-secret', FIREFOX_AMO_ID: 'fixture',
};
const edgeEnv = {
    STORE_TARGET: 'edge', DEPLOY_MODE: 'submit', GITHUB_REPOSITORY: 'fixture/repository',
    GITHUB_OUTPUT: 'fixture-output', GH_TOKEN: 'fixture-token',
    EDGE_PRODUCT_ID: 'fixture-product', EDGE_CLIENT_ID: 'fixture-client', EDGE_API_KEY: 'fixture-key',
};
const pack = (browser: 'edge' | 'firefox') => {
    const archive = new AdmZip();
    archive.addFile('manifest.json', Buffer.from(updateManifest('{"manifest_version":3}', {
        browser, version: '1.2.3',
    })));
    return archive.toBuffer();
};
const downloadArguments = () => vi.mocked(execFileSync).mock.calls
    .find(([file, args]) => file === 'gh' && args?.[1] === 'download')?.[1] as string[];
let assets: Record<string, Buffer>;
let release = { tagName: 'v1.2.3', isDraft: false, isPrerelease: false };

beforeEach(() => {
    vi.resetAllMocks();
    release = { tagName: 'v1.2.3', isDraft: false, isPrerelease: false };
    const source = new AdmZip();
    source.addFile('package.json', Buffer.from('{"version":"1.2.3"}'));
    for (const name of ['pnpm-lock.yaml', 'src/manifest.json', 'rspack.config.ts', 'DEVELOPMENT.md']) {
        source.addFile(name, Buffer.from('fixture'));
    }
    assets = { firefox: pack('firefox'), edge: pack('edge'), source: source.toBuffer() };
    vi.mocked(execFileSync).mockImplementation((file, args) => {
        const command = `${file} ${(args as string[]).join(' ')}`;
        if (command.startsWith('gh release view')) {
            return JSON.stringify(release);
        }
        if (command.startsWith('git rev-parse')) {
            return 'fixture-commit';
        }
        if (command.startsWith('git show')) {
            return '{"version":"1.2.3"}';
        }
        return '';
    });
    vi.mocked(readFileSync).mockImplementation((file) => {
        if (String(file).endsWith('SHA256SUMS.txt')) {
            return Object.entries(assets).map(([kind, bytes]) =>
                `${createHash('sha256').update(bytes).digest('hex')}  hide-gmail-upgrade-button-1.2.3-${kind}.zip`,
            ).join('\n');
        }
        const kind = String(file).match(/-(edge|firefox|source)\.zip$/)?.[1] ?? 'firefox';
        return Buffer.from(assets[kind]);
    });
});

describe('release preparation protocol', () => {
    it('resolves latest once and pins every download to the selected tag', () => {
        prepare(env);
        const calls = vi.mocked(execFileSync).mock.calls;
        const views = calls.filter(([file, args]) => file === 'gh' && args?.[1] === 'view');
        expect(views).toHaveLength(1);
        expect(views[0][1]).not.toContain('v1.2.3');
        expect(downloadArguments()).toContain('v1.2.3');
        expect(appendFileSync).toHaveBeenCalledWith('fixture-output', 'tag=v1.2.3\nversion=1.2.3\n');
    });
    it('refuses malformed input before invoking external tools', () => {
        expect(() => prepare({ ...env, INPUT_TAG: '--latest' })).toThrow('vX.Y.Z');
        expect(execFileSync).not.toHaveBeenCalled();
    });
    it('rejects a deployment mode the target does not offer before invoking external tools', () => {
        expect(() => prepare({ ...edgeEnv, DEPLOY_MODE: 'status' })).toThrow('deployment mode');
        expect(() => prepare({ ...env, DEPLOY_MODE: 'upload' })).toThrow('deployment mode');
        expect(execFileSync).not.toHaveBeenCalled();
    });
    it.each(['isDraft', 'isPrerelease'] as const)('rejects %s without downloading', (field) => {
        release[field] = true;
        expect(() => prepare(env)).toThrow('published stable');
        expect(execFileSync).toHaveBeenCalledTimes(1);
    });
    it('stops before assets if store credentials are absent', () => {
        expect(() => prepare({ ...env, FIREFOX_CLIENT_SECRET: '' })).toThrow('FIREFOX_CLIENT_SECRET');
        expect(() => prepare({ ...edgeEnv, EDGE_API_KEY: '' })).toThrow('EDGE_API_KEY');
        expect(execFileSync).toHaveBeenCalledTimes(2);
    });
    it('rejects a commit outside master before downloading assets', () => {
        vi.mocked(execFileSync).mockImplementation((file, args) => {
            if (file === 'gh') {
                return JSON.stringify(release);
            }
            if (args?.[0] === 'merge-base') {
                throw new Error('not an ancestor');
            }
            return 'fixture-commit';
        });
        expect(() => prepare(env)).toThrow('not an ancestor');
        expect(appendFileSync).not.toHaveBeenCalled();
    });
    it('refuses corrupt checksums before writing successful release outputs', () => {
        vi.mocked(readFileSync).mockReturnValue('invalid checksum');
        expect(() => prepare(env)).toThrow('SHA-256');
        expect(appendFileSync).not.toHaveBeenCalled();
    });
    it('downloads only the Edge archive and accepts its Chromium manifest in upload mode', () => {
        prepare({ ...edgeEnv, DEPLOY_MODE: 'upload' });
        const download = downloadArguments();
        expect(download).toContain('hide-gmail-upgrade-button-1.2.3-edge.zip');
        expect(download.join(' ')).not.toContain('-source.zip');
        expect(appendFileSync).toHaveBeenCalledWith('fixture-output', 'tag=v1.2.3\nversion=1.2.3\n');
    });
    it('refuses an Edge package without a service worker even when its checksum matches', () => {
        assets.edge = assets.firefox;
        expect(() => prepare(edgeEnv)).toThrow('service worker');
        expect(appendFileSync).not.toHaveBeenCalled();
    });
});
