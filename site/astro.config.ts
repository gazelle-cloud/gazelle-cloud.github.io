import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gazelle.cloud',
  output: 'static',
  redirects: {
    '/': '/model/',
  },
});
