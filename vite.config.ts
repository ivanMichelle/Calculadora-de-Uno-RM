import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Plugin that generates sw.js at build time with:
 * - A unique CACHE_NAME based on build timestamp
 * - The list of all built assets to pre-cache
 */
function generateServiceWorker(): Plugin {
  return {
    name: 'generate-sw',
    writeBundle(options, bundle) {
      const outDir = options.dir || 'dist';
      const timestamp = Date.now().toString(36);
      const basePath = '/Calculadora-de-Uno-RM/';

      // Collect all emitted files for pre-caching
      const filesToCache = Object.keys(bundle)
        .filter(f => !f.endsWith('.map'))
        .map(f => basePath + f);

      // Always include the root and icons
      const staticAssets = [
        basePath,
        basePath + 'index.html',
        basePath + 'icons/icon-192x192.png',
        basePath + 'icons/icon-512x512.png',
        basePath + 'icons/apple-touch-icon.png',
      ];

      const allAssets = [...new Set([...staticAssets, ...filesToCache])];

      const swContent = `// Auto-generated Service Worker — do not edit manually
const CACHE_NAME = 'liftcalc-${timestamp}';
const BASE_PATH = '${basePath}';
const ASSETS_TO_CACHE = ${JSON.stringify(allAssets, null, 2)};

// Install: pre-cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      )
    )
  );
  return self.clients.claim();
});

// Fetch: network-first for navigation, cache-first for assets
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(BASE_PATH + 'index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (!response || response.status !== 200 ||
            (response.type !== 'basic' && response.type !== 'cors')) {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});
`;

      fs.writeFileSync(path.join(outDir, 'sw.js'), swContent);
      console.log(`  ✓ Generated sw.js with cache: liftcalc-${timestamp} (${allAssets.length} assets)`);
    }
  };
}

export default defineConfig({
  base: '/Calculadora-de-Uno-RM/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss(), generateServiceWorker()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  publicDir: 'public',
});
