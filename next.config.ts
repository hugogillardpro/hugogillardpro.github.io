import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Site entièrement statique, publié sur GitHub Pages.
  output: 'export',
  trailingSlash: true,
  // Pas de basePath : domaine personnalisé servi à la racine.
  images: {
    // L'optimisation d'images de Next n'existe pas en export statique :
    // les variantes WebP sont générées au build par scripts/images.mjs.
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [800, 1200, 1600, 2000],
    imageSizes: [400],
  },
};

export default nextConfig;
