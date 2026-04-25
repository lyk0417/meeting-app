// service-worker.js — basic offline cache for the meeting app PWA.
// Strategy: cache-first for own assets, network for everything else (Google Fonts, unpkg).
const CACHE = 'meeting-app-v4';
const ASSETS = [
  './mobile.html',
  './manifest.json',
  './tokens.jsx',
  './data.jsx',
  './screens-auth.jsx',
  './screens-employee.jsx',
  './screens-admin.jsx',
  './app.jsx',
  './android-frame.jsx',
  './tweaks-panel.jsx',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Only cache same-origin GET requests
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        // Stash a copy
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});
