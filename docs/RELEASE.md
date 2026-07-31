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

## Chrome Web Store deployment

`deploy-chrome-store.yml` runs when a **GitHub Release is published**
(pre-releases are skipped) and can also be re-run manually via
`workflow_dispatch` with the tag as input.

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

### Other stores

Firefox Add-ons and Edge Add-ons archives are attached to every release and
are uploaded by hand for now.
