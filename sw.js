self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("pwa-cache").then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/script.js",
        "/icon.png",
        "/firebase-config.js",
        "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js",
        "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"
      ])
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
}); 