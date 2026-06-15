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
        injectRegister: 'auto',
        includeAssets: ['logo-app.svg', 'logo-app-monochrome.svg', 'icon-192.png', 'icon-512.png', 'screenshot-desktop.png', 'screenshot-mobile.png'],
        manifest: {
          id: '/',
          name: 'Jornada',
          short_name: 'Jornada',
          description: 'Acompanhe sua jornada com facilidade',
          theme_color: '#1c1b1f',
          background_color: '#1c1b1f',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/logo-app-monochrome.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'monochrome',
            }
          ],
          screenshots: [
            {
              src: '/screenshot-desktop.png',
              sizes: '1920x1080',
              type: 'image/png',
              form_factor: 'wide',
            },
            {
              src: '/screenshot-mobile.png',
              sizes: '1080x1920',
              type: 'image/png',
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000,
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
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
