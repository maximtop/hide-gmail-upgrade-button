# Agent & Contributor Guidelines

Build commands, structure and environment setup live in [DEVELOPMENT.md](DEVELOPMENT.md). This file covers conventions.

## Scope boundary

The content script hides two header buttons (Upgrade, Ask Gemini) behind popup toggles stored in `chrome.storage.local`, on Gmail, Google Drive and Google Docs, plus Upgrade in Google Calendar after an optional runtime host grant. The mutation watcher keeps them hidden across re-renders, and the background re-injects into tabs already open when access is granted. Still separate tasks — do not add them "while you are here": icons and store assets.

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
