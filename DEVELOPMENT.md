# Development

## Shared developer commands

| Make | pnpm | Meaning |
| --- | --- | --- |
| `make install` | `pnpm install` | Install dependencies; `make setup` and `make init` are aliases. |
| `make build [browser]` | `pnpm build [browser]` | Build once in development mode; Chrome by default. |
| `make dev [browser]` | `pnpm dev [browser]` | Alias for the one-shot development build. |
| `make start [browser]` | `pnpm start [browser]` | Watch development files; Chrome by default. |
| `make release [browser]` | `pnpm release [browser]` | Build local production archives; all store targets by default. |
| `make package [browser]` | `pnpm package [browser]` | Alias for local release packaging. |
| `make check` | `pnpm check` | Static checks and automated tests, without store submission. |

`make` defaults to `make build`. Pass at most one supported browser as an
extra goal, for example `make build firefox`. Unknown targets fail before
building. `lint`, `typecheck`, and `test` also have matching Make targets;
`make validate` is a compatibility alias for `make check`.
Store upload/publish commands and CI deployment workflows are separate:
`release` and `package` never submit to a store or create a GitHub release.

Rspack supports Chrome, Edge, Firefox, and Safari and writes
`build/dev/<browser>` or `build/release/<browser>`, with matching ZIPs.
Safari targets Safari 16.4 or newer and produces WebExtension resources for
Apple's packager; the ZIP itself is not an installable Safari app.


## Prerequisites

- Node.js 24 (see `.nvmrc`; `engines` enforces `>=24 <25`)
- pnpm 11.18.0 installed separately (the expected version is pinned in the
  `packageManager` field)

## Commands

| Command | Description |
| --- | --- |
| `make install` | Install dependencies |
| `make dev chrome` | Build an unpacked development extension for Chrome |
| `make release chrome` | Build a production extension and ZIP archive for Chrome |
| `make lint` | Run ESLint; use `make typecheck` for TypeScript |
| `make test` | Run unit tests (Vitest, DOM tests via happy-dom) |

The build commands also accept `edge`, `firefox`, and `safari`; omit the browser to build
Chrome for development, all four targets for release. Lower-level `pnpm dev [browser]`, `pnpm release [browser]`,
`pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check` scripts remain
available. Run `pnpm dev chrome --watch` for a watched Chrome development build.

Use `pnpm icons` to re-render icon PNGs from `assets/icon/*.svg` after changing
the master artwork.

## Build output

```
build/<channel>/<browser>/      # unpacked extension
build/<channel>/<browser>.zip   # store-ready archive
```

Channels: `dev` (unminified, inline source maps, "(Dev)" name suffix) and `release`. The extension `version` is stamped into every manifest from `package.json` — the single source of truth.

Browser differences are applied by `scripts/build/helpers.ts`: Chrome/Edge get `background.service_worker`, Firefox gets `background.scripts` (event page) plus `browser_specific_settings.gecko`, and Safari gets `background.scripts` plus `browser_specific_settings.safari.strict_min_version = "16.4"`. Safari omits `minimum_chrome_version`. All targets retain exactly the same permissions and optional Calendar access. The pre-hide stylesheet `prehide.css` is generated at build time from the feature registry (`src/content-script/features.ts`), so its selectors can never drift from the detector's.

### Safari packaging and publication

```sh
pnpm release safari
# Equivalent: make release safari or pnpm package safari
```

This produces `build/release/safari/` and `build/release/safari.zip`, with a root
`manifest.json` stamped from `package.json`. No Xcode project or native layer is
needed for this resource build. The publication path is ZIP → Safari Web
Extension Packager in App Store Connect → TestFlight → App Review. The first
upload must confirm that the web packager accepts the archive and preserves the
extension version; acceptance and behavior in a real Safari session are manual
checks, separate from CI. There is no Safari store submission workflow here.

The local CLI can package the unpacked resources with
`xcrun safari-web-extension-packager build/release/safari --macos-only`.
In the previously observed CLI behavior, the containing app's bundle identifier
comes from `--app-name`, while `--bundle-identifier` applies only to the
extension; a mismatch fails packaging. The CLI sets the app version to `1.0`
instead of reading the manifest version. Confirm the web packager's behavior
on the first upload before submitting. Packaging does not prove live Safari
compatibility: check hide/restore toggles, optional Calendar grants, onboarding,
and re-injection after installation/update in Safari 16.4 or newer.

Settings use `storage.local`; Safari's lack of `storage.sync` synchronization
does not affect them. Until a Safari listing exists, its onboarding store link
points to this project's installation instructions.

### Reusing the build conventions

[Kode Injector](https://github.com/maximtop/kode-injector) and this extension
already use Rspack/SWC, per-browser manifest transforms, an `ArchivePlugin`,
`pnpm dev safari` / `pnpm release safari`, and matching
`build/<channel>/<browser>/` and `<browser>.zip` outputs. Kode Injector 0.9.2
has a published Safari app ([App Store](https://apps.apple.com/app/id6796361552));
its native messaging and containing-app build are additional requirements of
that extension. Hide Upgrade only needs the resource archive described above.

The existing `.github/actions/package-extension` action now accepts a
space-separated `browsers` input. Existing callers retain the default
`chrome edge firefox`; this repo passes `chrome edge firefox safari`. Other
extensions can copy the updated action, set their browser list, `build-dir`,
`asset-prefix`, and `locale-dir`, and retain the `extension-archives` artifact
and `SHA256SUMS.txt` release contract. The action accepts Safari background
scripts, pages, or a service worker; each extension's manifest tests define its
own minimum Safari version and background choice. It validates resources, not
native apps or signing. The release workflow downloads that one artifact,
verifies its checksums, and publishes every contained asset without a second
browser list. Store deploy validation selects exact asset names, so adding a
Safari archive does not change Chrome, Edge, or Firefox submission inputs.

To adopt Safari resources in another extension, add the target to its build
constants/Makefile, implement its manifest transform and target-specific links,
and test permission preservation. Keep native-app packaging separate when the
extension needs it. No new shared dependency or cross-repository migration is
required; adopting these files in other repositories is a separate change.

## Loading unpacked builds

- **Chrome:** `chrome://extensions` → Developer mode → Load unpacked → pick `build/dev/chrome`.
- **Edge:** `edge://extensions` → Developer mode → Load unpacked → pick `build/dev/edge`.
- **Firefox:** `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → pick any file inside `build/dev/firefox`.

After a rebuild, hit the reload (⟳) button on the extension card; open Gmail/Drive/Docs tabs are re-injected automatically on extension updates.

## Structure

```
src/
  manifest.json           MV3 manifest (version and background shape stamped per browser at build)
  _locales/               40 locale catalogs (key parity enforced by tests)
  assets/icons/           icon PNG set, generated by `pnpm icons`
  background/             onInstalled → inject into open tabs, open onboarding on install; Calendar registration
  common/                 settings contract + storage adapter, runtime constants
  content-script/         detector, hide/restore, mutation watcher, pre-hide overrides
  popup/                  popup UI (synchronous render from a localStorage cache)
  onboarding/             page opened after install: how it works, Calendar access, support links
scripts/
  constants.ts            build constants (targets, channels, gecko id)
  build/                  Rspack pipeline: bundle CLI, manifest/locales transforms, zip, generated files
  icons/                  icon PNG generator (sharp)
tests/                    Vitest suites: build transforms, content-script DOM behavior, popup cache
assets/icon/              master icon SVGs + design/export spec
rspack.config.ts          per-browser config factory
```

Styling note: there is no CSS pipeline — the popup and onboarding page styles live in their HTML, the content script injects only tiny generated/inline styles.

The onboarding page's store link is resolved per build target (`STORE_LISTING_URLS` in `scripts/constants.ts`), with the project installation page as Safari's pre-publication fallback.

## CI and releases

- **CI** (`.github/workflows/ci.yml`) runs on every push to `master` and every
  PR, and supports manual runs: separate lint, typecheck, test and package
  jobs, release builds for all four browsers, a manifest
  sanity check (version stamped, Chrome service worker, Firefox background
  scripts + gecko id, Safari background resources) and retains the four ZIPs,
  source archive, and checksums as `extension-archives`.
- **Please release** (`.github/workflows/please-release.yml`) is manual. It
  takes an exact newer `X.Y.Z` version and creates or updates the release PR.
- **Release** (`.github/workflows/release.yml`) runs after that PR is merged or
  on a manual-fallback `vX.Y.Z` tag. It verifies the version and `master`
  ancestry, reuses CI and its checked artifacts, and publishes a GitHub Release with the
  four browser zips, a source archive and `SHA256SUMS.txt`. Running it by hand
  is a dry run that publishes nothing.
- **Deploy Chrome Web Store**, **Deploy Edge Add-ons** and **Deploy Firefox
  Add-ons** run only when manually dispatched in GitHub Actions. A GitHub
  Release never submits to any store. All three validate the release with the
  `scripts/deploy` code and use existing release assets with matching checksums; the
  package is not rebuilt. Every workflow offers a `validate` mode that stops
  before the store. Chrome requires manual publication after approval. Edge
  is published by Microsoft after certification and offers an upload-only
  mode for releases that need listing or privacy changes in Partner Center.
  Firefox publishes after Mozilla approval and offers a separate read-only
  status mode.
- To cut a release, run `Please release` with the desired `X.Y.Z` and merge its
  PR. The manual version-and-tag path remains available. Full process, store
  configuration and the failure playbook: [docs/RELEASE.md](docs/RELEASE.md).
- All GitHub Actions are pinned to commit SHAs.

## Testing notes

- DOM tests run in happy-dom (per-file `@vitest-environment` pragma) on minimal anonymized fixtures — never on copied Gmail markup.
- Test observable behavior; do not write tests that read source files and compare strings.
- Background logic is tested against mocked `chrome.*` APIs.
