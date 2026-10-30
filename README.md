# PaRHaM's CookBook!

A fast, zero-dependency, offline-first bilingual (**Persian RTL ⇄ English LTR**) culinary handbook and installable **Progressive Web App (PWA)** built for real work beside a hot stove and inside grocery aisles.

---

## Highlights

- **Full Bilingual Parity (`FA RTL ⇄ EN LTR`):** Every single recipe, ingredient sub-table, step, temperature, gram ratio, and scientific note exists identically in both Persian (`/index.html`, `/recipes/*.html`) and English (`/en/index.html`, `/en/recipes/*.html`), linked one-click via the header translation toggle (`#langToggle`) while preserving active query states (`?mode=`, `?gear=`, `?mood=`, `?dressing=`, `?style=`, `?sauce=`, `?scale=`) and section anchors (`#phase...`).
- **37 Complete Recipes Across 14 Dish Categories:** Spanning Neapolitan, Detroit-Style, Poolish, and Stuffed-Crust pizzas, pasta emulsions, dual-path burger engineering, a 25–30-minute high-protein double smash cheeseburger, a complete Popeyes-style fried-chicken meal with three sides, an interactive ten-sauce collection (eight fast-food copycats + Chile de Árbol Hot Honey + Creamy Garlic Aioli), a 200-hour-to-30-minute modular Austin burrito cockpit, steakhouse Caesar salad, two-style American & Japanese soufflé pancakes, South Indian *Chicken 65*, Korean *Yangnyeom* fried chicken, artisan breads, soups, charcuterie, sauces, desserts, and drinks.
- **Crafted v5 Product UI:** Landscape-derived mist/moss/stone palette, featured-recipe hero, photographic category rail, compact mobile result rows, modal mobile filter sheet, floating thumb-zone action bar, precise press/hover timing, reduced-motion support, and `/` / `Escape` keyboard search controls. The shipped contract lives in `DESIGN.md`.
- **Built-In Kitchen Pro Tools (`assets/app.js`):**
  1. **Cooking Screen Wake Lock (`#wakeToggle`):** Uses the native `Screen Wake Lock API` (with automatic `visibilitychange` re-acquisition) so phone/tablet screens never dim while hands are covered in dough or oil.
  2. **Tap-to-Check Grocery & Mise-en-Place Checklists:** Tap any ingredient row (`table.ing tbody tr`) or numbered instruction step (`ol.steps > li`) to cross it off — persisted per recipe slug in `localStorage` across both languages with a one-tap **Clear checks** reset.
  3. **Live Portion Scaler (`0.5× | 1× | 2×`):** Instant gram/spoon/fraction scaling above every ingredient card (intelligently skipping oven temperatures, baker's percentages, and knife thicknesses).
  4. **URL Query State Sync:** Shareable deep links lock interactive multi-path recipes directly onto the selected configuration:
     - `grand-unified-burger.html?mode=juicy` (`smash` | `juicy` | `both`)
     - `modular-burrito-encyclopedia.html?gear=t2&mood=m2` (`t1` | `t2` | `t3` | `all` × `m1`..`m5`)
     - `classic-caesar-salad.html?dressing=a` (`a` | `b` | `both`)
     - `perfect-pancakes.html?style=japanese` (`american` | `japanese` | `both`)
     - `fast-food-sauce-copycat-collection.html?sauce=garlic-aioli` (`sweet-sour` | `blackened-ranch` | `canes` | `honey-bbq` | `spicy-ketchup` | `mayo` | `fire` | `kfc` | `hot-honey` | `garlic-aioli` | `all`)
     - Any recipe with `?scale=0.5` or `?scale=2`
- **Fault-Tolerant Two-Tier Offline PWA (`sw.js`):**
  - **Tier 1 (`CORE_URLS`):** All HTML, CSS, JS, `manifest.json`, and app icons precache atomically for instant offline capability.
  - **Tier 2 (`IMAGE_URLS`):** All 53 optimized `.webp` food photographs cache asynchronously via `Promise.allSettled` so a flaky mobile connection never blocks PWA installation.

---

## Repository Structure

```text
.
├── index.html                  # Persian (RTL) directory, search & faceted filters
├── en/
│   ├── index.html              # English (LTR) directory, search & faceted filters
│   └── recipes/                # 37 English (LTR) recipe pages + _template.html
├── recipes/                    # 37 Persian (RTL) recipe pages + _template.html
├── assets/
│   ├── theme.css               # Design tokens (light/dark), typography (Barlow + Vazirmatn), navbar
│   ├── home.css                # Directory layout, category rail, scrollable sticky filter sidebar
│   ├── recipe.css              # Recipe layout, scrollable sticky ingredient card, checklist & scaler styles
│   ├── recipes.js              # Central bilingual catalog (FILTERS + RECIPES metadata)
│   └── app.js                  # Search, facet engine, Wake Lock, checklists, scaler, URL sync & SW registration
├── images/                     # Optimized WebP cover photography + images/toppings/*.webp
├── icons/                      # PWA standard & maskable WebAPK icons + Apple touch icon
├── manifest.json               # Web App Manifest (standalone display, relative scope "./")
├── DESIGN.md                   # v5 palette, typography, component, motion & RTL/LTR contract
└── sw.js                       # Two-tier offline Service Worker (decimal semantic versioning)
```

---

## Deploying to GitHub Pages or Cloudflare Pages

This project is 100% static with relative asset/manifest/Service Worker paths (`./`), working out of the box on both root domains (`https://example.com/`) and project subpaths (`https://<username>.github.io/<repo>/`):

1. Push all repository files directly to the root of your `main` branch.
2. In GitHub: open **Settings → Pages → Build and deployment**, set **Source** to **Deploy from a branch**, select **`main` / `(root)`**, and save.
3. On Android (**Chrome / Samsung Internet**): open the live HTTPS URL and tap **Install CookBook** (or browser menu → **Install app**) to install the standalone WebAPK directly into your App Drawer.
4. On iOS (**Safari**): tap **Share → Add to Home Screen**.

---

## Adding a New Recipe (Checklist)

1. **Image:** Save the hero image under `images/<slug>.webp` (`1280px` max width, WebP quality ~80).
2. **Pages:** Create matching files from `_template.html`:
   - Persian RTL: `recipes/<slug>.html` (`#langToggle` → `../en/recipes/<slug>.html`)
   - English LTR: `en/recipes/<slug>.html` (`#langToggle` → `../../recipes/<slug>.html`)
3. **Catalog Entry:** Add one object to `RECIPES` in `assets/recipes.js` with `name`, `fa`, `desc`, `desc_en`, `page: "recipes/<slug>.html"`, `image: "images/<slug>.webp"`, and facet keys.
4. **Page Shell:** Keep `<meta name="theme-color" content="#c0c8c4">`; clone `_template.html`, not an older recipe page.
5. **Offline Cache:** Add `./recipes/<slug>.html` and `./en/recipes/<slug>.html` to `CORE_URLS`, add `./images/<slug>.webp` to `IMAGE_URLS`, and increment `CACHE_VERSION` in `sw.js` (e.g., `cookbook-v2.8.1` → `cookbook-v2.8.2`).
