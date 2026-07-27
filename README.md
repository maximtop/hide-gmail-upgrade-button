# Hide Upgrade Button for Gmail

A minimal browser extension (Manifest V3) that hides the Upgrade button in the Gmail toolbar. No analytics, no data collection.

> Status: early scaffold — the hiding logic and the popup toggle are under development.

## Install (from source)

```bash
pnpm install
pnpm dev chrome
```

Then load the unpacked extension from `build/dev/chrome/` via `chrome://extensions` (enable Developer mode → "Load unpacked").

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for commands, build channels and project structure. Conventions for contributors and AI agents live in [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE). This project is not affiliated with Google.
