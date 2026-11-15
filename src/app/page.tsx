import { CountriesHero, CountryGrid } from '@/features/countries';
import { getCentralAmericaCountries } from '@/features/countries/server';

/**
 * Inicio (Server Component). Los países vienen de un service cacheado (`'use cache'`),
 * así que la página se prerenderiza y no gasta cuota de la API en cada visita.
 */
export default async function HomePage() {
  const countries = await getCentralAmericaCountries();

  return (
    <div className="space-y-12 sm:space-y-16">
      <CountriesHero countries={countries} />

      <section id="destinos" aria-labelledby="destinos-title" className="scroll-mt-24 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Destinos destacados</p>
          <h2 id="destinos-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Siete países, un mismo istmo
          </h2>
          <p className="max-w-2xl text-muted">
            Del Caribe beliceño al canal de Panamá: elige un país para ver su información, el clima y sus lugares
            turísticos.
          </p>
        </div>

        <CountryGrid countries={countries} headingLevel="h3" />
      </section>
    </div>
  );
}
