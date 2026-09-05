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
let packageBytes: Buffer;
let sourceBytes: Buffer;
let release = { tagName: 'v1.2.3', isDraft: false, isPrerelease: false };

beforeEach(() => {
    vi.resetAllMocks();
    release = { tagName: 'v1.2.3', isDraft: false, isPrerelease: false };
    const archive = new AdmZip();
    archive.addFile('manifest.json', Buffer.from(updateManifest('{"manifest_version":3}', {
        browser: 'firefox', version: '1.2.3',
    })));
    packageBytes = archive.toBuffer();
    const source = new AdmZip();
    source.addFile('package.json', Buffer.from('{"version":"1.2.3"}'));
    for (const name of ['pnpm-lock.yaml', 'src/manifest.json', 'rspack.config.ts', 'DEVELOPMENT.md']) {
        source.addFile(name, Buffer.from('fixture'));
    }
    sourceBytes = source.toBuffer();
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
            return [['firefox', packageBytes], ['source', sourceBytes]].map(([kind, bytes]) =>
                `${createHash('sha256').update(bytes).digest('hex')}  hide-gmail-upgrade-button-1.2.3-${kind}.zip`,
            ).join('\n');
        }
        return Buffer.from(String(file).endsWith('-source.zip') ? sourceBytes : packageBytes);
    });
});

describe('release preparation protocol', () => {
    it('resolves latest once and pins every download to the selected tag', () => {
        prepare(env);
        const calls = vi.mocked(execFileSync).mock.calls;
        const views = calls.filter(([file, args]) => file === 'gh' && args?.[1] === 'view');
        expect(views).toHaveLength(1);
        expect(views[0][1]).not.toContain('v1.2.3');
        const download = calls.find(([file, args]) => file === 'gh' && args?.[1] === 'download');
        expect(download?.[1]).toContain('v1.2.3');
        expect(appendFileSync).toHaveBeenCalledWith('fixture-output', 'tag=v1.2.3\nversion=1.2.3\n');
    });
    it('refuses malformed input before invoking external tools', () => {
        expect(() => prepare({ ...env, INPUT_TAG: '--latest' })).toThrow('vX.Y.Z');
        expect(execFileSync).not.toHaveBeenCalled();
    });
    it.each(['isDraft', 'isPrerelease'] as const)('rejects %s without downloading', (field) => {
        release[field] = true;
        expect(() => prepare(env)).toThrow('published stable');
        expect(execFileSync).toHaveBeenCalledTimes(1);
    });
    it('stops before assets if store credentials are absent', () => {
        expect(() => prepare({ ...env, FIREFOX_CLIENT_SECRET: '' })).toThrow('FIREFOX_CLIENT_SECRET');
        expect(execFileSync).toHaveBeenCalledTimes(1);
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
});
