import 'server-only';

import { cacheLife } from 'next/cache';
import type { z } from 'zod';

import { toCachedFailure, unwrapCachedResult, type CachedResult } from '@/shared/lib/cached-result';
import { roundCoordinate } from '@/shared/lib/coordinates';
import { getServerEnv } from '@/shared/lib/env';
import { AppError, isAppError } from '@/shared/lib/errors';
import { fetchJson } from '@/shared/lib/http';
import { logger } from '@/shared/lib/logger';

import { geoapifyResponseSchema, placeSchema, placesQuerySchema } from '@/features/places/schemas/place.schema';
import type { Place } from '@/features/places/types/place.types';
import { PLACES_LIMIT, PLACE_KINDS, type PlaceKind } from '@/features/places/utils/placeKinds';

const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';

/** Petición a Geoapify. Puede lanzar `AppError`; la llama solo `loadPlaces`. */
async function requestPlaces(lat: number, lon: number, kind: PlaceKind): Promise<Place[]> {
  const { GEOAPIFY_API_KEY } = getServerEnv();
  const { geoapifyCategory, radiusKm } = PLACE_KINDS[kind];

  const url = new URL(GEOAPIFY_PLACES_URL);
  url.searchParams.set('categories', geoapifyCategory);
  url.searchParams.set('filter', `circle:${lon},${lat},${radiusKm * 1000}`);
  url.searchParams.set('bias', `proximity:${lon},${lat}`);
  url.searchParams.set('lang', 'es');
  url.searchParams.set('limit', String(PLACES_LIMIT * 2)); // se piden de más porque se descartan los que no tienen nombre
  // Geoapify solo acepta la key como query param. `fetchJson` y `logger` nunca registran la URL completa.
  url.searchParams.set('apiKey', GEOAPIFY_API_KEY);

  let body: z.infer<typeof geoapifyResponseSchema>;
  try {
    body = await fetchJson(url, geoapifyResponseSchema);
  } catch (error) {
    // Mensajes específicos de lugares, sin exponer la key (AGENTS.md 2.6).
    if (isAppError(error) && error.code === 'RATE_LIMITED') {
      throw new AppError(
        'Alcanzamos el límite de consultas de lugares. Intenta de nuevo en unos minutos.',
        'RATE_LIMITED',
        429,
        error.cause,
      );
    }
    if (isAppError(error) && error.code === 'UPSTREAM_ERROR') {
      throw new AppError('No pudimos obtener los lugares turísticos en este momento.', 'UPSTREAM_ERROR', 502, error.cause);
    }
    throw error;
  }

  const places: Place[] = [];
  let withoutName = 0;

  for (const feature of body.features) {
    const parsed = placeSchema.safeParse(feature);
    if (parsed.success) {
      places.push(parsed.data);
    } else {
      withoutName += 1;
    }
  }

  if (withoutName > 0) {
    logger.info(`Geoapify: ${withoutName} lugares descartados por no tener nombre o datos válidos`, { kind });
  }

  return places
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    .slice(0, PLACES_LIMIT);
}

/**
 * Versión cacheada con resultado serializable (ver `shared/lib/cached-result.ts`).
 * Éxito → 1 día (los lugares casi no cambian y el plan permite 3000 peticiones/día); falla → unos segundos.
 * `'use cache: remote'`: caché compartida entre instancias serverless para proteger la cuota de la key
 * (ver `countries.service.ts`). Open-Meteo, que no usa key, se queda con `'use cache'` en memoria.
 */
async function loadPlaces(lat: number, lon: number, kind: PlaceKind): Promise<CachedResult<Place[]>> {
  'use cache: remote';

  try {
    const places = await requestPlaces(lat, lon, kind);
    cacheLife('days');
    return { ok: true, data: places };
  } catch (error) {
    cacheLife('seconds');
    return toCachedFailure(error, 'places');
  }
}

/**
 * Lugares turísticos de una categoría cerca de unas coordenadas, ordenados por distancia.
 * - Valida las coordenadas y la categoría (`AppError BAD_REQUEST`).
 * - 401/403 (key inválida) → `UPSTREAM_ERROR`, y 429 → `RATE_LIMITED`, sin exponer la key.
 * - Se cachea 1 día por coordenadas redondeadas y categoría.
 */
export async function getPlacesNear(lat: number, lon: number, kind: PlaceKind): Promise<Place[]> {
  const query = placesQuerySchema.safeParse({ lat, lon, kind });
  if (!query.success) {
    throw new AppError('Parámetros de búsqueda de lugares inválidos.', 'BAD_REQUEST', 400, query.error.issues);
  }

  return unwrapCachedResult(
    await loadPlaces(roundCoordinate(query.data.lat), roundCoordinate(query.data.lon), query.data.kind),
  );
}
