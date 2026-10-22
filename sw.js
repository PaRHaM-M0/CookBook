/* CookBook Bilingual Service Worker (FA + EN)
   Bump CACHE_VERSION whenever a release should replace cached files. */
const CACHE_VERSION = "cookbook-v2.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./en/",
  "./en/index.html",
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
  "./icons/favicon-64.png",
  "./recipes/30-minute-pub-burger.html",
  "./recipes/bellyfull-chicken-alfredo.html",
  "./recipes/cheesy-potato-thing.html",
  "./recipes/cherry-cheesecakes.html",
  "./recipes/chicken-65.html",
  "./recipes/chicken-alfredo-garlic-bread.html",
  "./recipes/chicken-mushroom-alfredo.html",
  "./recipes/detroit-style-pizza.html",
  "./recipes/deviled-egg-dip.html",
  "./recipes/easy-chicken-alfredo-penne.html",
  "./recipes/grand-unified-burger.html",
  "./recipes/harira.html",
  "./recipes/herb-compound-butter.html",
  "./recipes/homemade-chicken-broth.html",
  "./recipes/homemade-ricotta.html",
  "./recipes/italian-seasoning.html",
  "./recipes/lacto-fermented-pizza-sauce.html",
  "./recipes/lemon-chicken-orzo-soup.html",
  "./recipes/linguine-gamberetti-zafferano.html",
  "./recipes/modular-burrito-encyclopedia.html",
  "./recipes/neapolitan-pizza.html",
  "./recipes/new-york-egg-cream.html",
  "./recipes/pizza-toppings.html",
  "./recipes/poolish-pizza-dough.html",
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
  "./en/recipes/detroit-style-pizza.html",
  "./en/recipes/deviled-egg-dip.html",
  "./en/recipes/easy-chicken-alfredo-penne.html",
  "./en/recipes/grand-unified-burger.html",
  "./en/recipes/harira.html",
  "./en/recipes/herb-compound-butter.html",
  "./en/recipes/homemade-chicken-broth.html",
  "./en/recipes/homemade-ricotta.html",
  "./en/recipes/italian-seasoning.html",
  "./en/recipes/lacto-fermented-pizza-sauce.html",
  "./en/recipes/lemon-chicken-orzo-soup.html",
  "./en/recipes/linguine-gamberetti-zafferano.html",
  "./en/recipes/modular-burrito-encyclopedia.html",
  "./en/recipes/neapolitan-pizza.html",
  "./en/recipes/new-york-egg-cream.html",
  "./en/recipes/pizza-toppings.html",
  "./en/recipes/poolish-pizza-dough.html",
  "./en/recipes/porchetta-bacon.html",
  "./en/recipes/robuchon-pomme-puree.html",
  "./en/recipes/sausage-cheese-pinwheels.html",
  "./en/recipes/scialatielli-gamberi.html",
  "./en/recipes/sourdough.html",
  "./en/recipes/stuffed-crust-pizza.html",
  "./en/recipes/tunakado.html",
  "./en/recipes/yangnyeom-chicken.html",
  "./images/30-minute-pub-burger.jpg",
  "./images/bellyfull-chicken-alfredo.jpg",
  "./images/cheesy-potato-thing.jpg",
  "./images/cherry-cheesecakes.jpg",
  "./images/chicken-65.jpg",
  "./images/chicken-alfredo-garlic-bread.jpg",
  "./images/chicken-mushroom-alfredo.jpg",
  "./images/detroit-style-pizza.jpg",
  "./images/deviled-egg-dip.jpg",
  "./images/easy-chicken-alfredo-penne.jpg",
  "./images/grand-unified-burger.jpg",
  "./images/harira.jpg",
  "./images/herb-compound-butter.jpg",
  "./images/homemade-chicken-broth.jpg",
  "./images/homemade-ricotta.jpg",
  "./images/italian-seasoning.jpg",
  "./images/juicy-steakhouse-burger.jpg",
  "./images/lacto-fermented-pizza-sauce.jpg",
  "./images/lemon-chicken-orzo-soup.jpg",
  "./images/linguine-gamberetti-zafferano.jpg",
  "./images/modular-burrito-encyclopedia.jpg",
  "./images/new-york-egg-cream.jpg",
  "./images/pizza-toppings.jpg",
  "./images/pizza.jpg",
  "./images/poolish-pizza-dough.jpg",
  "./images/porchetta-bacon.jpg",
  "./images/robuchon-pomme-puree.jpg",
  "./images/sausage-cheese-pinwheels.jpg",
  "./images/scialatielli-gamberi.jpg",
  "./images/sourdough.jpg",
  "./images/stuffed-crust-pizza.jpg",
  "./images/toppings/burrata.jpg",
  "./images/toppings/fontina.jpg",
  "./images/toppings/gorgonzola.jpg",
  "./images/toppings/guanciale.jpg",
  "./images/toppings/mortadella.jpg",
  "./images/toppings/mozzarella-pecorino.jpg",
  "./images/toppings/nduja.jpg",
  "./images/toppings/porchetta-bacon.jpg",
  "./images/toppings/prosciutto.jpg",
  "./images/toppings/smoked-scamorza.jpg",
  "./images/toppings/soppressata.jpg",
  "./images/toppings/speck.jpg",
  "./images/toppings/taleggio.jpg",
  "./images/toppings/turkey-bacon.jpg",
  "./images/toppings/whipped-lemon-ricotta.jpg",
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
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  }
});
