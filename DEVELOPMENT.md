# Development

## Prerequisites

- Node.js 24 (see `.nvmrc`; `engines` enforces `>=24 <25`)
- pnpm 10 (pinned via the `packageManager` field; `corepack enable` picks it up)

## Commands

| Command | Description |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev [browser] [--watch]` | Dev build; no browser = all targets. `--watch` needs exactly one browser |
| `pnpm release [browser]` | Release build (store-ready name, production mode) |
| `pnpm build` | Alias for `pnpm release` |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm lint` | ESLint (flat config) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm validate` | test + lint + typecheck |

Browser targets: `chrome`, `edge`, `firefox`. The same commands are available through `make` (e.g. `make dev chrome`).

## Build output

```
build/<channel>/<browser>/      # unpacked extension
build/<channel>/<browser>.zip   # store-ready archive
```

Channels: `dev` (unminified, inline source maps, "(Dev)" name suffix) and `release`. The extension `version` is stamped into every manifest from `package.json` — the single source of truth.

Browser differences are applied by `scripts/build/helpers.ts`: Chrome/Edge get `background.service_worker`, Firefox gets `background.scripts` (event page) plus `browser_specific_settings.gecko`.

## Loading unpacked builds

- **Chrome / Edge:** `chrome://extensions` (or `edge://extensions`) → Developer mode → Load unpacked → pick `build/dev/chrome` (or `edge`).
- **Firefox:** `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → pick any file inside `build/dev/firefox`.

## Structure

```
src/            manifest.json, _locales/, entrypoints (background, content-script, popup)
scripts/        build constants and the Rspack build pipeline (run via tsx)
tests/          Vitest unit tests
rspack.config.ts  per-browser config factory
```

Styling note: there is no CSS pipeline yet — it will be added together with the popup UI task.
