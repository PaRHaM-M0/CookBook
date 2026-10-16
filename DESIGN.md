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

## Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#fafaf9` | `#111312` | App background |
| `--surface` / `--card` | `#ffffff` | `#171918` | Cards, nav, panels |
| `--bg-soft` | `#f4f4f2` | `#191b1a` | Secondary surface, badges |
| `--ink` | `#181817` | `#f4f3ee` | Primary text and primary buttons |
| `--ink-soft` | `#66665f` | `#aaa9a0` | Body secondary text |
| `--line` | `#e5e3dc` | `#292c2a` | Dividers and card borders |
| `--accent` | `#205b73` | `#83bfd4` | Links, active information, focus |
| `--radius` | `8px` | `8px` | Controls |
| `--radius-lg` | `12px` | `12px` | Cards and panels |

## Component rules

- **Header:** 64px, flat, border appears on scroll; text wordmark, no emoji.
- **Search:** 48px input, 8px radius, leading search icon, accent focus ring.
- **Filter chips:** pill badges; inactive = white/outline, active = ink background.
- **Recipe cards:** image first, Latin kicker, Barlow title, three-line Persian
  summary, outline badges, separated footer action.
- **Recipe pages:** breadcrumb, outline eyebrow badges, segmented stats,
  sticky ingredient card, numbered steps with two-digit Barlow counters.
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
