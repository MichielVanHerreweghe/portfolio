// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, Open Graph URLs and the sitemap.
  site: 'https://nomaddigital.dev',
  integrations: [react(), sitemap()],
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
