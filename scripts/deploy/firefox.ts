/**
 * @file Minimal read-only AMO client for duplicate prevention and signed artifact verification.
 */

import { createHash, createHmac, randomUUID } from 'node:crypto';
import {
    AMO_API_URL, AMO_JWT_LIFETIME_SECONDS, AMO_REQUEST_TIMEOUT_MS, MILLISECONDS_PER_SECOND,
} from '../constants';
import { verifyManifest } from './release';

/**
 * AMO fields needed to distinguish review, approval, signing and publication.
 */
export type AmoVersion = {
    id: number;
    version: string;
    channel: string;
    source?: string | null;
    is_disabled?: boolean;
    file: { status: string; url?: string; hash?: string };
};

/**
 * Add-on identity and current publicly listed version.
 */
export type AmoAddon = {
    guid: string;
    slug: string;
    status: string;
    is_disabled?: boolean;
    current_version?: { version: string } | null;
};

/**
 * Build a short-lived AMO JWT without adding a runtime dependency.
 *
 * @param issuer API issuer from GitHub Secrets.
 * @param secret API secret from GitHub Secrets.
 */
export const amoToken = (issuer: string, secret: string): string => {
    const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
        iss: issuer, jti: randomUUID(), iat: now, exp: now + AMO_JWT_LIFETIME_SECONDS,
    })).toString('base64url');
    const message = `${header}.${payload}`;
    return `${message}.${createHmac('sha256', secret).update(message).digest('base64url')}`;
};

/**
 * Read one AMO entity. Only an actual 404 represents absence.
 *
 * @param id AMO listing identifier.
 * @param suffix Relative version endpoint, or empty for the add-on.
 * @param token Short-lived bearer token.
 * @param request Injectable transport for behavioral tests.
 *
 * @throws If AMO cannot confirm the state.
 */
export const readAmo = async <T>(id: string, suffix: string, token: string, request = fetch): Promise<T | null> => {
    const response = await request(`${AMO_API_URL}${encodeURIComponent(id)}/${suffix}`, {
        headers: { Authorization: `JWT ${token}` },
        signal: AbortSignal.timeout(AMO_REQUEST_TIMEOUT_MS),
        redirect: 'error',
    });
    if (response.status === 404) {
        return null;
    }
    if (!response.ok) {
        const body = await response.json().catch(() => null) as { detail?: unknown } | null;
        const detail = typeof body?.detail === 'string' ? body.detail : '';
        // Report only known authentication diagnostics, never arbitrary response values or credentials.
        const reason = detail.match(/expired|not yet valid|signature|issuer|credentials|authentication/i)?.[0];
        throw new Error(`AMO status request failed: HTTP ${response.status}${reason ? ` (${reason})` : ''}`);
    }
    return response.json() as Promise<T>;
};

/**
 * Give a conservative status for the exact requested version.
 *
 * @param addon Current listing state.
 * @param version Version state, including private pending versions.
 */
export const describeAmoStatus = (addon: AmoAddon, version: AmoVersion | null): string => {
    if (!version) {
        return 'Version not submitted';
    }
    if (version.is_disabled || addon.is_disabled || version.file.status === 'disabled') {
        return 'Disabled, rejected or unavailable; inspect Developer Hub';
    }
    if (version.file.status === 'unreviewed') {
        return 'Submitted; awaiting Mozilla review and signing';
    }
    if (version.file.status === 'public') {
        return addon.status === 'public' && addon.current_version?.version === version.version
            ? 'Approved and published on AMO' : 'Approved; not the current publicly listed version';
    }
    return `AMO file status: ${version.file.status}; inspect Developer Hub`;
};

/**
 * Verify AMO's signed XPI hash, manifest identity and signature envelope.
 *
 * @param bytes Downloaded signed package.
 * @param hash SHA-256 supplied by the authenticated AMO version response.
 * @param version Requested version.
 *
 * @throws If integrity, identity or signing evidence is missing.
 */
export const verifySignedXpi = async (bytes: Buffer, hash: string, version: string): Promise<void> => {
    if (!/^sha256:[a-f0-9]{64}$/.test(hash)
        || `sha256:${createHash('sha256').update(bytes).digest('hex')}` !== hash) {
        throw new Error('Signed XPI hash does not match AMO');
    }
    verifyManifest(bytes, version, 'firefox');
    const { default: AdmZip } = await import('adm-zip');
    const zip = new AdmZip(bytes);
    if (!zip.getEntries().some((entry) => /^META-INF\/(?:mozilla\.rsa|cose\.sig)$/i.test(entry.entryName))) {
        throw new Error('AMO artifact has no Mozilla signature envelope');
    }
};

/**
 * Decide whether an upload is needed; reject incomplete existing submissions.
 *
 * @param version Existing AMO version, or null if confirmed absent.
 *
 * @throws If an existing version needs manual source recovery.
 */
export const shouldSubmit = (version: AmoVersion | null): boolean => {
    if (version && !version.source) {
        throw new Error('Version already exists without source; attach matching source in Developer Hub');
    }
    return version === null;
};
