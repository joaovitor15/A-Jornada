import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['logo-app.svg', 'logo-app-monochrome.svg', 'icon-192-monochrome.png', 'icon-512-monochrome.png'],
        manifest: {
          name: 'Jornada',
          short_name: 'Jornada',
          description: 'Acompanhe sua jornada com facilidade',
          theme_color: '#1c1b1f',
          background_color: '#1c1b1f',
          display: 'standalone',
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icon-192-monochrome.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'monochrome',
            },
            {
              src: 'icon-512-monochrome.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'monochrome',
            },
            {
              src: 'logo-app.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
            {
              src: 'logo-app-monochrome.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'monochrome',
            }
          ]
        },
        devOptions: {
          enabled: true
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 4000000,
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
