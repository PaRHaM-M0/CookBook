# My Kitchen — Design System

## References used for the 2026 redesign

1. **Visual reference — Minimal Gallery** (`https://minimal.gallery/`)
   - Quiet, content-first pages.
   - Directory-like rhythm, generous whitespace, very little decoration.
   - Applied to: homepage hero, recipe index grid, section spacing, footer.

2. **Component reference — shadcn/ui** (`https://ui.shadcn.com/`)
   - Neutral design tokens, restrained borders, small shadows.
   - Button, Badge, Input, Card conventions: 8px radius, visible focus ring, secondary surfaces.
   - This project is dependency-free static HTML/CSS/JS, so the shadcn component
     specifications and tokens are implemented directly in CSS rather than
     installing the React component package.

## Typography

- **Persian UI:** Vazirmatn, 400–800.
- **English / Latin names and numerals:** Barlow, 500–800.
- Persian body copy remains RTL; English recipe titles are isolated LTR with
  `direction:ltr` and `unicode-bidi:isolate`.
- No serif display font and no Inter.

## Language and names

- Persian prose stays Persian.
- Names are never transliterated into Persian letters and never translated:
  dish names, people, brands, named ingredients, techniques and tools keep
  their original Latin spelling (for example `Pizza Peel`, `Porchetta`,
  `Gochujang`, `Parmigiano-Reggiano`).
- Wrap every Latin name inside Persian text in `<span class="en">…</span>` so
  Barlow is used and bidi isolation keeps the RTL sentence order intact.
- Generic concepts that are ordinary Persian culinary language stay Persian
  (for example پنیر خامه‌ای، سس شکلات، آب گازدار).

## Palette (v5)

Source: the 9 mean colours of a landscape frame — misty sky, moss, stone —
grouped as three regions × (light / **mean** / dark). **The three means carry the
page**; their light/dark siblings are only supporting steps.

| Region | Light | **MEAN (primary)** | Dark |
|---|---|---|---|
| Sky — canvas, cards | `#D3D9DC` | `#CBD2D5` | `#C2CBCE` |
| Moss — accent, actions | `#62774F` | `#4B603F` | `#364A2F` |
| Ground — ink, footer | `#2D3837` | `#242E2D` | `#1D2726` |

Role assignment: **mean sky family → page canvas**, **mean moss → accent and
primary actions**, **mean ground → ink and the footer band**. Surfaces are lifted
from the sky light so cards read as paper on a misty table; the canvas itself
carries a breath of moss so it never looks like neutral UI grey.

No pure `#000` and no pure `#FFF` anywhere — text on photography uses
`--on-photo:#E2E7E8`, and the dark theme's page sits at `#1A2322`, not black.

## Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#C0C8C4` | `#1A2322` | Page canvas |
| `--bg-soft` | `#B2BCB8` | `#212B2A` | Bands, insets, chips |
| `--surface` | `#E6E9E7` | `#28322F` | Cards, hero, nav |
| `--surface-2` | `#EEF1EF` | `#313C3A` | Search field, sheet, sticky heads |
| `--ink` | `#242E2D` | `#D3D9DC` | Primary text (8.2:1 / 11.3:1 on canvas) |
| `--ink-soft` | `#33403D` | `#AEB9BA` | Secondary text (6.3 / 8.0) |
| `--muted` | `#414F4B` | `#8A9799` | Meta, captions (5.0 / 5.3) |
| `--line` / `--line-strong` | `#A9B4B0` / `#93A09C` | `#36423F` / `#48544F` | Dividers, card edges |
| `--accent` | `#4B603F` | `#A8BC90` | Accent fills, focus, primary buttons |
| `--accent-strong` | `#364A2F` | `#B9CBA3` | Accent **text** (7.9 / 7.6 on surface) |
| `--badge-*` | `#364A2F` / `#D3D9DC` | `#A8BC90` / `#1D2726` | Editorial badges, "featured" |
| `--footer-bg` / `--footer-ink` | `#242E2D` / `#AEB9B7` | `#182120` / `#93A09E` | Footer band |
| `--radius` / `-lg` / `-xl` | `10px` / `16px` / `22px` | same | Controls / cards / showcase |

## Component rules

- **Header:** 64px, flat, border appears on scroll; text wordmark, no emoji.
- **Search:** 48px input, 8px radius, leading search icon, accent focus ring.
- **Filter chips:** pill badges; inactive = white/outline, active = ink background.
- **Recipe cards:** image first, Latin kicker, Barlow title, three-line Persian
  summary, outline badges, separated footer action.
- **Recipe pages:** breadcrumb, outline eyebrow badges, segmented stats,
  sticky ingredient card, numbered steps with two-digit Barlow counters.
- **Numbered steps (RTL/LTR):** the counter badge is positioned with
  `inset-inline-start` and the list is padded with `padding-inline-start`, so it
  sits on the **right in Persian and on the left in English** and never overlaps
  the copy. Never set `direction` on the `::before` itself — logical inset
  properties resolve against the element's *own* direction, so a `direction:ltr`
  on the pseudo drags the badge to the physical left in an RTL page. Use
  `unicode-bidi:isolate` if the digits need bidi isolation.
- **Numbered steps (continuation):** CSS counters reset per `<ol>` and cannot read
  the HTML `start` attribute, so `app.js` seeds `counter-reset: s (start-1)` on
  any `ol.steps[start]`. A phase that continues a previous list therefore keeps
  counting (05, 09, 22 …) instead of restarting at 01.
- **States:** homepage includes loading skeletons, empty-results panel and a
  data-load error panel.
- **Motion:** only a short reveal and image scale; `prefers-reduced-motion`
  disables non-essential movement.
- **Icons:** inline SVG for interface actions. Emoji is not used as navigation
  or as a substitute for interface icons.

## Layout

- Max width: 1180px; page padding 32px desktop, 18px mobile.
- Homepage grid: 3 columns → 2 at 950px → 1 at 640px.
- Recipe grid: 330px ingredients + flexible method column; one column below
  900px, with the ingredients card no longer sticky.


## PWA shell

- Display name: `PaRHaM's CookBook!`; short name: `CookBook`.
- Display: `standalone`; start URL and scope are relative so the same build works
  at a GitHub user-site root or a project subpath.
- Theme/background: `#C0C8C4`, matching the light mist-sky canvas. Dark-mode UI
  uses the `#1A2322` charcoal token; the binary icons intentionally retain the
  older teal artwork until a separate icon pass.
- Icons: 192 and 512 standard PNGs plus 192 and 512 maskable PNGs; the exported
  files are full-bleed squares and Android applies its own mask.
- Offline: `sw.js` precaches the index, every recipe page, CSS/JS and recipe
  images; navigations are network-first with cache fallback, static assets use
  stale-while-revalidate, and old cache versions are deleted on activation.
