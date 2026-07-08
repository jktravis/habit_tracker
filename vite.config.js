import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// On GitHub Pages a project site is served from https://<user>.github.io/<repo>/,
// so the build needs base='/<repo>/'. The deploy workflow sets BASE_PATH; local
// dev/build falls back to '/'.
const base = process.env.BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Habits — Habit Tracker',
        short_name: 'Habits',
        description: 'Track your habits with a GitHub-style activity grid. Works offline, no account needed.',
        theme_color: '#16171d',
        background_color: '#16171d',
        display: 'standalone',
        orientation: 'portrait',
        // Relative so the manifest works whether served from '/' or '/<repo>/'.
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
