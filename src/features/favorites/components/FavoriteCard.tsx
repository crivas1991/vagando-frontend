import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/shared/components/ui/Card';

import type { FavoriteCountry } from '@/features/favorites/types/favorites.types';

import { FavoriteButton } from './FavoriteButton';

const populationFormatter = new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 });

/** Tarjeta de un país favorito, con botón para quitarlo. */
export function FavoriteCard({ country }: { country: FavoriteCountry }) {
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
        <div className="space-y-1 p-5">
          <h2 className="font-display text-xl font-semibold">{country.name}</h2>
          <p className="text-sm text-muted">
            {country.capital ? `Capital: ${country.capital.name} · ` : ''}
            {populationFormatter.format(country.population)} hab.
          </p>
        </div>
      </Link>
      {/* Fuera del <Link>: un botón no puede ir dentro de un enlace (HTML inválido) */}
      <FavoriteButton code={country.code} name={country.name} className="absolute right-3 top-3 z-10" />
    </Card>
  );
}
