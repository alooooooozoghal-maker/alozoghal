// Service Worker for الو ذغال PWA
const CACHE_NAME = 'aloozoghal-v1.1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/admin-panel.html',
  '/ads-simple.js',
  '/ads-data.json',
  '/manifest.json',
  'https://raw.githubusercontent.com/aloozoghal-hash/alozoghal/main/8f6dcedf3dc3dbaa82c0df548bd962c9.jpg',
  'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css'
];

// نصب Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// درخواست‌های شبکه
self.addEventListener('fetch', event => {
  // برای درخواست‌های API، از شبکه استفاده کن
  if (event.request.url.includes('api.telegram.org')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر در کش موجود بود، برگردان
        if (response) {
          return response;
        }
        
        // در غیر این صورت از شبکه بگیر
        return fetch(event.request).then(response => {
          // فقط پاسخ‌های موفق را کش کن
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      }).catch(() => {
        // اگر آفلاین هستیم و فایل‌های ضروری را نداریم
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
