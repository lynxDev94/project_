const CACHE_NAME = "shadow-journal-v9";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/images/brandLogo.png",
];

const STATIC_DESTINATIONS = new Set(["script", "style", "image", "font"]);

function isStaticAssetRequest(request, url) {
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (APP_SHELL.includes(url.pathname)) return true;
  return STATIC_DESTINATIONS.has(request.destination);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Never cache app/document requests; stale cached HTML can trap users in
  // old auth/redirect states (e.g. bouncing dashboard subpages to /dashboard).
  if (!isSameOrigin || event.request.mode === "navigate" || url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first only for static assets.
  if (!isStaticAssetRequest(event.request, url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const copy = response.clone();
        void caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, copy));
        return response;
      });
    }),
  );
});
