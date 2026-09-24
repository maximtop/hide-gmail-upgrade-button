// @vitest-environment node

/**
 * @file Keep the committed AMO reviewer notes within the length AMO accepts on submission.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import AdmZip from 'adm-zip';
import { describe, expect, it } from 'vitest';

import {
    AMO_APPROVAL_NOTES_MAX_LENGTH,
    AMO_REVIEW_NOTES_PATH,
    SOURCE_REQUIRED_FILES,
} from '../../scripts/deploy/constants';
import { amoNotesLength, verifySource } from '../../scripts/deploy/release';

const ROOT = path.join(import.meta.dirname, '../..');

describe('AMO reviewer notes', () => {
    it('fit the AMO approval_notes limit when read from a source archive of this repository', () => {
        const zip = new AdmZip();
        [...SOURCE_REQUIRED_FILES, AMO_REVIEW_NOTES_PATH].forEach((file) => {
            zip.addFile(file, readFileSync(path.join(ROOT, file)));
        });
        const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as { version: string };

        const notes = verifySource(zip.toBuffer(), pkg.version, true);

        expect(amoNotesLength(notes)).toBeLessThanOrEqual(AMO_APPROVAL_NOTES_MAX_LENGTH);
    });
});
