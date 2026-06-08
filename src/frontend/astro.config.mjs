// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Captured once at config-load (build) time so every sitemap entry gets the
// same lastmod for this deploy, rather than a per-URL timestamp drift.
const BUILD_TIME = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, Open Graph URLs and the sitemap.
  site: 'https://nomaddigital.dev',
  integrations: [
    react(),
    sitemap({
      // Stamp a build-time lastmod on every entry. There's no per-page edit
      // date to draw from, so "last generated" is the honest signal — it gives
      // crawlers a freshness hint instead of the empty <url> we shipped before.
      // hreflang alternates are advertised via <link> tags in Layout.astro
      // (the authoritative signal Google reads), so they're not duplicated here.
      serialize(item) {
        return { ...item, lastmod: BUILD_TIME };
      },
    }),
  ],
  vite: {
    server: {
      // Mirror the prod nginx reverse proxy: forward /api/* to the backend so the
      // frontend can use same-origin relative URLs in dev too. Override the target
      // with API_PROXY_TARGET if the API runs somewhere other than :5217.
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || 'http://localhost:5217',
          changeOrigin: true,
        },
      },
    },
  },
});
