import type { MetadataRoute } from 'next';
import { apercu, site } from '@/lib/site';

// Obligatoire en export statique.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (apercu) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
