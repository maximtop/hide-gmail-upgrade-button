/**
 * @file Read-only Firefox deployment preflight and post-submit/status reporting.
 */

import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { AMO_REQUEST_TIMEOUT_MS, GECKO_ID, RELEASE_TAG_PATTERN, STORE_UPLOAD_DIRECTORY } from '../constants';
import { amoToken, describeAmoStatus, readAmo, shouldSubmit, verifySignedXpi } from './firefox';
import type { AmoAddon, AmoVersion } from './firefox';
import { requireConfiguration } from './release';

/**
 * Check exact-version state, without ever submitting a second copy.
 *
 * @param env Deployment configuration without logging credential values.
 *
 * @throws If identity cannot be established or a signed package fails verification.
 */
export const run = async (env: NodeJS.ProcessEnv = process.env): Promise<void> => {
    requireConfiguration(['FIREFOX_CLIENT_ID', 'FIREFOX_CLIENT_SECRET', 'FIREFOX_AMO_ID', 'VERSION'], env);
    const version = env.VERSION!;
    if (!RELEASE_TAG_PATTERN.test(`v${version}`)) {
        throw new Error('Invalid version');
    }
    const preflight = env.AMO_OPERATION === 'preflight';
    const token = amoToken(env.FIREFOX_CLIENT_ID!, env.FIREFOX_CLIENT_SECRET!);
    const addon = await readAmo<AmoAddon>(env.FIREFOX_AMO_ID!, '', token);
    if (!addon || addon.guid !== GECKO_ID || addon.is_disabled) {
        throw new Error('AMO listing missing, disabled, or Gecko ID mismatch');
    }
    const result = await readAmo<AmoVersion>(env.FIREFOX_AMO_ID!, `versions/${version}/`, token);
    if (result && (result.version !== version || result.channel !== 'listed')) {
        throw new Error('AMO returned a different version or channel');
    }
    if (preflight) {
        const submit = shouldSubmit(result);
        if (submit && !readFileSync(path.join(STORE_UPLOAD_DIRECTORY, 'approval-notes.txt'), 'utf8').trim()) {
            throw new Error('New submissions require docs/AMO_REVIEW.md in the release source ZIP');
        }
        if (env.GITHUB_OUTPUT) {
            appendFileSync(env.GITHUB_OUTPUT, `submit=${submit}\n`);
        }
        console.log(result ? 'Version already exists; upload skipped' : 'Version absent; safe to submit once');
        return;
    }
    const status = describeAmoStatus(addon, result);
    const hub = `https://addons.mozilla.org/en-US/developers/addon/${encodeURIComponent(addon.slug)}/versions`;
    const report = `## Firefox AMO — v${version}\n\n- ${status}\n- [Developer Hub](${hub})\n`
        + '- Firefox publishes automatically after approval. GitHub Release creation never submits a version.\n';
    console.log(status);
    if (env.GITHUB_STEP_SUMMARY) {
        appendFileSync(env.GITHUB_STEP_SUMMARY, report);
    }
    if (result?.file.status !== 'public' || result.is_disabled) {
        return;
    }
    if (!result.file.url || !result.file.hash) {
        throw new Error('Approved version has no downloadable signed artifact/hash yet; run status again later');
    }
    const url = new URL(result.file.url);
    if (url.protocol !== 'https:' || url.hostname !== 'addons.mozilla.org') {
        throw new Error('Unexpected AMO download URL');
    }
    // Public signed downloads do not need credentials. Never forward the JWT to a CDN.
    const response = await fetch(url, { signal: AbortSignal.timeout(AMO_REQUEST_TIMEOUT_MS) });
    if (!response.ok) {
        throw new Error(`Signed artifact download failed: HTTP ${response.status}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    await verifySignedXpi(bytes, result.file.hash, version);
    const output = path.join(STORE_UPLOAD_DIRECTORY, 'signed');
    mkdirSync(output, { recursive: true });
    writeFileSync(path.join(output, `firefox-${version}.xpi`), bytes);
    const checksum = `${result.file.hash.slice('sha256:'.length)}  firefox-${version}.xpi\n`;
    writeFileSync(path.join(output, 'SHA256SUMS.txt'), checksum);
    if (env.GITHUB_OUTPUT) {
        appendFileSync(env.GITHUB_OUTPUT, 'signed=true\n');
    }
    if (env.GITHUB_STEP_SUMMARY) {
        appendFileSync(env.GITHUB_STEP_SUMMARY, '- Signed XPI verified against AMO SHA-256, version and Gecko ID.\n');
    }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    run().catch((error) => {
        const message = error instanceof Error ? error.message : 'AMO status check failed';
        console.error(message);
        if (process.env.GITHUB_STEP_SUMMARY) {
            appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\nAMO check failed: ${message}\n`);
        }
        process.exitCode = 1;
    });
}
