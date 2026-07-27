# Icon

Approved direction (2026-07-27): **"struck-through button"** — a white pill-shaped
button crossed by a bold diagonal slash on a teal rounded-square plate.
Metaphor: "this button is gone". Deliberately independent from Gmail/Google
branding: no envelope-M shapes, no Google brand colors or logo geometry.

Master file: [icon.svg](icon.svg) (128×128 viewBox — single source of truth).

## Design spec

| Element | Value |
| --- | --- |
| Plate | rounded square, corner radius 28/128 (21.9%), `#0F766E` (teal) |
| Glyph | white pill 76×24, rx 12, centered |
| Slash | 45°-ish diagonal, teal cut 16px wide + white core 7px, round caps |
| Palette | `#0F766E` + `#FFFFFF` only; no gradients, no shadows |

## Export requirements

- Extension icons: PNG **16, 32, 48, 128** px rendered from `icon.svg`
  (e.g. `rsvg-convert -w <size>` or sharp). Same artwork at every size; if the
  slash core drops below ~1px at 16 px, thicken the white core to 8-9px in a
  dedicated 16 px export — check on light and dark toolbars.
- Keep the plate opaque and the corner radius baked in: browsers do not mask
  extension icons.
- Wire into the build under `src/assets/icons/` + `manifest.json` `icons` and
  `action.default_icon` (16/32/48/128) — separate task.
- Store assets reuse the same artwork: 128 px listing icon, 440×280 promo
  tile and 1400×560 marquee on a `#0F766E` background — separate task.
