// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, Open Graph URLs and the sitemap.
  site: 'https://nomaddigital.dev',
  integrations: [react(), sitemap()],
});
