const CACHE_NAME = 'sea-tree-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './translations.js',
    './offline.html',
    './favicon.svg',
    './ical.min.js'
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
    // Skip cross-origin requests like Google Maps/Fonts for now to keep it simple, 
    // or handle them with Stale-While-Revalidate if advanced.
    // For this simple version: use Stale-While-Revalidate for local assets.

    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    // Optional: Update cache in background (stale-while-revalidate behavior)
                    // fetch(event.request).then(networkResponse => {
                    //   caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
                    // });
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // If network fails (offline) and not in cache, show offline page for HTML requests
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
