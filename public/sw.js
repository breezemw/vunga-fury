const CACHE_NAME = 'vunga-fury-shell-v1'
const CACHEABLE_DESTINATIONS = new Set(['document', 'image', 'script', 'style', 'worker'])
const MAX_CACHEABLE_BYTES = 1024 * 1024

const appShellUrl = new URL('./index.html', self.location).toString()

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([appShellUrl, new URL('./manifest.webmanifest', self.location).toString()]),
      ),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

function isCacheable(request, response) {
  if (request.method !== 'GET' || !CACHEABLE_DESTINATIONS.has(request.destination)) return false
  const url = new URL(request.url)
  if (
    url.origin !== self.location.origin ||
    url.pathname.endsWith('.wasm') ||
    request.destination === 'video'
  )
    return false
  const size = Number(response.headers.get('content-length'))
  return response.ok && (!Number.isFinite(size) || size <= MAX_CACHEABLE_BYTES)
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  event.respondWith(
    fetch(request)
      .then(async (response) => {
        if (isCacheable(request, response)) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(request, response.clone())
        }
        return response
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request)
        if (cachedResponse) return cachedResponse
        if (request.mode === 'navigate') return caches.match(appShellUrl)
        return Response.error()
      }),
  )
})
