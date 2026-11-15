import type { MetadataRoute } from 'next';

import { siteConfig } from '@/shared/lib/site-config';

/** /robots.txt: permite indexar el sitio, excepto la API interna, y apunta al sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
