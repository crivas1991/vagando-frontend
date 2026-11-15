import Image from 'next/image';
import Link from 'next/link';

import { buttonClassName } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

import type { Country } from '@/features/countries/types/country.types';
// Entre features solo se importa por el barrel público (AGENTS.md 1.4).
import { FavoriteButton } from '@/features/favorites';
import { formatPopulation } from '@/features/countries/utils/formatPopulation';

type CountryDetailProps = {
  country: Country;
};

const areaFormatter = new Intl.NumberFormat('es');

/** Ficha principal del país: bandera, nombre y datos clave. */
export function CountryDetail({ country }: CountryDetailProps) {
  const currencies = country.currencies
    .map((currency) => `${currency.name} (${currency.code}${currency.symbol ? `, ${currency.symbol}` : ''})`)
    .join(' · ');

  const facts = [
    { label: 'Capital', value: country.capital?.name ?? 'Sin dato', icon: '🏛️' },
    { label: 'Población', value: `${formatPopulation(country.population)} hab.`, icon: '👥' },
    { label: country.currencies.length > 1 ? 'Monedas' : 'Moneda', value: currencies || 'Sin dato', icon: '💵' },
    { label: country.languages.length > 1 ? 'Idiomas' : 'Idioma', value: country.languages.join(', ') || 'Sin dato', icon: '🗣️' },
    ...(country.areaKm2 !== null
      ? [{ label: 'Superficie', value: `${areaFormatter.format(country.areaKm2)} km²`, icon: '🗺️' }]
      : []),
    { label: 'Código ISO', value: `${country.code} · ${country.code2}`, icon: '🔖' },
  ];

  return (
    <article className="space-y-8">
      <Link href="/explore" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted hover:text-foreground">
        <span aria-hidden="true">←</span> Explorar destinos
      </Link>

      <header className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-10">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm">
          <Image
            src={country.flag.png}
            alt={country.flag.alt}
            fill
            preload
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">
            {country.flag.emoji && <span aria-hidden="true">{country.flag.emoji} </span>}
            Centroamérica
          </p>
          <div className="space-y-1">
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{country.name}</h1>
            {country.officialName !== country.name && <p className="text-muted">{country.officialName}</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/country/${country.code}/places`} className={buttonClassName('primary')}>
              Ver lugares turísticos
            </Link>
            <FavoriteButton code={country.code} name={country.name} variant="full" />
          </div>
        </div>
      </header>

      <section aria-labelledby="datos-title" className="space-y-4">
        <h2 id="datos-title" className="font-display text-2xl font-semibold">
          Datos esenciales
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <Card key={fact.label} className="flex items-start gap-3">
              <span aria-hidden="true" className="text-2xl leading-none">
                {fact.icon}
              </span>
              <div>
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="font-semibold">{fact.value}</dd>
              </div>
            </Card>
          ))}
        </dl>
      </section>
    </article>
  );
}
