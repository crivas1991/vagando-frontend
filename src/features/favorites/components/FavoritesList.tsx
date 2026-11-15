'use client';

import { Card } from '@/shared/components/ui/Card';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Skeleton } from '@/shared/components/ui/Skeleton';

import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import type { FavoriteCountry } from '@/features/favorites/types/favorites.types';

import { FavoriteCard } from './FavoriteCard';

type FavoritesListProps = {
  /** Todos los países disponibles (vienen del servidor); se muestran solo los guardados. */
  countries: FavoriteCountry[];
};

/**
 * Lista de favoritos (Client Component). Estados: cargando (hasta leer `localStorage`), vacío y lista.
 * Se actualiza sola cuando se quita un favorito, aquí o en otra pestaña.
 */
export function FavoritesList({ countries }: FavoritesListProps) {
  const { favorites, isReady } = useFavorites();

  if (!isReady) {
    return (
      <div role="status">
        <span className="sr-only">Cargando tus favoritos…</span>
        <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              <Card padding="none">
                <Skeleton className="aspect-[3/2] w-full rounded-none" />
                <div className="space-y-2 p-5">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // En el orden en que se guardaron; se ignoran códigos que ya no existan en la lista de países.
  const byCode = new Map(countries.map((country) => [country.code, country]));
  const saved = favorites.flatMap((code) => byCode.get(code) ?? []);

  if (saved.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes destinos favoritos"
        message="Toca el corazón en cualquier país para guardarlo aquí y planear tu próximo viaje."
        action={{ label: 'Explorar destinos', href: '/explore' }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted" aria-live="polite">
        {saved.length === 1 ? '1 destino guardado' : `${saved.length} destinos guardados`}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {saved.map((country) => (
          <li key={country.code}>
            <FavoriteCard country={country} />
          </li>
        ))}
      </ul>
    </div>
  );
}
