const IMAGE_CACHE = "image-cache-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== IMAGE_CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

const IMAGE_EXT_RE = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (request.headers.has("range")) return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isImage = request.destination === "image" || IMAGE_EXT_RE.test(url.pathname);

  if (!sameOrigin || !isImage) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(request);

      const networkFetch = fetch(request)
        .then((response) => {
          // Cache API does not support partial (206) responses.
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      if (cached) {
        networkFetch.catch(() => {});
        return cached;
      }

      const fresh = await networkFetch;
      return fresh || Response.error();
    })()
  );
});
