# Agent & Contributor Guidelines

Build commands, structure and environment setup live in [DEVELOPMENT.md](DEVELOPMENT.md). This file covers conventions.

## Scope boundary

The content script hides two header buttons (Upgrade, Ask Gemini) behind popup toggles stored in `chrome.storage.local`, on Gmail, Google Drive and Google Docs, plus Upgrade in Google Calendar after an optional runtime host grant. The mutation watcher keeps them hidden across re-renders, and the background re-injects into tabs already open when access is granted. A static onboarding page opens once after a fresh install (never on updates) and is linked from the popup: it shows what is hidden, offers the same optional Calendar grant as the popup, shows how to pin the extension (reading the pinned state via `action.getUserSettings`) and links to support, the privacy policy and the store listing of the build target. Still separate tasks — do not add them "while you are here": icons and store assets.

## Code style

- 4-space indent, max line length 120 (enforced by ESLint).
- Always use curly braces, even for single-statement blocks.
- No magic values — name constants in `scripts/constants.ts` (build) or a future `src/common/constants.ts` (runtime).
- JSDoc is mandatory: every file starts with a `@file` overview; exported functions, classes, interfaces and type aliases get a description. Types belong to TypeScript, not JSDoc tags.
- No barrel re-export `index.ts` files. Exception: `src/<entry>/index.ts` as a bundler entrypoint.

```ts
// ❌ if (app) app.textContent = 'Hello';
// ✅
if (app) {
    app.textContent = 'Hello';
}
```

## UI initialization

- Do not expose provisional default values for UI backed by asynchronous state. Render a validated synchronous cache before first paint when available; otherwise keep the unresolved region hidden and non-interactive while preserving its layout until the authoritative state is applied.
- Apply initial state without transitions and reveal the UI only after that state is committed. Enable animations only for subsequent user interaction.
- Test the observable pending and resolved UI states, including that authoritative values are applied before reveal; do not test source structure or CSS text.

## Dependencies

Every dependency must have a clear, explainable need for this small extension. No React/MobX/frameworks until the UI actually requires them. Zero runtime dependencies is the current baseline.

## Safety

- Never commit secrets, store credentials or extension store IDs.
- Keep manifest permissions minimal (`storage`, `scripting`, required Gmail/Drive/Docs hosts and optional Calendar access) — any addition must be justified.
- No analytics or data collection of any kind.

## Testing

- Test observable behavior. Do not write tests that read source files and compare strings against constants.
- Run `pnpm validate` before committing.
- Give every exported function its own direct test in that module's test file, even when a caller
  already exercises it indirectly. `ensureHidden` (visibility.ts) and `buildPrehideCss`/
  `buildOverrideCss` (prehide.ts) went untested this way — only reachable through `watcher.test.ts`
  or by re-typing their literal selector strings elsewhere — so a broken template or a changed
  selector wouldn't fail where the bug actually is.
- When a file serves two independent features, test both, even if one already has thorough
  coverage. `popup/index.ts`'s Calendar toggle had a full test file; the two feature checkboxes
  (`hide-upgrade`, `hide-gemini`) — the extension's actual main function — had none.
- A settings/storage adapter (`loadSettings`/`saveSettings`/`subscribeToSettings` style functions)
  needs its own tests against a stubbed `chrome.storage`, not just tests of the pure validator it
  wraps.
- A script that branches on an external API's status field (AMO, store APIs, etc.) needs a test per
  branch, not just the common one. The `firefox-cli.ts` signed/published branch (download, hash and
  hostname checks, disk writes) had zero orchestration-level coverage even though the unit it calls
  was tested.

## Hand-off

- In the final report, give the build command `cd <checkout-or-worktree> && make install && make dev chrome` and say whether you ran it.
