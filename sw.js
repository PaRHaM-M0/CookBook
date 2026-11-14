/* PaRHaM's CookBook! — Two-Tier Resilient Service Worker (FA + EN)
   Tier 1 (CORE_URLS): lightweight shell + all HTML/CSS/JS/icons cached atomically on install.
   Photos are cached on demand in a separate persistent cache; core install stays lightweight. */
const CACHE_VERSION = "cookbook-v2.8.25";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = "cookbook-images-v1";

const CORE_URLS = [
  "./",
  "./index.html",
  "./en/",
  "./en/index.html",
  "./manifest.json",
  "./assets/theme.css",
  "./assets/home.css",
  "./assets/chef-hat.png",
  "./assets/recipe.css",
  "./assets/recipes.js",
  "./assets/ingredients.js",
  "./assets/app.js",
  "./assets/vendor/qrcode-generator.js",
  "./assets/pwa.js",
  "./images/pizza-480.webp",
  "./images/pizza-960.webp",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-64.png",
  "./recipes/30-minute-pub-burger.html",
  "./recipes/bellyfull-chicken-alfredo.html",
  "./recipes/cheesy-potato-thing.html",
  "./recipes/cherry-cheesecakes.html",
  "./recipes/chicken-65.html",
  "./recipes/chicken-alfredo-garlic-bread.html",
  "./recipes/chicken-mushroom-alfredo.html",
  "./recipes/classic-caesar-salad.html",
  "./recipes/detroit-style-pizza.html",
  "./recipes/deviled-egg-dip.html",
  "./recipes/easy-chicken-alfredo-penne.html",
  "./recipes/fast-food-sauce-copycat-collection.html",
  "./recipes/five-cheese-baked-cavatappi.html",
  "./recipes/grand-unified-burger.html",
  "./recipes/harira.html",
  "./recipes/herb-compound-butter.html",
  "./recipes/homemade-chicken-broth.html",
  "./recipes/homemade-ricotta.html",
  "./recipes/pecorino-style-sheeps-milk.html",
  "./recipes/japanese-chicken-teriyaki.html",
  "./recipes/italian-seasoning.html",
  "./recipes/lacto-fermented-pizza-sauce.html",
  "./recipes/lemon-chicken-orzo-soup.html",
  "./recipes/linguine-gamberetti-zafferano.html",
  "./recipes/low-calorie-high-protein-double-smash-cheeseburger.html",
  "./recipes/modular-burrito-encyclopedia.html",
  "./recipes/neapolitan-pizza.html",
  "./recipes/new-york-egg-cream.html",
  "./recipes/perfect-pancakes.html",
  "./recipes/pizza-toppings.html",
  "./recipes/poolish-pizza-dough.html",
  "./recipes/popeyes-style-fried-chicken-meal.html",
  "./recipes/porchetta-bacon.html",
  "./recipes/robuchon-pomme-puree.html",
  "./recipes/sausage-cheese-pinwheels.html",
  "./recipes/scialatielli-gamberi.html",
  "./recipes/sourdough.html",
  "./recipes/stuffed-crust-pizza.html",
  "./recipes/tunakado.html",
  "./recipes/yangnyeom-chicken.html",
  "./en/recipes/30-minute-pub-burger.html",
  "./en/recipes/bellyfull-chicken-alfredo.html",
  "./en/recipes/cheesy-potato-thing.html",
  "./en/recipes/cherry-cheesecakes.html",
  "./en/recipes/chicken-65.html",
  "./en/recipes/chicken-alfredo-garlic-bread.html",
  "./en/recipes/chicken-mushroom-alfredo.html",
  "./en/recipes/classic-caesar-salad.html",
  "./en/recipes/detroit-style-pizza.html",
  "./en/recipes/deviled-egg-dip.html",
  "./en/recipes/easy-chicken-alfredo-penne.html",
  "./en/recipes/fast-food-sauce-copycat-collection.html",
  "./en/recipes/five-cheese-baked-cavatappi.html",
  "./en/recipes/grand-unified-burger.html",
  "./en/recipes/harira.html",
  "./en/recipes/herb-compound-butter.html",
  "./en/recipes/homemade-chicken-broth.html",
  "./en/recipes/homemade-ricotta.html",
  "./en/recipes/pecorino-style-sheeps-milk.html",
  "./en/recipes/japanese-chicken-teriyaki.html",
  "./en/recipes/italian-seasoning.html",
  "./en/recipes/lacto-fermented-pizza-sauce.html",
  "./en/recipes/lemon-chicken-orzo-soup.html",
  "./en/recipes/linguine-gamberetti-zafferano.html",
  "./en/recipes/low-calorie-high-protein-double-smash-cheeseburger.html",
  "./en/recipes/modular-burrito-encyclopedia.html",
  "./en/recipes/neapolitan-pizza.html",
  "./en/recipes/new-york-egg-cream.html",
  "./en/recipes/perfect-pancakes.html",
  "./en/recipes/pizza-toppings.html",
  "./en/recipes/poolish-pizza-dough.html",
  "./en/recipes/popeyes-style-fried-chicken-meal.html",
  "./en/recipes/porchetta-bacon.html",
  "./en/recipes/robuchon-pomme-puree.html",
  "./en/recipes/sausage-cheese-pinwheels.html",
  "./en/recipes/scialatielli-gamberi.html",
  "./en/recipes/sourdough.html",
  "./en/recipes/stuffed-crust-pizza.html",
  "./en/recipes/tunakado.html",
  "./en/recipes/yangnyeom-chicken.html",

];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(CORE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const obsolete = keys.filter((key) => key.startsWith("cookbook-") && key !== IMAGE_CACHE && !key.startsWith(CACHE_VERSION));
    // Preserve photos downloaded by older app versions without re-downloading.
    const images = await caches.open(IMAGE_CACHE);
    for (const key of obsolete) {
      const previous = await caches.open(key);
      for (const request of await previous.keys()) {
        const url = new URL(request.url);
        const imageRoot = new URL('./images/', self.registration.scope).pathname;
        if (url.origin !== self.location.origin || !url.pathname.startsWith(imageRoot)) continue;
        try {
          if (!await images.match(request, {ignoreSearch:true})) {
            const response = await previous.match(request);
            if (response) await images.put(request, response);
          }
        } catch (_) { /* storage may be full; activation must still complete */ }
      }
    }
    await Promise.all(obsolete.map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true }) ||
    (cacheName === IMAGE_CACHE ? await (await caches.open(STATIC_CACHE)).match(request, { ignoreSearch: true }) : null);
  const network = fetch(request).then(async (response) => {
    if (response && (response.status === 200 || response.type === "opaque")) {
      try { await cache.put(request, response.clone()); } catch (_) { /* cache is optional */ }
    }
    return response;
  }).catch(() => null);
  // A cached response returns immediately, but the refresh must outlive fetch.
  if (cached) { event.waitUntil(network); return cached; }
  return (await network) || Response.error();
}

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      try { await cache.put(request, response.clone()); } catch (_) { /* keep the network response if storage is full */ }
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const fallback = request.url.includes("/en/") ? "./en/index.html" : "./index.html";
    const home = await cache.match(fallback, { ignoreSearch: true });
    if (home) return home;
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, request.destination === "image" ? IMAGE_CACHE : STATIC_CACHE, event));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, event));
  }
});
