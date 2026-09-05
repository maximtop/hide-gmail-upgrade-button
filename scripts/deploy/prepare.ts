/**
 * @file Resolve one published release and verify its immutable store upload inputs.
 */

import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
    ALL_BROWSER_TARGETS, BROWSER_TARGETS, RELEASE_ASSET_PREFIX, RELEASE_TAG_PATTERN, STORE_UPLOAD_DIRECTORY,
} from '../constants';
import type { BrowserTarget } from '../constants';
import { releaseVersion, requireConfiguration, verifyChecksum, verifyManifest, verifySource } from './release';

/**
 * Store identifiers and credentials each target needs before any asset is downloaded.
 */
const STORE_CONFIGURATION: Record<BrowserTarget, string[]> = {
    [BROWSER_TARGETS.CHROME]: ['CHROME_APP_ID', 'CHROME_PUBLISHER_ID', 'CHROME_CLIENT_ID', 'CHROME_CLIENT_SECRET',
        'CHROME_REFRESH_TOKEN'],
    [BROWSER_TARGETS.EDGE]: ['EDGE_PRODUCT_ID', 'EDGE_CLIENT_ID', 'EDGE_API_KEY'],
    [BROWSER_TARGETS.FIREFOX]: ['FIREFOX_CLIENT_ID', 'FIREFOX_CLIENT_SECRET', 'FIREFOX_AMO_ID'],
};

/**
 * Deployment modes each store workflow offers; `submit` is the default everywhere.
 * Edge `upload` only fills the draft so listing or privacy changes can be finished in Partner Center.
 */
const STORE_MODES: Record<BrowserTarget, string[]> = {
    [BROWSER_TARGETS.CHROME]: ['submit'],
    [BROWSER_TARGETS.EDGE]: ['submit', 'upload'],
    [BROWSER_TARGETS.FIREFOX]: ['submit', 'status'],
};

const DEFAULT_MODE = 'submit';

/**
 * Narrows the raw STORE_TARGET value to a browser this build produces.
 *
 * @param value Raw environment value.
 *
 * @returns Whether the value names a known store target.
 */
const isBrowserTarget = (value: string | undefined): value is BrowserTarget => {
    return (ALL_BROWSER_TARGETS as string[]).includes(value ?? '');
};

/**
 * Prepare store assets and GitHub outputs without executing code from the release tag.
 *
 * @param env Deployment configuration without logging credential values.
 *
 * @throws If release context, configuration, ancestry or assets cannot be verified.
 */
export const prepare = (env: NodeJS.ProcessEnv = process.env): void => {
    const browser = env.STORE_TARGET;
    const mode = env.DEPLOY_MODE || DEFAULT_MODE;
    if (!isBrowserTarget(browser) || !STORE_MODES[browser].includes(mode)) {
        throw new Error('Invalid store target or deployment mode');
    }
    requireConfiguration(['GITHUB_REPOSITORY', 'GITHUB_OUTPUT', 'GH_TOKEN'], env);
    const tag = env.INPUT_TAG?.trim();
    if (tag && !RELEASE_TAG_PATTERN.test(tag)) {
        throw new Error('Release tag must match vX.Y.Z');
    }
    const args = ['release', 'view', ...(tag ? [tag] : []), '--repo', env.GITHUB_REPOSITORY!,
        '--json', 'tagName,isDraft,isPrerelease'];
    const release = JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }));
    const version = releaseVersion(release);
    requireConfiguration(STORE_CONFIGURATION[browser], env);
    execFileSync('git', ['fetch', '--no-tags', 'origin', 'master']);
    const master = execFileSync('git', ['rev-parse', 'FETCH_HEAD^{commit}'], { encoding: 'utf8' }).trim();
    execFileSync('git', ['fetch', '--no-tags', 'origin', `refs/tags/${release.tagName}`]);
    const tagCommit = execFileSync('git', ['rev-parse', 'FETCH_HEAD^{commit}'], { encoding: 'utf8' }).trim();
    execFileSync('git', ['merge-base', '--is-ancestor', tagCommit, master]);
    const pkg = JSON.parse(execFileSync('git', ['show', `${tagCommit}:package.json`], { encoding: 'utf8' }));
    if (pkg.version !== version) {
        throw new Error('Tagged package.json version does not match release tag');
    }
    mkdirSync(STORE_UPLOAD_DIRECTORY, { recursive: true });
    const archive = `${RELEASE_ASSET_PREFIX}-${version}-${browser}.zip`;
    const source = `${RELEASE_ASSET_PREFIX}-${version}-source.zip`;
    const assets = [archive, ...(browser === BROWSER_TARGETS.FIREFOX ? [source] : [])];
    execFileSync('gh', ['release', 'download', release.tagName, '--repo', env.GITHUB_REPOSITORY!,
        '--dir', STORE_UPLOAD_DIRECTORY, ...[...assets, 'SHA256SUMS.txt'].flatMap((name) => ['--pattern', name])]);
    const checksums = readFileSync(path.join(STORE_UPLOAD_DIRECTORY, 'SHA256SUMS.txt'), 'utf8');
    for (const asset of assets) {
        verifyChecksum(asset, readFileSync(path.join(STORE_UPLOAD_DIRECTORY, asset)), checksums);
    }
    verifyManifest(readFileSync(path.join(STORE_UPLOAD_DIRECTORY, archive)), version, browser);
    if (browser === BROWSER_TARGETS.FIREFOX) {
        const notes = verifySource(readFileSync(path.join(STORE_UPLOAD_DIRECTORY, source)), version, false);
        writeFileSync(path.join(STORE_UPLOAD_DIRECTORY, 'approval-notes.txt'), notes);
    }
    appendFileSync(env.GITHUB_OUTPUT!, `tag=${release.tagName}\nversion=${version}\n`);
    console.log(`Verified ${release.tagName} (${tagCommit}) for ${browser}: ${assets.join(', ')}`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        prepare();
    } catch (error) {
        console.error(error instanceof Error ? error.message : 'Release preparation failed');
        process.exitCode = 1;
    }
}
