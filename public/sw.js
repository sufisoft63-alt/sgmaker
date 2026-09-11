// SG Maker Unified Dual Edition Service Worker (Public & Admin)
const CACHE_NAME = 'sg-maker-dual-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest-public.json',
  '/manifest-admin.json',
  '/icon-192.png',
  '/icon-512.png',
  '/admin-icon-192.png',
  '/admin-icon-512.png',
  '/apple-touch-icon.png',
  '/icon.svg',
  '/admin-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Serve manifests dynamically or from cache
  if (url.pathname === '/manifest.json' || url.pathname === '/manifest-public.json' || url.pathname === '/manifest-admin.json') {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((networkResponse) => {
            return networkResponse;
          })
          .catch(() => {
            if (event.request.destination === 'document' || event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          })
      );
    })
  );
});
