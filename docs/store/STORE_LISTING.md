# Store listing

Operational notes for the Chrome Web Store, Edge Add-ons and Firefox AMO
listings. Keep store-only copy in this directory so published listings never
drift silently from the repository.

## Where each field comes from

| Field | Source of truth | Limit |
| --- | --- | --- |
| Title | `name` in `src/_locales/<locale>/messages.json` (identical in all 40 locales, 43 chars) | Chrome 75 · AMO 50 · Edge 45 — guarded by a unit test (≤45) |
| Summary / short description | `description` in `src/_locales/<locale>/messages.json` | 132 chars (Chrome) — guarded by a unit test |
| Full description | [STORE_DESCRIPTIONS.md](STORE_DESCRIPTIONS.md) → `pnpm store:descriptions` → `build/store-descriptions/<locale>.txt` (plain text; stores render no markdown) | ≥ en/ru; other languages fall back to en |
| Privacy policy URL | `https://github.com/maximtop/hide-gmail-upgrade-button/blob/main/PRIVACY.md` (public once the repo is public) | — |
| Icon / promo images | `assets/icon/` master + `src/assets/icons/` PNGs; promo tiles are a separate task | — |

Title and summary update only when a new package version is published — the
stores read them from the uploaded package, not from the dashboard.

## Listing metadata

- Product name: `Hide Upgrade Button for Gmail, Drive & Docs`
- Category: Productivity (Chrome: "Workflow & Planning"; Edge: "Productivity"; AMO: "Appearance / Other")
- Website: `https://github.com/maximtop/hide-gmail-upgrade-button`
- Support URL: `https://github.com/maximtop/hide-gmail-upgrade-button/issues`
- Support email: `maximtop@gmail.com`

## Review-form answers

- **Single purpose:** hides promotional buttons (Upgrade, Ask Gemini) in the
  headers of Gmail, Google Drive and Google Docs.
- **Permission justifications:** `storage` — persist the two toggles;
  `scripting` — inject into already open Gmail/Drive/Docs tabs on install;
  host permissions for the three Google domains — the only sites the
  extension operates on.
- **Data collection:** none. No data is collected, transmitted or sold; no
  remote code; no network requests (see PRIVACY.md).

## Release notes (v0.1.0)

**en:**
Initial release. Hides the Upgrade and Ask Gemini buttons in Gmail, Google
Drive and Google Docs. Per-button toggles, instant flicker-free hiding that
survives Google's re-renders, works in already open tabs, interface in 40
languages. No analytics, no network requests.

**ru:**
Первый выпуск. Скрывает кнопки Upgrade и Ask Gemini в Gmail, Google Диске и
Google Документах. Отдельные переключатели для каждой кнопки, мгновенное
скрытие без мелькания, устойчивое к перерисовкам Google, работа в уже
открытых вкладках, интерфейс на 40 языках. Без аналитики и сетевых запросов.
