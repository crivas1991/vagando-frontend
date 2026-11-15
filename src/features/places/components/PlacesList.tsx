import type { ReactNode } from 'react';

import { EmptyState } from '@/shared/components/ui/EmptyState';

import type { Place } from '@/features/places/types/place.types';
import { PLACE_KINDS, type PlaceKind } from '@/features/places/utils/placeKinds';

import { PlaceCard } from './PlaceCard';

type PlacesListProps = {
  places: Place[];
  kind: PlaceKind;
  referenceName: string;
  /** Acción del estado vacío (por ejemplo, botones para cambiar de categoría). */
  emptyAction?: ReactNode;
};

/** Grilla de lugares, con estado vacío si no hay resultados (AGENTS.md 3.7). */
export function PlacesList({ places, kind, referenceName, emptyAction }: PlacesListProps) {
  if (places.length === 0) {
    return (
      <EmptyState
        title={`No encontramos ${PLACE_KINDS[kind].label.toLowerCase()} cerca de ${referenceName}`}
        message={`Buscamos en un radio de ${PLACE_KINDS[kind].radiusKm} km. Prueba con otra categoría.`}
      >
        {emptyAction}
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {places.map((place) => (
        <li key={place.id}>
          <PlaceCard place={place} kind={kind} referenceName={referenceName} />
        </li>
      ))}
    </ul>
  );
}
