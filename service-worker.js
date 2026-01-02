const CACHE_NAME = 'aloozoghal-v1';
const urlsToCache = [
  '/alozoghal/',
  '/alozoghal/index.html',
  '/alozoghal/admin-panel.html',
  '/alozoghal/ads-simple.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
