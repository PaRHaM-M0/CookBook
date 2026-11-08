# PaRHaM's CookBook

A static recipe site in Persian (RTL) and English (LTR), with 38 recipes, 14 food categories, search, filters, and a Progressive Web App shell.

## Features

- A randomized recipe showcase with pause and manual controls, photo-led category browsing, searchable recipe cards, sorting, and faceted filters.
- Separate Persian and English recipe pages, with language switching that preserves recipe state.
- Light and dark themes, plus recipe-side cooking tools: ingredient and step checklists, portion scaling, and screen wake lock where supported.
- Service-worker caching for the app shell and images. Installation caches the shell and two fallback pizza images; other photos are cached when viewed, so unvisited photos may not be available offline. Cached photos are retained across app updates, subject to browser storage eviction.
- No custom install button. The browser decides whether and when to offer its native install control.

## Local preview

Serve the repository root over HTTP so the service worker can register:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. The site is static; no build step is required. Python 3 and Node.js are required for the checks. Run `python3 tools/check_site.py` to check local links, FA/EN page parity, duplicate IDs, basic directionality, JavaScript syntax, the ingredient index, offline cache paths and manifest icons. This static bidi check does not replace visual or assistive-technology testing.

## Install behavior

The Web App Manifest and service worker make the site installable where the browser and device support installation. The site does not intercept `beforeinstallprompt` or show its own install button. Chrome and other supported browsers control their native address-bar or menu affordance. On iOS, Safari uses **Share → Add to Home Screen**; a webpage cannot force that control into the address bar.

## Repository map

```text
.
├── index.html                  # Persian home page
├── en/index.html               # English home page
├── recipes/                    # Persian recipe pages + _template.html
├── en/recipes/                 # English recipe pages + _template.html
├── assets/
│   ├── app.js                  # Search, filters, themes, and recipe tools
│   ├── pwa.js                  # Service-worker registration
│   ├── home.css                # Home and photo-category layout
│   ├── recipe.css              # Shared recipe-page styling
│   ├── recipes.js              # Bilingual recipe and filter data
│   └── theme.css               # Shared design tokens and components
├── tools/                      # Ingredient index builder and static site checks
├── images/                     # Food photographs and responsive WebP derivatives
├── icons/                      # PWA and browser icons
├── manifest.json               # Standalone display mode and app icons
├── DESIGN.md                   # Design system and accessibility notes
└── sw.js                       # Offline shell and runtime image caching
```

## Deployment

This repository works from a GitHub Pages project path. Keep the site files at the repository root and enable **Settings → Pages → Deploy from a branch → main / root**. The manifest, service worker, and asset links are relative to the repository path.

## Adding a recipe

1. Create the Persian and English pages from `recipes/_template.html` and `en/recipes/_template.html`.
2. Add the bilingual record to `RECIPES` in `assets/recipes.js`.
3. Add the original image to `images/` and generate `-480.webp` and `-960.webp` derivatives for responsive use.
4. Run `python3 tools/build-ingredient-index.py` to refresh bilingual ingredient search. Add both recipe pages to `CORE_URLS`, and increment `CACHE_VERSION` in `sw.js`.
5. `time` is a broad manually assigned category, not a numeric duration; quick suggestions are alphabetical within that category. `featured` is also manually assigned (currently 29 of 38), without an established selection criterion. Do not infer either value from recipe order.
6. Keep `dir="rtl"` on Persian pages and `dir="ltr"` on English pages. Step markers use logical inline spacing so they remain clear in either direction.
