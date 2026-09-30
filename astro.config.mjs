// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://minemakers.net',
  // Map pages keep their historical root-level URLs (e.g. /makers-wars-2).
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
