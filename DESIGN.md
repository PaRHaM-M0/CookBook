# CookBook Design System — v8 “Landscape Green”

A bilingual recipe library for Persian RTL and English LTR. The interface uses a landscape-derived green palette, photographs as category navigation, and the existing bento home composition. Recipe content and page structure remain intact.

- **Visual reference:** a temperate landscape at first light — meadow greens, a soft sky, canopy shade, and warm sunlit straw.
- **Component source:** native HTML controls with small, project-owned CSS primitives; no external component library.
- **Typography:** Vazirmatn for Persian and Plus Jakarta Sans for Latin text.

## 1. Palette

The light theme is a green-tinted field rather than neutral gray or white. The dark theme uses the selected Rock, Moss, Sky palette at rock lightness 4: layered stone surfaces, sky-toned text, and moss for the library and selected controls. The light theme keeps its existing palette.

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#E5EDE1` | `#293432` |
| `--bg-soft` | `#D8E4D5` | `#444F4D` |
| `--surface` | `#F3F6EE` | `#323D3C` |
| `--surface-2` | `#EAF0E4` | `#3B4645` |
| `--line` | `#CEDBCB` | `#444F4D` |
| `--ink` | `#24352B` | `#D9DEE1` |
| `--ink-soft` | `#415548` | `#B9C3C5` |
| `--muted` | `#5B6D60` | `#A8B2B4` |
| `--accent` | `#4B7153` | `#9FB38E` |
| `--accent-strong` | `#365B40` | `#B3C4A6` |
| `--accent-soft` | `#D6E4D3` | `#2B3F27` |
| `--saffron` | `#D7AD56` | `#D9DEE1` |
| `--saffron-soft` | `#F0E4C6` | `#3B4645` |
| `--espresso` | `#31483A` | `#394D32` |

The standard theme surfaces avoid pure white and black (the QR image remains high-contrast black on white for scanning). `manifest.json` uses the light canvas as its default browser theme color; `assets/app.js` synchronizes the browser chrome with the selected theme.

## 2. Home page

- A restrained charcoal-green accent (#2D3837) highlights the search section and a recipe statistic, while softer stone tints distinguish recipe ingredient and statistic surfaces. The global green palette remains unchanged.
- A thin, non-interactive reading indicator follows page scroll beneath the sticky header, with RTL/LTR-aware origin and no delayed motion.
- The shared header keeps the logo physically left and controls right in both languages. Its globe language link is 46 × 29 px and the day/night switch is 64 × about 29 px, separated by 8 px with invisible 44 px-high touch areas; the switch follows the supplied Hamzeh day/night design. A dedicated search section below the feature searches recipe metadata and the bilingual ingredient tables.
- A large photographic feature opens with editorial copy and rotates through real recipes in random order, with previous, next and pause controls. Its play/pause control directly governs rotation, it suspends while the page is hidden, and it starts paused for reduced-motion users. Library counts and a quick-cook list follow the feature.
- **Category navigation is photographic:** 15 category tiles use recipe photography, image overlays, counts, and an active state. “All” and “Featured” are compact controls above the rail.
- The recipe library retains photo cards, category group headings, sorting, and search.
- The category rail supports native touch scrolling and mouse dragging; its own overflow is contained, with no page-level horizontal scrolling.
- Promotional and implementation-explanation blocks are intentionally absent from the site UI.

## 3. Native PWA installation

The manifest, icons, HTTPS deployment, and root-scoped service worker provide installability. The site has no install button and does not call `preventDefault()` on `beforeinstallprompt`; the browser owns the install affordance. Supported Android and desktop browsers may expose an address-bar or menu action. iOS Safari presents its native Share → Add to Home Screen flow.

## 4. Recipe pages and step numbers

The existing bilingual recipe pages keep their established hooks and data. `assets/recipe.css` supplies the shared palette and card treatment to all recipe pages.

- `ol.steps > li::before` places the step badge at logical `inline-start`.
- The text reserves 42 px at logical `inline-start`, leaving a 6 px gap after the 26 px badge.
- The same spacing is used at mobile and desktop widths, so the number does not cover text in either RTL or LTR pages.
- Lists with a `start` attribute seed the same `step` counter used by the badge.

## 5. Responsive image ladder and offline cache

Recipe covers use existing originals plus `-960.webp` and `-480.webp` derivatives. Home category tiles request the 480 px version and advertise 960/original fallbacks. `sw.js` caches the shell and a fallback photo at install; other photos are cached on demand and may be unavailable offline until viewed; the cache list is kept in sync with those files.

## 6. Accessibility and motion

- Persian content uses `dir="rtl"`; English content uses `dir="ltr"`. Mixed Latin text remains isolated from surrounding RTL text.
- Search, filters, sorting, and theme/language actions retain their accessible labels and keyboard focus rings. The mobile filter sheet is a modal dialog with focus trapping and restoration; the desktop filter drawer remains non-modal.
- Category cards expose their category and recipe count to assistive technology; their photographs are decorative.
- The mobile filter sheet follows pointer drags on its centered grip and header, with expanded and resting positions and a drag-to-dismiss gesture; filter content retains native scrolling.
- Step markers use logical spacing; recipe checklists remain operable on touch screens.
- `prefers-reduced-motion` disables nonessential transitions.
- Representative text-color pairs across both themes were contrast-checked; the lowest audited ratio is 4.61:1, meeting WCAG AA for normal text.

## 7. Source of truth

- `assets/recipes.js` — recipes, image paths, and localized facet labels.
- `assets/app.js` — search, filtering, sorting, theme persistence, recipe tools, and service-worker registration.
- `assets/theme.css`, `assets/home.css`, `assets/recipe.css` — shared visual system.
- `manifest.json`, `sw.js` — PWA metadata and offline caching.
