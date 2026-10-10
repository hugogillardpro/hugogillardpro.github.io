import type { MetadataRoute } from 'next';
import { getMariages } from '@/lib/content';
import { site } from '@/lib/site';
import { getZonesPubliees } from '@/lib/zones';

// Obligatoire en export statique.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const maintenant = new Date();
  const zones = getZonesPubliees();
  return [
    { url: `${site.url}/`, lastModified: maintenant },
    { url: `${site.url}/mariages/`, lastModified: maintenant },
    ...getMariages().map((m) => ({ url: `${site.url}/mariages/${m.slug}/`, lastModified: maintenant })),
    // Pages locales : seulement celles qui ont au moins un mariage (l'index aussi, sinon il reste masqué).
    ...(zones.length ? [{ url: `${site.url}/photographe-mariage/`, lastModified: maintenant }] : []),
    ...zones.map((z) => ({ url: `${site.url}/photographe-mariage/${z.slug}/`, lastModified: maintenant })),
    { url: `${site.url}/confidentialite/`, lastModified: maintenant },
    { url: `${site.url}/mentions-legales/`, lastModified: maintenant },
  ];
}
