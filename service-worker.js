// service-worker.js
const CACHE_NAME = 'aloozoghal-v3';
const urlsToCache = [
  './',
  './index.html',
  './admin-panel.html',
  './ads-simple.js',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css'
];

// نصب Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// پاسخ به درخواست‌ها
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر فایل در کش موجود بود، از کش برگردان
        if (response) {
          return response;
        }
        
        // در غیر این صورت از شبکه بگیر
        return fetch(event.request).then(response => {
          // اگر پاسخ معتبر نیست، برگردان
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // پاسخ را در کش ذخیره کن
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// حذف کش‌های قدیمی
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
