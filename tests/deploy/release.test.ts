/**
 * @file Store release validation against generated ZIP fixtures.
 */

import { createHash } from 'node:crypto';
import AdmZip from 'adm-zip';
import { describe, expect, it } from 'vitest';
import { updateManifest } from '../../scripts/build/helpers';
import {
    releaseVersion, requireConfiguration, verifyChecksum, verifyManifest, verifySource,
} from '../../scripts/deploy/release';

const pack = (files: Record<string, string>) => {
    const zip = new AdmZip();
    for (const [name, value] of Object.entries(files)) {
        zip.addFile(name, Buffer.from(value));
    }
    return zip.toBuffer();
};
const sourceFiles = {
    'package.json': JSON.stringify({ version: '1.2.3' }),
    'pnpm-lock.yaml': 'lockfileVersion: 9',
    'src/manifest.json': '{}',
    'rspack.config.ts': 'export default {};',
    'DEVELOPMENT.md': 'Build instructions',
    'docs/AMO_REVIEW.md': 'Reviewer instructions for this release',
};

describe('published release contract', () => {
    it('accepts a stable release and rejects drafts, prereleases and malformed tags', () => {
        const release = { tagName: 'v1.2.3', isDraft: false, isPrerelease: false };
        expect(releaseVersion(release)).toBe('1.2.3');
        const invalid = [{ isDraft: true }, { isPrerelease: true }, { tagName: 'v1.2.3-rc.1' }, { tagName: '-h' }];
        for (const change of invalid) {
            expect(() => releaseVersion({ ...release, ...change })).toThrow();
        }
    });
    it('reports missing names without disclosing present credentials', () => {
        expect(() => requireConfiguration(['KEY', 'SECRET'], { KEY: 'private-value' })).toThrow('SECRET');
        expect(() => requireConfiguration(['KEY'], { KEY: 'private-value' })).not.toThrow();
    });
    it('requires one exact basename checksum, accepts the git release ./ prefix', () => {
        const bytes = Buffer.from('a real archive payload');
        const digest = createHash('sha256').update(bytes).digest('hex');
        const line = `${digest}  ./release.zip\n`;
        expect(() => verifyChecksum('release.zip', bytes, line)).not.toThrow();
        for (const sums of ['', line + line, line.replace('release.zip', 'old-release.zip')]) {
            expect(() => verifyChecksum('release.zip', bytes, sums)).toThrow();
        }
        expect(() => verifyChecksum('release.zip', Buffer.from('tampered'), line)).toThrow();
    });
    it('accepts transformed browser packages and rejects wrong version, target or Gecko ID', () => {
        const firefox = updateManifest('{"manifest_version":3}', { browser: 'firefox', version: '1.2.3' });
        const chrome = updateManifest('{"manifest_version":3}', { browser: 'chrome', version: '1.2.3' });
        const bytes = pack({ 'manifest.json': firefox });
        expect(() => verifyManifest(bytes, '1.2.3', 'firefox')).not.toThrow();
        expect(() => verifyManifest(bytes, '2.0.0', 'firefox')).toThrow();
        expect(() => verifyManifest(pack({ 'manifest.json': chrome }), '1.2.3', 'firefox')).toThrow();
        const wrong = JSON.parse(firefox);
        wrong.browser_specific_settings.gecko.id = 'another-addon@example.test';
        expect(() => verifyManifest(pack({ 'manifest.json': JSON.stringify(wrong) }), '1.2.3', 'firefox')).toThrow();
    });
    it('requires matching source and notes for new submissions but permits historical status checks', () => {
        expect(verifySource(pack(sourceFiles), '1.2.3', true)).toContain('Reviewer instructions');
        expect(() => verifySource(pack(sourceFiles), '2.0.0', true)).toThrow();
        const historical = { ...sourceFiles };
        delete (historical as Partial<typeof sourceFiles>)['docs/AMO_REVIEW.md'];
        expect(() => verifySource(pack(historical), '1.2.3', true)).toThrow();
        expect(() => verifySource(pack(historical), '1.2.3', false)).not.toThrow();
        const incomplete = { ...sourceFiles };
        delete (incomplete as Partial<typeof sourceFiles>)['pnpm-lock.yaml'];
        expect(() => verifySource(pack(incomplete), '1.2.3', false)).toThrow();
    });
});
