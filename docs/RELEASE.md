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
choose **Deploy Chrome**, **Deploy Edge** or **Deploy Firefox**, then
**Run workflow** on `master`. An optional `tag` selects a published stable `vX.Y.Z` release;
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
Use the full original JWT secret: AMO may show an existing secret only as a
masked value containing dots. That displayed value cannot authenticate API
requests. Regenerating AMO credentials invalidates the previous key and can
affect other add-ons and repositories using the same account credentials;
coordinate their updates first.

Store credential values and listing identifiers belong in GitHub settings,
not committed configuration.

All three stores reject invalid tags, drafts/prereleases, commits outside master,
package/manifest version mismatches, missing configuration and missing,
duplicate or incorrect asset checksums before upload. Firefox additionally
checks the Gecko ID and source metadata. A new submission requires
`docs/AMO_REVIEW.md` inside that same release's source archive. Update these
[reviewer instructions](AMO_REVIEW.md) whenever build requirements change.

The initial Firefox v0.2.0 was submitted through the Developer Hub on
2026-09-05 with matching sources and is awaiting review. Its source archive
predates `AMO_REVIEW.md`; status checks and duplicate detection support it.
Do not submit it again. The next release can use the manual submit workflow.

## Edge Add-ons deployment

**Deploy Edge** updates a product that already exists in Partner Center.
The Microsoft Edge Add-ons API can neither create a product nor change
listing metadata, so the first submission — and every later change to
Availability, Properties, Privacy or Store listings — is done by hand in
Partner Center. The first-submission checklist and the copy-ready privacy
answers and certification notes live in
[docs/store/STORE_LISTING.md](store/STORE_LISTING.md).

Modes:

- `submit` (default): upload the release's Edge ZIP to the draft
  submission, wait until Partner Center reports the package as processed,
  then request certification.
- `upload`: only upload the package to the draft. Use it when the release
  changes permissions or anything else the Privacy or Store listings pages
  must reflect: finish those pages in Partner Center, then click **Publish**
  there.

What the workflow does:

1. The shared release checks: tag shape, published stable release, tagged
   commit reachable from `master`, matching `package.json` version, SHA-256
   of the published Edge archive, and a Chromium manifest carrying the
   release version and a service worker.
2. Uploads the archive with `go-webext` through the Edge Add-ons API v1.1
   (API key). The step fails unless package processing reaches `Succeeded`;
   `go-webext` v0.4.2 waits for that for one minute.
3. In `submit` mode, requests certification. `go-webext` reads the publish
   operation once, so `InProgress` in a green run means the request was
   accepted. The verdict arrives in Partner Center and by email, usually
   within seven business days, and Microsoft publishes a certified update
   itself according to the listing's availability settings.

There is no deferred publishing on Edge. The manual gates are running the
workflow itself, the `upload` mode for releases that need listing or privacy
changes, and the account owner's confirmations inside Partner Center.
Certification notes cannot be sent by `go-webext` v0.4.2: keep the reviewer
notes from STORE_LISTING.md in Partner Center and, when a release changes
the test steps, deploy it in `upload` mode and finish the submission there.
Microsoft accepts one submission at a time, and each update needs a higher
package version than the one in the store.

### Required configuration

Repository **variable**:

| Name | Value |
| --- | --- |
| `EDGE_PRODUCT_ID` | Product ID (GUID) from the extension overview page in Partner Center; not the public store ID |

Repository **secrets**:

| Name | Where it comes from |
| --- | --- |
| `EDGE_CLIENT_ID` | Partner Center → Microsoft Edge → **Publish API** → Client ID |
| `EDGE_API_KEY` | An active API key from the same page |

Getting the credentials (one-time): on the **Publish API** page, switch to
the API-key experience if the page still shows the retired v1 secrets, then
click **Create API credentials**. The key is shown once and Partner Center
displays its expiry date; rotate it before that date and update
`EDGE_API_KEY`. The Client ID and API key belong to the Partner Center
account, so another extension published from the same account can reuse
them; only `EDGE_PRODUCT_ID` is specific to this extension.

Failure playbook:

- **401/403**: the key is missing, expired or belongs to another Client ID.
  Create a new key, update the secret and re-run; nothing was uploaded.
- **Upload step times out while processing stays `InProgress`**: check the
  draft in Partner Center, wait for processing to settle and re-run only if
  no package was accepted.
- **Submission already in review**: wait for certification to finish before
  deploying again.
- **Certification rejected**: the verdict arrives after the run; fix the
  cause, then ship a new release or update the metadata in Partner Center.
