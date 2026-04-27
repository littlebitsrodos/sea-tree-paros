const CACHE_NAME = 'sea-tree-v10';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './translations.js',
    './offline.html',
    './favicon.svg'
];

// Install Event - Cache Core Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Claim clients immediately so the user doesn't need to refresh to see the effect
    self.clients.claim();
});

// Fetch Event - Network First, then Cache, then Offline Page
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // bookings.json is freshness-critical — cache-first would hide a
    // new Airbnb/Booking.com block for up to a full SW lifetime. Go
    // network-first and only fall back to cache when offline.
    if (url.origin === self.location.origin && url.pathname.endsWith('/bookings.json')) {
        event.respondWith(
            fetch(event.request).then((networkResponse) => {
                const copy = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return networkResponse;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./offline.html');
                    }
                });
            })
        );
    } else {
        // For external resources (fonts, maps), just fetch normally.
        event.respondWith(fetch(event.request));
    }
});
