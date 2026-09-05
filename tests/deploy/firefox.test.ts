/**
 * @file AMO state and signed artifact behavior with simulated network responses.
 */

import { createHash, createHmac } from 'node:crypto';
import AdmZip from 'adm-zip';
import { describe, expect, it, vi } from 'vitest';
import { updateManifest } from '../../scripts/build/helpers';
import { amoToken, describeAmoStatus, readAmo, shouldSubmit, verifySignedXpi } from '../../scripts/deploy/firefox';
import type { AmoAddon, AmoVersion } from '../../scripts/deploy/firefox';

const addon: AmoAddon = {
    guid: 'fixture@test', slug: 'fixture', status: 'public', current_version: { version: '1.2.3' },
};
const version: AmoVersion = { id: 123, version: '1.2.3', channel: 'listed', file: { status: 'unreviewed' } };

describe('AMO read-only checks', () => {
    it('rejects the masked secret displayed by AMO without disclosing it', () => {
        expect(() => amoToken('issuer', 'prefix...suffix')).toThrow('AMO secret is masked');
    });
    it('reports authentication diagnostics without echoing response secrets', async () => {
        const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
            detail: 'Signature has expired. Sensitive diagnostic: do-not-log-me',
        }), { status: 401 }));
        await expect(readAmo('fixture', '', 'jwt', request)).rejects.toThrow(
            /^AMO status request failed: HTTP 401 \(expired, signature\)$/,
        );
    });
    it('signs a short-lived JWT without exposing its secret', () => {
        const token = amoToken('issuer', 'private-secret');
        const [header, payload, signature] = token.split('.');
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
        expect(data.iss).toBe('issuer');
        expect(data.exp).toBeGreaterThan(data.iat);
        expect(data.exp - data.iat).toBeLessThanOrEqual(300);
        const expected = createHmac('sha256', 'private-secret').update(`${header}.${payload}`).digest('base64url');
        expect(signature).toBe(expected);
    });
    it('treats only 404 as absent; auth and server failures prevent upload', async () => {
        const request = vi.fn<typeof fetch>();
        request.mockResolvedValueOnce(new Response(null, { status: 404 }));
        expect(await readAmo('fixture@test', 'versions/1.2.3/', 'jwt', request)).toBeNull();
        for (const status of [401, 403, 429, 500]) {
            request.mockResolvedValueOnce(new Response(null, { status }));
            await expect(readAmo('fixture@test', '', 'jwt', request)).rejects.toThrow(`HTTP ${status}`);
        }
        request.mockRejectedValueOnce(new Error('network unavailable'));
        await expect(readAmo('fixture@test', '', 'jwt', request)).rejects.toThrow('network unavailable');
    });
    it('reads existing private versions without depending on categories response shape', async () => {
        const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(version)));
        expect(await readAmo('fixture@test', 'versions/1.2.3/', 'jwt', request)).toEqual(version);
        expect(request.mock.calls[0][0]).toContain('fixture%40test/versions/1.2.3/');
    });
    it('skips an existing complete version and stops incomplete submissions before a duplicate upload', () => {
        expect(shouldSubmit(null)).toBe(true);
        expect(shouldSubmit({ ...version, source: 'https://example.test/source.zip' })).toBe(false);
        expect(() => shouldSubmit(version)).toThrow('already exists without source');
    });
    it('distinguishes pending, approved, published, absent and disabled states', () => {
        expect(describeAmoStatus(addon, null)).toContain('not submitted');
        expect(describeAmoStatus(addon, version)).toContain('awaiting');
        const approved = { ...version, file: { status: 'public' } };
        expect(describeAmoStatus(addon, approved)).toContain('Approved and published');
        expect(describeAmoStatus({ ...addon, current_version: null }, approved)).toContain('not the current');
        expect(describeAmoStatus(addon, { ...approved, is_disabled: true })).toContain('Disabled');
    });
    it('verifies signed artifact integrity and refuses unsigned or wrong-version payloads', async () => {
        const zip = new AdmZip();
        const manifest = updateManifest('{"manifest_version":3}', { browser: 'firefox', version: '1.2.3' });
        zip.addFile('manifest.json', Buffer.from(manifest));
        const unsigned = zip.toBuffer();
        zip.addFile('META-INF/mozilla.rsa', Buffer.from('synthetic signature envelope'));
        const signed = zip.toBuffer();
        const hash = (bytes: Buffer) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
        await expect(verifySignedXpi(signed, hash(signed), '1.2.3')).resolves.toBeUndefined();
        await expect(verifySignedXpi(signed, hash(unsigned), '1.2.3')).rejects.toThrow('hash');
        await expect(verifySignedXpi(unsigned, hash(unsigned), '1.2.3')).rejects.toThrow('signature');
        await expect(verifySignedXpi(signed, hash(signed), '2.0.0')).rejects.toThrow('version');
    });
});
