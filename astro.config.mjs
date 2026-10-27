// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sweepkey.waygosquad.tech',
  integrations: [sitemap({ filter: (page) => !page.includes('404') && !page.includes('health') })],
  trailingSlash: 'never',
  build: { format: 'file' },
});
