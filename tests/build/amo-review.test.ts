// @vitest-environment node

/**
 * @file Keep the committed AMO reviewer notes within the length AMO accepts on submission.
 */

import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
    AMO_APPROVAL_NOTES_MAX_LENGTH,
    AMO_REVIEW_NOTES_PATH,
} from '../../scripts/deploy/constants';
import { amoNotesLength } from '../../scripts/deploy/release';

const ROOT = path.join(import.meta.dirname, '../..');

describe('AMO reviewer notes', () => {
    it('fit the AMO approval_notes limit', () => {
        const notes = fs.readFileSync(path.join(ROOT, AMO_REVIEW_NOTES_PATH), 'utf-8');

        expect(amoNotesLength(notes)).toBeLessThanOrEqual(AMO_APPROVAL_NOTES_MAX_LENGTH);
    });
});
