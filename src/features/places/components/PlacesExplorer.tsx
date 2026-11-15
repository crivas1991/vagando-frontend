'use client';

import { useState } from 'react';

import { ErrorState } from '@/shared/components/ui/ErrorState';
import { Spinner } from '@/shared/components/ui/Spinner';
import { cn } from '@/shared/lib/cn';

import { usePlaces } from '@/features/places/hooks/usePlaces';
import { DEFAULT_PLACE_KIND, PLACE_KINDS, type PlaceKind } from '@/features/places/utils/placeKinds';

import { KindFilter } from './KindFilter';
import { PlacesList } from './PlacesList';
import { PlacesSkeleton } from './PlacesSkeleton';

type PlacesExplorerProps = {
  lat: number;
  lon: number;
  /** Nombre del punto de referencia (la capital). */
  referenceName: string;
};

/**
 * Explorador de lugares (Client Component): filtro de categoría + resultados.
 * Consume `/api/places` mediante `usePlaces` (AGENTS.md 3.3: el cliente solo usa Route Handlers).
 */
export function PlacesExplorer({ lat, lon, referenceName }: PlacesExplorerProps) {
  const [kind, setKind] = useState<PlaceKind>(DEFAULT_PLACE_KIND);
  const { data, dataKind, error, isLoading, retry } = usePlaces(lat, lon, kind);

  return (
    <div className="space-y-6">
      <KindFilter value={kind} onChange={setKind} />

      <div className="flex min-h-6 items-center gap-3 text-sm text-muted" aria-live="polite">
        {isLoading && data !== null && <Spinner size="sm" label="Buscando lugares…" />}
        {!isLoading && !error && data !== null && (
          <p>
            {data.length === 1 ? '1 lugar' : `${data.length} lugares`} en {PLACE_KINDS[kind].label.toLowerCase()}, a menos
            de {PLACE_KINDS[kind].radiusKm} km de {referenceName}
          </p>
        )}
      </div>

      {error ? (
        <ErrorState variant="section" title="No pudimos cargar los lugares" message={error} onRetry={retry} />
      ) : data === null ? (
        <PlacesSkeleton />
      ) : (
        <div className={cn('transition-opacity', isLoading && 'opacity-60')}>
          <PlacesList
            places={data}
            kind={dataKind ?? kind}
            referenceName={referenceName}
            emptyAction={<KindFilter value={kind} onChange={setKind} exclude={[kind]} />}
          />
        </div>
      )}
    </div>
  );
}
