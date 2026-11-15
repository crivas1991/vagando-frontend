import { z } from 'zod';

import { coordinatesSchema } from '@/shared/lib/coordinates';

import { DEFAULT_PLACE_KIND, PLACE_KIND_VALUES } from '@/features/places/utils/placeKinds';

/**
 * Schemas de Geoapify Places v2 (AGENTS.md 2.4).
 *
 * La respuesta es un GeoJSON `FeatureCollection` y los datos están en `features[].properties`.
 * El schema es TOLERANTE: casi todos los campos son opcionales, porque muchos lugares vienen
 * incompletos. Los lugares sin nombre se descartan en el service.
 */

/** Solo se aceptan fotos de Wikimedia (dominio permitido en `next.config.ts`). */
const ALLOWED_IMAGE_HOST = 'upload.wikimedia.org';

function toSafeImageUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === ALLOWED_IMAGE_HOST ? url.toString() : null;
  } catch {
    // No es una URL válida: se trata como "sin foto" y se usa la imagen de respaldo.
    return null;
  }
}

function toSafeWebsite(value: string | undefined): string | null {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : null;
}

/** Un lugar tal como lo devuelve Geoapify (solo los campos que se usan). */
export const geoapifyPlaceSchema = z.object({
  properties: z.object({
    place_id: z.string().min(1),
    name: z.string().trim().optional(),
    lat: z.number(),
    lon: z.number(),
    categories: z.array(z.string()).default([]),
    address_line2: z.string().optional(),
    formatted: z.string().optional(),
    city: z.string().optional(),
    /** Distancia en metros desde el punto de búsqueda (si se usa `bias=proximity`). */
    distance: z.number().optional(),
    website: z.string().optional(),
    datasource: z
      .object({
        raw: z.object({ image: z.string().optional() }).loose().optional(),
      })
      .optional(),
  }),
});

/** Transforma un lugar con nombre al modelo de Vagando. */
export const placeSchema = geoapifyPlaceSchema
  .refine((feature) => Boolean(feature.properties.name), 'Lugar sin nombre')
  .transform(({ properties }) => ({
    id: properties.place_id,
    name: properties.name ?? '',
    address: properties.address_line2 ?? properties.formatted ?? null,
    city: properties.city ?? null,
    lat: properties.lat,
    lon: properties.lon,
    distanceKm: properties.distance === undefined ? null : Math.round(properties.distance / 100) / 10,
    website: toSafeWebsite(properties.website),
    imageUrl: toSafeImageUrl(properties.datasource?.raw?.image),
  }));

/** Envoltorio GeoJSON. Los lugares se validan uno por uno para descartar solo los incompletos. */
export const geoapifyResponseSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(z.unknown()),
});

/** Query params de `GET /api/places`. */
export const placesQuerySchema = coordinatesSchema.extend({
  kind: z
    .enum(PLACE_KIND_VALUES, { error: `La categoría debe ser una de: ${PLACE_KIND_VALUES.join(', ')}.` })
    .default(DEFAULT_PLACE_KIND),
});
