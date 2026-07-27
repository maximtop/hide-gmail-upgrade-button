# Agent & Contributor Guidelines

Build commands, structure and environment setup live in [DEVELOPMENT.md](DEVELOPMENT.md). This file covers conventions.

## Scope boundary

The content script hides two header buttons (Upgrade, Ask Gemini) behind popup toggles stored in `chrome.storage.local`, on Gmail, Google Drive and Google Docs; the mutation watcher keeps them hidden across re-renders, and the background re-injects into tabs already open at install time. Still separate tasks — do not add them "while you are here": icons and store assets.

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

## Dependencies

Every dependency must have a clear, explainable need for this small extension. No React/MobX/frameworks until the UI actually requires them. Zero runtime dependencies is the current baseline.

## Safety

- Never commit secrets, store credentials or extension store IDs.
- Keep manifest permissions minimal (`storage`, `scripting`, Gmail/Drive/Docs hosts only) — any addition must be justified.
- No analytics or data collection of any kind.

## Testing

- Test observable behavior. Do not write tests that read source files and compare strings against constants.
- Run `pnpm validate` before committing.
