import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';

import { CountryDetail, getCountryLocation } from '@/features/countries';
import { findCountryByCode, getCentralAmericaCountries } from '@/features/countries/server';
import { WeatherSkeleton } from '@/features/weather';
import { WeatherSection } from '@/features/weather/server';

/**
 * Los 7 países se prerenderizan en el build. Reutiliza la lista cacheada de REST Countries,
 * así que no gasta peticiones extra. Con `cacheComponents` no existe `dynamicParams`:
 * cualquier otro código se renderiza al pedirse y termina en `notFound()`.
 */
export async function generateStaticParams() {
  const countries = await getCentralAmericaCountries();
  return countries.map((country) => ({ code: country.code }));
}

export async function generateMetadata({ params }: PageProps<'/country/[code]'>): Promise<Metadata> {
  const { code } = await params;
  const country = await findCountryByCode(code);

  if (!country) {
    return { title: 'Destino no encontrado' };
  }

  const description = `Información de ${country.name}: capital, población, moneda, idiomas y el clima de hoy en ${country.capital?.name ?? country.name}.`;

  const url = `/country/${country.code}`;

  return {
    title: country.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${country.name} · Vagando`,
      description,
      images: [{ url: country.flag.png, alt: country.flag.alt }],
    },
  };
}

/** Detalle de un país (Server Component). El clima va en su propio <Suspense> (AGENTS.md 2.10). */
export default async function CountryPage({ params }: PageProps<'/country/[code]'>) {
  const { code } = await params;
  const country = await findCountryByCode(code);

  if (!country) notFound();

  // URL canónica en mayúsculas: /country/slv → /country/SLV
  if (code !== country.code) permanentRedirect(`/country/${country.code}`);

  const location = getCountryLocation(country);

  return (
    <div className="space-y-12">
      <CountryDetail country={country} />

      <section aria-labelledby="clima-title" className="space-y-4">
        <div className="space-y-1">
          <h2 id="clima-title" className="font-display text-2xl font-semibold">
            Clima en {location.name}
          </h2>
          <p className="text-sm text-muted">Datos de Open-Meteo, actualizados cada 30 minutos.</p>
        </div>

        <Suspense fallback={<WeatherSkeleton />}>
          <WeatherSection lat={location.lat} lon={location.lon} />
        </Suspense>
      </section>
    </div>
  );
}
