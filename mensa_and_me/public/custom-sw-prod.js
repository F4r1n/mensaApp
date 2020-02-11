self.addEventListener("push", event => {
  const data = event.data.json();
  console.log("New notification", data);
  const options = {
    body: data.body,
    icon: "./logo_2_192.png"
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function(event) {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow("https://mensa-app-16754.web.app/"));
});

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

workbox.routing.registerRoute(
  new RegExp("\\.png$"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp("\\.svg$"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp("\\.css$"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp("\\.js$"),
  new workbox.strategies.CacheFirst()
);

const files = [
        "./../build/logo_2.ico",
        "./../build/logo_2_192.png",
        "./../build/logo_2_512.png",
        "./../build/static/css/main.34de6062.chunk.css",
        "./../build/static/js/2.59c1777c.chunk.js",
        "./../build/static/js/main.b71b126c.chunk.js",
        "./../build/static/js/runtime-main.154702a8.js",
        "./../build/static/media/logo_2.027b1df8.svg"
]

var CACHE_NAME = "my-pwa-cache-v1";
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Open a cache and cache our files
      return cache.addAll(files);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});