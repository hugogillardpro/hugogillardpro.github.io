import type { MetadataRoute } from 'next';
import { getMariages } from '@/lib/content';
import { site } from '@/lib/site';

// Obligatoire en export statique.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const maintenant = new Date();
  return [
    { url: `${site.url}/`, lastModified: maintenant },
    { url: `${site.url}/mariages/`, lastModified: maintenant },
    ...getMariages().map((m) => ({ url: `${site.url}/mariages/${m.slug}/`, lastModified: maintenant })),
    { url: `${site.url}/confidentialite/`, lastModified: maintenant },
    { url: `${site.url}/mentions-legales/`, lastModified: maintenant },
  ];
}
