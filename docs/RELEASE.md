# Release process

## Cutting a release

1. Bump `version` in `package.json` (semantic, `X.Y.Z`) and land it on `master`.
2. Tag and push:

   ```bash
   git tag vX.Y.Z && git push origin vX.Y.Z
   ```

3. `release.yml` validates the tag against `package.json`, re-runs
   `pnpm validate`, rebuilds all three browsers and publishes a GitHub
   Release with:
   - `hide-gmail-upgrade-button-<version>-{chrome,edge,firefox}.zip`
   - `hide-gmail-upgrade-button-<version>-source.zip`
   - `SHA256SUMS.txt`

## Manual store deployment

Creating a GitHub Release does not submit to any store. In GitHub Actions,
choose **Deploy Chrome** or **Deploy Firefox**, then **Run workflow** on
`master`. An optional `tag` selects a published stable `vX.Y.Z` release;
leaving it blank resolves the latest published stable release once, at the
start of the run. All subsequent downloads use that selected tag.

Each store has its own concurrency group. Simultaneous runs for the same
store are serialized. Deployment never rebuilds the extension.

## Chrome Web Store deployment

**Deploy Chrome** uploads and submits the selected Chrome ZIP for review.

What it does:

1. Validates the tag shape, and that the release is neither a draft nor a
   pre-release.
2. Checks that the store configuration below is present.
3. Verifies the tagged commit is reachable from `master`.
4. Downloads **the archive already published in the release** — not a fresh
   rebuild — verifies its SHA-256 against `SHA256SUMS.txt` and checks the
   manifest version inside the zip. What users can verify is exactly what
   the store receives.
5. Uploads it with `go-webext`, and refuses to continue unless the store
   reports `Upload State: SUCCEEDED` for that exact version.
6. Submits for review with **deferred (staged) publishing**.

**Nothing goes live automatically.** After the review passes, publish by hand
in the Developer Dashboard — within 30 days, otherwise the approved draft
expires.

### Required configuration

Repository **variable**:

| Name | Value |
| --- | --- |
| `CHROME_APP_ID` | The extension ID from the dashboard URL |
| `CHROME_PUBLISHER_ID` | Publisher ID from Developer Dashboard → Publisher → Settings |

Repository **secrets**:

| Name | Where it comes from |
| --- | --- |
| `CHROME_CLIENT_ID` | OAuth client ID (Google Cloud project, "Desktop app" client) |
| `CHROME_CLIENT_SECRET` | Secret of that OAuth client |
| `CHROME_REFRESH_TOKEN` | Refresh token obtained once for that client |

Getting the OAuth credentials (one-time):

1. In a Google Cloud project, enable the **Chrome Web Store API**.
2. Create an **OAuth client ID** of type *Desktop app*; note the client ID
   and secret.
3. Grant consent once for scope
   `https://www.googleapis.com/auth/chromewebstore` and exchange the
   resulting code for a **refresh token** (see the Chrome Web Store API docs).
4. Store all three as repository secrets — never in the repository itself.

### Listing content

Descriptions, screenshots and promo images are **not** part of the API: the
store only accepts them through the Developer Dashboard. Sources and sizes
live in [docs/store/STORE_LISTING.md](store/STORE_LISTING.md); regenerate the
plain-text descriptions with `pnpm store:descriptions`.

## Firefox AMO deployment

**Deploy Firefox** has two modes:

- `submit`: validate the Firefox ZIP and matching source ZIP, check the
  authenticated AMO API for that exact version, then submit only if absent.
  Existing versions are never uploaded again. If an existing version has no
  source attached, fix it in the Developer Hub using the matching release
  source ZIP before continuing.
- `status`: read review/publication status without uploading. Once AMO offers
  the signed XPI, download it, check the AMO SHA-256, manifest version, Gecko
  ID and Mozilla signature envelope, then retain it as an Actions artifact
  for 30 days. The AMO hash authenticates the download; this is not a separate
  cryptographic verification of Mozilla's signing certificate chain.

Firefox publishes automatically after Mozilla approval. The summary
separates submission, pending review, approval and current publication.
Signing does not keep the job running: run `status` again later. A status API
failure after a successful upload produces a warning without invalidating
that submission. In status-only mode, the same failure fails the run.
Never retry an upload merely because status is temporarily unavailable.

The helper reads AMO JSON directly because `go-webext v0.4.2` cannot parse
some current `categories` responses. `go-webext update firefox` still handles
listed uploads and matching source attachment; it does not wait for signing.

Repository variable: `FIREFOX_AMO_ID` (listing slug or numeric identifier).
Repository secrets: `FIREFOX_CLIENT_ID` and `FIREFOX_CLIENT_SECRET` from
[AMO API credentials](https://addons.mozilla.org/en-US/developers/addon/api/key/).
Store credential values and listing identifiers belong in GitHub settings,
not committed configuration.

Both stores reject invalid tags, drafts/prereleases, commits outside master,
package/manifest version mismatches, missing configuration and missing,
duplicate or incorrect asset checksums before upload. Firefox additionally
checks the Gecko ID and source metadata. A new submission requires
`docs/AMO_REVIEW.md` inside that same release's source archive. Update these
[reviewer instructions](AMO_REVIEW.md) whenever build requirements change.

The initial Firefox v0.2.0 was submitted through the Developer Hub on
2026-09-05 with matching sources and is awaiting review. Its source archive
predates `AMO_REVIEW.md`; status checks and duplicate detection support it.
Do not submit it again. The next release can use the manual submit workflow.

## Edge Add-ons

Edge archives remain attached to GitHub Releases. Edge store deployment is a
separate task.
