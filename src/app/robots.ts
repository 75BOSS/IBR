import type { MetadataRoute } from 'next';
import { isIndexable, siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Copias de prueba: nada se indexa (ver PRODUCTION_HOSTS).
  if (!isIndexable()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
