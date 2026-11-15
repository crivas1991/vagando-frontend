import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';

import { getCountryLocation } from '@/features/countries';
import { findCountryByCode, getCentralAmericaCountries } from '@/features/countries/server';
import { PlacesExplorer } from '@/features/places';

/** Las 7 páginas de lugares se prerenderizan; el listado se carga en el cliente vía /api/places. */
export async function generateStaticParams() {
  const countries = await getCentralAmericaCountries();
  return countries.map((country) => ({ code: country.code }));
}

export async function generateMetadata({ params }: PageProps<'/country/[code]/places'>): Promise<Metadata> {
  const { code } = await params;
  const country = await findCountryByCode(code);

  if (!country) return { title: 'Destino no encontrado' };

  const url = `/country/${country.code}/places`;
  const title = `Lugares turísticos de ${country.name}`;
  const description = `Atractivos, museos, naturaleza, playas y gastronomía cerca de ${country.capital?.name ?? country.name}.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${title} · Vagando`,
      description,
      images: [{ url: country.flag.png, alt: country.flag.alt }],
    },
  };
}

/** Lugares turísticos (Server Component con el explorador interactivo como Client Component). */
export default async function CountryPlacesPage({ params }: PageProps<'/country/[code]/places'>) {
  const { code } = await params;
  const country = await findCountryByCode(code);

  if (!country) notFound();
  if (code !== country.code) permanentRedirect(`/country/${country.code}/places`);

  const location = getCountryLocation(country);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link
          href={`/country/${country.code}`}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted hover:text-foreground"
        >
          <span aria-hidden="true">←</span> Volver a {country.name}
        </Link>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">
            {country.flag.emoji && <span aria-hidden="true">{country.flag.emoji} </span>}
            Lugares turísticos
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Qué visitar en {country.name}
          </h1>
          <p className="max-w-2xl text-muted">
            Lugares cerca de {location.name}. Elige una categoría para descubrir atractivos, museos, naturaleza, playas y
            dónde comer.
          </p>
        </div>
      </header>

      <PlacesExplorer lat={location.lat} lon={location.lon} referenceName={location.name} />

      <p className="text-xs text-muted">
        Datos de lugares: Geoapify y colaboradores de OpenStreetMap. Las distancias se miden en línea recta.
      </p>
    </div>
  );
}
