import Link from 'next/link';

import { buttonClassName } from '@/shared/components/ui/Button';

import type { Country } from '@/features/countries/types/country.types';
import { formatPopulationCompact } from '@/features/countries/utils/formatPopulation';

type CountriesHeroProps = {
  countries: Country[];
};

/** Portada de la página de inicio con datos reales de la región. */
export function CountriesHero({ countries }: CountriesHeroProps) {
  const totalPopulation = countries.reduce((sum, country) => sum + country.population, 0);
  const flags = countries.map((country) => country.flag.emoji).filter(Boolean).join(' ');

  const stats = [
    { label: 'países por descubrir', value: String(countries.length) },
    { label: 'habitantes', value: formatPopulationCompact(totalPopulation) },
    { label: 'océanos: Pacífico y Caribe', value: '2' },
  ];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover px-6 py-12 text-primary-foreground sm:px-10 sm:py-16 lg:px-14"
    >
      {/* Olas decorativas */}
      <svg aria-hidden="true" viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-24 w-full opacity-15">
        <path d="M0 60c50-30 100-30 150 0s100 30 150 0 75-30 100-15v75H0Z" fill="currentColor" />
        <path d="M0 85c50-25 100-25 150 0s100 25 150 0 75-25 100-12v47H0Z" fill="currentColor" />
      </svg>

      <div className="relative max-w-2xl space-y-6">
        {flags && (
          <p aria-hidden="true" className="text-2xl tracking-widest sm:text-3xl">
            {flags}
          </p>
        )}

        <div className="space-y-4">
          <h1 id="hero-title" className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Volcanes, playas y selva en un solo viaje
          </h1>
          <p className="text-base opacity-90 sm:text-lg">
            Descubre Centroamérica país por país: información esencial, clima en tiempo real y los lugares que no te
            puedes perder.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/explore" className={buttonClassName('secondary', 'border-transparent')}>
            Explorar destinos
          </Link>
          <Link
            href="#destinos"
            className={buttonClassName('ghost', 'text-primary-foreground ring-1 ring-primary-foreground/40')}
          >
            Ver destinos destacados
          </Link>
        </div>

        <dl className="grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs opacity-80 sm:text-sm">{stat.label}</dt>
              <dd className="order-first font-display text-2xl font-semibold sm:text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
