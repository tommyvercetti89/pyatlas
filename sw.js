/* PyAtlas Service Worker: Full Offline PWA Support */
const CACHE_NAME = 'pyatlas-v1.5.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/fonts.css',
  './js/core.js',
  './js/strings.js',
  './js/manifest.js',
  './js/paths.js',
  './js/app.js',
  './icons/icon.svg',
  './icons/icon-512.png',
  './icons/icon-192.png',
  './icons/apple-touch-icon.png',
  './icons/icon-64.png',
  './icons/favicon.png',
  './icons/icon-maskable-512.png',
  './icons/icon-maskable-192.png',
  './fonts/inter-latin-wght-normal.woff2',
  './fonts/inter-latin-ext-wght-normal.woff2',
  './fonts/space-grotesk-latin-wght-normal.woff2',
  './fonts/space-grotesk-latin-ext-wght-normal.woff2',
  './fonts/jetbrains-mono-latin-wght-normal.woff2',
  './fonts/jetbrains-mono-latin-ext-wght-normal.woff2',
  // All 34 interactive Python & Cybersecurity libraries:
  './data/libs/builtins.js',
  './data/libs/sys.js',
  './data/libs/os.js',
  './data/libs/pathlib.js',
  './data/libs/shutil.js',
  './data/libs/re.js',
  './data/libs/json.js',
  './data/libs/csv.js',
  './data/libs/sqlite3.js',
  './data/libs/datetime.js',
  './data/libs/time.js',
  './data/libs/collections.js',
  './data/libs/itertools.js',
  './data/libs/random.js',
  './data/libs/secrets.js',
  './data/libs/argparse.js',
  './data/libs/logging.js',
  './data/libs/socket.js',
  './data/libs/ipaddress.js',
  './data/libs/struct.js',
  './data/libs/ssl.js',
  './data/libs/urllib.js',
  './data/libs/http.server.js',
  './data/libs/requests.js',
  './data/libs/scapy.js',
  './data/libs/paramiko.js',
  './data/libs/hashlib.js',
  './data/libs/hmac.js',
  './data/libs/base64.js',
  './data/libs/binascii.js',
  './data/libs/cryptography.js',
  './data/libs/subprocess.js',
  './data/libs/threading.js',
  './data/libs/concurrent.futures.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Stale-while-revalidate for local assets, cache-first for fonts
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, return cached response if available
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
