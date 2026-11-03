/* PaRHaM's CookBook! — Two-Tier Resilient Service Worker (FA + EN)
   Tier 1 (CORE_URLS): lightweight shell + all HTML/CSS/JS/icons cached atomically on install.
   Tier 2 (IMAGE_URLS): WebP photos warmed with bounded concurrency; failures do not abort install. */
const CACHE_VERSION = "cookbook-v2.8.17";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

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
  "./recipes/grand-unified-burger.html",
  "./recipes/harira.html",
  "./recipes/herb-compound-butter.html",
  "./recipes/homemade-chicken-broth.html",
  "./recipes/homemade-ricotta.html",
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
  "./en/recipes/grand-unified-burger.html",
  "./en/recipes/harira.html",
  "./en/recipes/herb-compound-butter.html",
  "./en/recipes/homemade-chicken-broth.html",
  "./en/recipes/homemade-ricotta.html",
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

const IMAGE_URLS = [
  "./images/30-minute-pub-burger-480.webp",
  "./images/bellyfull-chicken-alfredo-480.webp",
  "./images/cheesy-potato-thing-480.webp",
  "./images/cherry-cheesecakes-480.webp",
  "./images/chicken-65-480.webp",
  "./images/chicken-alfredo-garlic-bread-480.webp",
  "./images/chicken-mushroom-alfredo-480.webp",
  "./images/classic-caesar-salad-480.webp",
  "./images/detroit-style-pizza-480.webp",
  "./images/deviled-egg-dip-480.webp",
  "./images/easy-chicken-alfredo-penne-480.webp",
  "./images/fast-food-sauce-copycat-collection-480.webp",
  "./images/grand-unified-burger-480.webp",
  "./images/harira-480.webp",
  "./images/herb-compound-butter-480.webp",
  "./images/homemade-chicken-broth-480.webp",
  "./images/homemade-ricotta-480.webp",
  "./images/italian-seasoning-480.webp",
  "./images/juicy-steakhouse-burger-480.webp",
  "./images/lacto-fermented-pizza-sauce-480.webp",
  "./images/lemon-chicken-orzo-soup-480.webp",
  "./images/linguine-gamberetti-zafferano-480.webp",
  "./images/low-calorie-high-protein-double-smash-cheeseburger-480.webp",
  "./images/modular-burrito-encyclopedia-480.webp",
  "./images/new-york-egg-cream-480.webp",
  "./images/perfect-pancakes-480.webp",
  "./images/pizza-480.webp",
  "./images/pizza-toppings-480.webp",
  "./images/poolish-pizza-dough-480.webp",
  "./images/popeyes-style-fried-chicken-meal-480.webp",
  "./images/porchetta-bacon-480.webp",
  "./images/robuchon-pomme-puree-480.webp",
  "./images/sausage-cheese-pinwheels-480.webp",
  "./images/scialatielli-gamberi-480.webp",
  "./images/sourdough-480.webp",
  "./images/stuffed-crust-pizza-480.webp",
  "./images/tunakado-480.webp",
  "./images/yangnyeom-chicken-480.webp",
  "./images/30-minute-pub-burger-960.webp",
  "./images/bellyfull-chicken-alfredo-960.webp",
  "./images/cheesy-potato-thing-960.webp",
  "./images/cherry-cheesecakes-960.webp",
  "./images/chicken-65-960.webp",
  "./images/chicken-alfredo-garlic-bread-960.webp",
  "./images/chicken-mushroom-alfredo-960.webp",
  "./images/classic-caesar-salad-960.webp",
  "./images/detroit-style-pizza-960.webp",
  "./images/deviled-egg-dip-960.webp",
  "./images/easy-chicken-alfredo-penne-960.webp",
  "./images/fast-food-sauce-copycat-collection-960.webp",
  "./images/grand-unified-burger-960.webp",
  "./images/harira-960.webp",
  "./images/herb-compound-butter-960.webp",
  "./images/homemade-chicken-broth-960.webp",
  "./images/homemade-ricotta-960.webp",
  "./images/italian-seasoning-960.webp",
  "./images/juicy-steakhouse-burger-960.webp",
  "./images/lacto-fermented-pizza-sauce-960.webp",
  "./images/lemon-chicken-orzo-soup-960.webp",
  "./images/linguine-gamberetti-zafferano-960.webp",
  "./images/low-calorie-high-protein-double-smash-cheeseburger-960.webp",
  "./images/modular-burrito-encyclopedia-960.webp",
  "./images/new-york-egg-cream-960.webp",
  "./images/perfect-pancakes-960.webp",
  "./images/pizza-960.webp",
  "./images/pizza-toppings-960.webp",
  "./images/poolish-pizza-dough-960.webp",
  "./images/popeyes-style-fried-chicken-meal-960.webp",
  "./images/porchetta-bacon-960.webp",
  "./images/robuchon-pomme-puree-960.webp",
  "./images/sausage-cheese-pinwheels-960.webp",
  "./images/scialatielli-gamberi-960.webp",
  "./images/sourdough-960.webp",
  "./images/stuffed-crust-pizza-960.webp",
  "./images/tunakado-960.webp",
  "./images/yangnyeom-chicken-960.webp",

  "./images/30-minute-pub-burger.webp",
  "./images/bellyfull-chicken-alfredo.webp",
  "./images/cheesy-potato-thing.webp",
  "./images/cherry-cheesecakes.webp",
  "./images/chicken-65.webp",
  "./images/chicken-alfredo-garlic-bread.webp",
  "./images/chicken-mushroom-alfredo.webp",
  "./images/classic-caesar-salad.webp",
  "./images/detroit-style-pizza.webp",
  "./images/deviled-egg-dip.webp",
  "./images/easy-chicken-alfredo-penne.webp",
  "./images/fast-food-sauce-copycat-collection.webp",
  "./images/grand-unified-burger.webp",
  "./images/harira.webp",
  "./images/herb-compound-butter.webp",
  "./images/homemade-chicken-broth.webp",
  "./images/homemade-ricotta.webp",
  "./images/italian-seasoning.webp",
  "./images/juicy-steakhouse-burger.webp",
  "./images/lacto-fermented-pizza-sauce.webp",
  "./images/lemon-chicken-orzo-soup.webp",
  "./images/linguine-gamberetti-zafferano.webp",
  "./images/low-calorie-high-protein-double-smash-cheeseburger.webp",
  "./images/modular-burrito-encyclopedia.webp",
  "./images/new-york-egg-cream.webp",
  "./images/perfect-pancakes.webp",
  "./images/pizza-toppings.webp",
  "./images/pizza.webp",
  "./images/poolish-pizza-dough.webp",
  "./images/popeyes-style-fried-chicken-meal.webp",
  "./images/porchetta-bacon.webp",
  "./images/robuchon-pomme-puree.webp",
  "./images/sausage-cheese-pinwheels.webp",
  "./images/scialatielli-gamberi.webp",
  "./images/sourdough.webp",
  "./images/stuffed-crust-pizza.webp",
  "./images/toppings/burrata.webp",
  "./images/toppings/fontina.webp",
  "./images/toppings/gorgonzola.webp",
  "./images/toppings/guanciale.webp",
  "./images/toppings/mortadella.webp",
  "./images/toppings/mozzarella-pecorino.webp",
  "./images/toppings/nduja.webp",
  "./images/toppings/porchetta-bacon.webp",
  "./images/toppings/prosciutto.webp",
  "./images/toppings/smoked-scamorza.webp",
  "./images/toppings/soppressata.webp",
  "./images/toppings/speck.webp",
  "./images/toppings/taleggio.webp",
  "./images/toppings/turkey-bacon.webp",
  "./images/toppings/whipped-lemon-ricotta.webp",
  "./images/tunakado.webp",
  "./images/yangnyeom-chicken.webp",

];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(CORE_URLS);
    // Keep the install event alive until warming finishes. Individual image
    // failures remain non-fatal and can be cached on a later online visit.
    let next = 0;
    await Promise.all(Array.from({length: 6}, async () => {
      while (next < IMAGE_URLS.length) {
        const url = IMAGE_URLS[next++];
        try { await cache.add(url); } catch (_) { /* optional photo */ }
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("cookbook-") && !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
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
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE, event));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, event));
  }
});
