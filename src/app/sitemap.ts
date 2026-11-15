import type { MetadataRoute } from 'next';

import { getCentralAmericaCountries } from '@/features/countries/server';
import { siteConfig } from '@/shared/lib/site-config';

/**
 * /sitemap.xml: páginas públicas para buscadores.
 * Usa la lista cacheada de países (sin peticiones extra). `/favorites` no se incluye: es personal y tiene `noindex`.
 * Sin `lastModified`: con `cacheComponents`, leer la fecha actual volvería dinámica la ruta.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCentralAmericaCountries();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.url}/explore`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const countryPages: MetadataRoute.Sitemap = countries.flatMap((country) => [
    { url: `${siteConfig.url}/country/${country.code}`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/country/${country.code}/places`, changeFrequency: 'weekly', priority: 0.7 },
  ]);

  return [...staticPages, ...countryPages];
}
