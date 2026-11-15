import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/shared/components/ui/Card';

import type { Country } from '@/features/countries/types/country.types';
// Entre features solo se importa por el barrel público (AGENTS.md 1.4).
import { FavoriteButton } from '@/features/favorites';
import { formatPopulationCompact } from '@/features/countries/utils/formatPopulation';

type CountryCardProps = {
  country: Country;
  /** Nivel del título según la jerarquía de la página (AGENTS.md 4.6). */
  headingLevel?: 'h2' | 'h3';
};

/** Tarjeta de un país. Toda la tarjeta es un enlace a su detalle, con el corazón de favoritos encima. */
export function CountryCard({ country, headingLevel: Heading = 'h3' }: CountryCardProps) {
  return (
    <Card as="article" padding="none" interactive className="relative h-full">
      <Link href={`/country/${country.code}`} className="flex h-full flex-col">
        <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-border bg-surface-muted">
          <Image
            src={country.flag.png}
            alt={country.flag.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <Heading className="font-display text-xl font-semibold">{country.name}</Heading>
            {country.capital && (
              <p className="text-sm text-muted">
                Capital: <span className="text-foreground">{country.capital.name}</span>
              </p>
            )}
          </div>

          <dl className="mt-auto flex flex-wrap gap-2 text-xs font-medium">
            <div className="rounded-full bg-primary-soft px-3 py-1">
              <dt className="sr-only">Población</dt>
              <dd>👥 {formatPopulationCompact(country.population)} hab.</dd>
            </div>
            {country.languages[0] && (
              <div className="rounded-full bg-accent-soft px-3 py-1">
                <dt className="sr-only">Idioma principal</dt>
                <dd className="capitalize">🗣️ {country.languages[0]}</dd>
              </div>
            )}
          </dl>
        </div>
      </Link>
      {/* Fuera del <Link>: un botón no puede ir dentro de un enlace (HTML inválido) */}
      <FavoriteButton code={country.code} name={country.name} className="absolute right-3 top-3 z-10" />
    </Card>
  );
}
