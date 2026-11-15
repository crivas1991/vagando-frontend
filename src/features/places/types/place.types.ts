import type { z } from 'zod';

import type { placeSchema, placesQuerySchema } from '@/features/places/schemas/place.schema';
import type { PlaceKind } from '@/features/places/utils/placeKinds';

export type Place = z.infer<typeof placeSchema>;
export type PlacesQuery = z.infer<typeof placesQuerySchema>;

/** Respuesta exitosa de `GET /api/places`. */
export type PlacesResponse = {
  kind: PlaceKind;
  places: Place[];
};
