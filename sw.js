/* CookBook Service Worker
   Full offline precache + automatic updates.
   Bump CACHE_VERSION whenever a release should replace cached files. */
const CACHE_VERSION = "cookbook-v12";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/theme.css",
  "./assets/home.css",
  "./assets/recipe.css",
  "./assets/recipes.js",
  "./assets/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./recipes/bellyfull-chicken-alfredo.html",
  "./recipes/cheesy-potato-thing.html",
  "./recipes/cherry-cheesecakes.html",
  "./recipes/chicken-65.html",
  "./recipes/chicken-alfredo-garlic-bread.html",
  "./recipes/chicken-mushroom-alfredo.html",
  "./recipes/detroit-style-pizza.html",
  "./recipes/deviled-egg-dip.html",
  "./recipes/easy-chicken-alfredo-penne.html",
  "./recipes/harira.html",
  "./recipes/herb-compound-butter.html",
  "./recipes/homemade-ricotta.html",
  "./recipes/italian-seasoning.html",
  "./recipes/lacto-fermented-pizza-sauce.html",
  "./recipes/linguine-gamberetti-zafferano.html",
  "./recipes/neapolitan-pizza.html",
  "./recipes/new-york-egg-cream.html",
  "./recipes/porchetta-bacon.html",
  "./recipes/robuchon-pomme-puree.html",
  "./recipes/sausage-cheese-pinwheels.html",
  "./recipes/scialatielli-gamberi.html",
  "./recipes/sourdough.html",
  "./recipes/stuffed-crust-pizza.html",
  "./recipes/tunakado.html",
  "./recipes/yangnyeom-chicken.html",
  "./images/bellyfull-chicken-alfredo.jpg",
  "./images/cheesy-potato-thing.jpg",
  "./images/cherry-cheesecakes.jpg",
  "./images/chicken-65.jpg",
  "./images/chicken-alfredo-garlic-bread.jpg",
  "./images/chicken-mushroom-alfredo.jpg",
  "./images/detroit-style-pizza.jpg",
  "./images/deviled-egg-dip.jpg",
  "./images/easy-chicken-alfredo-penne.jpg",
  "./images/harira.jpg",
  "./images/herb-compound-butter.jpg",
  "./images/homemade-ricotta.jpg",
  "./images/italian-seasoning.jpg",
  "./images/lacto-fermented-pizza-sauce.jpg",
  "./images/linguine-gamberetti-zafferano.jpg",
  "./images/new-york-egg-cream.jpg",
  "./images/pizza.jpg",
  "./images/porchetta-bacon.jpg",
  "./images/robuchon-pomme-puree.jpg",
  "./images/sausage-cheese-pinwheels.jpg",
  "./images/scialatielli-gamberi.jpg",
  "./images/sourdough.jpg",
  "./images/stuffed-crust-pizza.jpg",
  "./images/tunakado.jpg",
  "./images/yangnyeom-chicken.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  const network = fetch(request).then((response) => {
    if (response && (response.status === 200 || response.type === "opaque")) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const home = await cache.match("./index.html", { ignoreSearch: true });
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
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  }
});
