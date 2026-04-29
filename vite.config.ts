import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Plugin to inject build timestamp into service worker for cache busting
function swCacheVersion() {
  return {
    name: 'sw-cache-version',
    generateBundle(_: unknown, bundle: Record<string, { fileName: string; type: string; source?: string }>) {
      for (const file of Object.values(bundle)) {
        if (file.fileName === 'sw.js' && file.type === 'asset') {
          const timestamp = Date.now().toString(36);
          file.source = (file.source as string).replace(
            'olympic-lift-calculator-v1',
            `olympic-lift-calculator-${timestamp}`
          );
        }
      }
    }
  };
}

export default defineConfig({
  base: '/Calculadora-de-Uno-RM/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss(), swCacheVersion()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  publicDir: 'public',
});
