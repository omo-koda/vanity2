/**
 * CloakSeed Service Worker
 * Cache-first for app shell, network-first for RPC calls.
 * All crypto operations run offline after first load.
 */

const CACHE_NAME = 'cloakseed-v2'

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
]

// RPC domains — never cache these
const RPC_DOMAINS = [
  'cloudflare-eth.com',
  'rpc.ankr.com',
  'eth.llamarpc.com',
  'api.mainnet-beta.solana.com',
  'solana-mainnet.rpc.extrnode.com',
  'blockstream.info',
  'mempool.space',
  'fullnode.mainnet.sui.io',
  'sui-mainnet.nodeinfra.com',
  'cosmos-rest.publicnode.com',
  'rest.cosmos.directory',
  'fullnode.mainnet.aptoslabs.com',
  'aptos-mainnet.pontem.network',
]

function isRpcRequest(url) {
  return RPC_DOMAINS.some(domain => url.hostname.includes(domain))
}

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: cache-first for assets, network-only for RPC
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Never cache RPC calls
  if (isRpcRequest(url)) return

  // Cache-first for same-origin GET requests
  if (event.request.method === 'GET' && url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          // Cache successful responses (JS, CSS, HTML, images)
          if (response.ok && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
      })
    )
  }
})
