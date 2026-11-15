import { Card } from '@/shared/components/ui/Card';

import type { Place } from '@/features/places/types/place.types';
import { PLACE_KINDS, type PlaceKind } from '@/features/places/utils/placeKinds';

import { PlaceImage } from './PlaceImage';

type PlaceCardProps = {
  place: Place;
  kind: PlaceKind;
  /** Nombre del punto de referencia para la distancia (por ejemplo, la capital). */
  referenceName: string;
};

const distanceFormatter = new Intl.NumberFormat('es', { maximumFractionDigits: 1 });

/** Tarjeta de un lugar turístico, con enlace al mapa (OpenStreetMap, sin API key). */
export function PlaceCard({ place, kind, referenceName }: PlaceCardProps) {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`;
  const linkClass =
    'inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:text-primary-hover hover:underline';

  return (
    <Card as="article" padding="none" className="flex h-full flex-col">
      <PlaceImage name={place.name} kind={kind} imageUrl={place.imageUrl} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-strong">
            <span aria-hidden="true">{PLACE_KINDS[kind].emoji} </span>
            {PLACE_KINDS[kind].label}
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug">{place.name}</h3>
          {place.address && <p className="text-sm text-muted">{place.address}</p>}
        </div>

        {place.distanceKm !== null && (
          <p className="text-sm">
            <span aria-hidden="true">📍 </span>A {distanceFormatter.format(place.distanceKm)} km de {referenceName}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-x-5">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Ver en el mapa<span className="sr-only"> {place.name} (se abre en una pestaña nueva)</span>
          </a>
          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Sitio web<span className="sr-only"> de {place.name} (se abre en una pestaña nueva)</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
