import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hugogillardpro.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/merci/'),
    }),
  ],
  image: {
    // Les vignettes des films YouTube sont téléchargées au build :
    // le visiteur ne contacte pas YouTube avant de lancer un film.
    domains: ['img.youtube.com'],
  },
});
