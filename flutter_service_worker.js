'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "d9e9c094320a2e0bc056b2c2098593a9",
"splash/img/light-2x.png": "1494fd4c54c6d29cdeca38c3b5bb49b2",
"splash/img/dark-4x.png": "2321dad45ecf940a91788dc5d0ec1a23",
"splash/img/light-3x.png": "fd67a2f4e84b7dac63b18d2f17296869",
"splash/img/dark-3x.png": "fd67a2f4e84b7dac63b18d2f17296869",
"splash/img/light-4x.png": "2321dad45ecf940a91788dc5d0ec1a23",
"splash/img/dark-2x.png": "1494fd4c54c6d29cdeca38c3b5bb49b2",
"splash/img/dark-1x.png": "bbda3077a3b0d07dfb8b8ce50d8d4800",
"splash/img/light-1x.png": "bbda3077a3b0d07dfb8b8ce50d8d4800",
"index.html": "1614ecb23caab6b179421ffbdb18ed9a",
"/": "1614ecb23caab6b179421ffbdb18ed9a",
"main.dart.js": "72115b841c7d9530b00f7546bd03ab51",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "0639bd6bac67a5575f5abb939f118518",
"icons/Icon-192.png": "a8f8d438f11fc4898a8f95d2df839ac6",
"icons/Icon-maskable-192.png": "a8f8d438f11fc4898a8f95d2df839ac6",
"icons/Icon-maskable-512.png": "8a38715bf6de6a7f4fff574903191e3b",
"icons/Icon-512.png": "8a38715bf6de6a7f4fff574903191e3b",
"manifest.json": "d365623c46fe59f9c5b8c4e946dab537",
"assets/AssetManifest.json": "4954a8cf4ca3c25974c923eb79172ba0",
"assets/NOTICES": "ad7526a916b7bf1f649105a78d85eb40",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/AssetManifest.bin.json": "627ba53aeaf3af4f7e9221e53f4b147c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "7bc443ac77834c5e3087756940b3a967",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "b953251df2fac80ce83e7b6f5cd2e0b5",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "98184cb991927e2c9d692d498e68be0a",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "f25e8e701660fb45e2a81ff3f43c6d5c",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "60b8994dae6bd146d0e15a94a8b2f5c1",
"assets/fonts/MaterialIcons-Regular.otf": "32fce58e2acb9c420eab0fe7b828b761",
"assets/assets/products/ps_1000.png": "266d6b042e9a38d16d98c04044ee73e7",
"assets/assets/products/precilift.png": "9d3c5224a0e6a97fc9ae76eeaefdf41c",
"assets/assets/products/alltrack.png": "b5d985036a9b354d17bd11eba09d8b35",
"assets/assets/products/ast.png": "951ff3fce5f14a678c59720cd0a4bff4",
"assets/assets/logos/logo_short.png": "b59cdf205f9f82d7c27c0abee964c7c5",
"assets/assets/logos/logo_long_no_bg.png": "e2a9b22666c44479d8f577da40c6c72a",
"assets/assets/logos/logo_long.jpg": "8d838072cb6e18d7191d00a9ca9b85a4",
"assets/assets/bg/greenhouse.jpg": "a6ef85dcb012a714e89130d040802da9",
"assets/assets/bg/change_password.jpg": "5d5c1d4b5bc6b755726dcf9de0f04e37",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
