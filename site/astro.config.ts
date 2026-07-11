import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gazelle.cloud',
  output: 'static',
  integrations: [sitemap({
    filter: (page) =>
      !page.includes('/operations/') &&
      !page.includes('/bigbang/')
  })],
});
