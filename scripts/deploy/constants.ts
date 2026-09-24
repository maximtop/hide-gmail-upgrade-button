/**
 * @file Configuration for this repository's shared extension deployment flow.
 */

/**
 * Prefix of every release asset: `<prefix>-<version>-<browser>.zip` and
 * `<prefix>-<version>-source.zip`, listed in `SHA256SUMS.txt`.
 */
export const RELEASE_ASSET_PREFIX = 'hide-gmail-upgrade-button';

/**
 * Stores this extension is deployed to; each one has a deploy workflow.
 */
export const STORE_TARGETS = ['chrome', 'edge', 'firefox'] as const;

/**
 * Store this repository can deploy to.
 */
export type StoreTarget = typeof STORE_TARGETS[number];

/**
 * Firefox add-on ID from `browser_specific_settings.gecko.id`.
 */
export const GECKO_ID = 'hide-gmail-upgrade-button@maximtop.dev';

/**
 * Files the Firefox source archive must contain.
 */
export const SOURCE_REQUIRED_FILES = [
    'package.json',
    'pnpm-lock.yaml',
    'src/manifest.json',
    'rspack.config.ts',
    'DEVELOPMENT.md',
];

/**
 * Reviewer notes submitted to AMO with every new Firefox version.
 */
export const AMO_REVIEW_NOTES_PATH = 'docs/AMO_REVIEW.md';

/**
 * Filename of the extracted reviewer notes consumed by preflight and upload.
 */
export const AMO_APPROVAL_NOTES_FILENAME = 'approval-notes.txt';

/**
 * Maximum length of AMO `approval_notes`; longer notes fail the submission with HTTP 400.
 * The limit is `max_length=3000` on `Version.approval_notes` in addons-server,
 * https://github.com/mozilla/addons-server/blob/5e222bdab92d/src/olympia/versions/models.py#L311-L313
 * The API serializer's `CharField(trim_whitespace=True)` strips surrounding whitespace with
 * Python `str.strip()` first, https://www.django-rest-framework.org/api-guide/fields/#charfield
 * and Django's `MaxLengthValidator` then compares `len()`, i.e. Unicode code points,
 * https://docs.djangoproject.com/en/stable/ref/validators/#maxlengthvalidator
 */
export const AMO_APPROVAL_NOTES_MAX_LENGTH = 3000;

/**
 * Shape of a release tag; the version is the tag without the `v` prefix.
 */
export const RELEASE_TAG_PATTERN = /^v[0-9]+\.[0-9]+\.[0-9]+$/;

/**
 * Directory the deploy workflows download the release assets into.
 */
export const STORE_UPLOAD_DIRECTORY = 'store-upload';
