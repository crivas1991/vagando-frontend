import 'server-only';

import { cacheLife } from 'next/cache';

import { toCachedFailure, unwrapCachedResult, type CachedResult } from '@/shared/lib/cached-result';
import { roundCoordinate } from '@/shared/lib/coordinates';
import { AppError } from '@/shared/lib/errors';
import { fetchJson } from '@/shared/lib/http';

import { weatherQuerySchema, weatherSchema } from '@/features/weather/schemas/weather.schema';
import type { Weather } from '@/features/weather/types/weather.types';

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** Media hora: el clima cambia, pero no tanto como para consultar en cada visita. */
const WEATHER_REVALIDATE_SECONDS = 1800;

/** Petición a Open-Meteo. Puede lanzar `AppError`; la llama solo `loadWeather`. */
async function requestWeather(lat: number, lon: number): Promise<Weather> {
  const url = new URL(OPEN_METEO_FORECAST_URL);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
  );
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  return fetchJson(url, weatherSchema);
}

/**
 * Versión cacheada con resultado serializable (ver `shared/lib/cached-result.ts`):
 * éxito → 30 minutos; falla → unos segundos.
 */
async function loadWeather(lat: number, lon: number): Promise<CachedResult<Weather>> {
  'use cache';

  try {
    const weather = await requestWeather(lat, lon);
    cacheLife({ revalidate: WEATHER_REVALIDATE_SECONDS, expire: WEATHER_REVALIDATE_SECONDS * 2 });
    return { ok: true, data: weather };
  } catch (error) {
    cacheLife('seconds');
    return toCachedFailure(error, 'weather');
  }
}

/**
 * Clima actual y pronóstico de 7 días para unas coordenadas.
 * Se cachea 30 minutos con `'use cache'` + `cacheLife` (equivalente a `revalidate: 1800`).
 * Lanza `AppError BAD_REQUEST` si las coordenadas están fuera de rango.
 */
export async function getWeather(lat: number, lon: number): Promise<Weather> {
  const coordinates = weatherQuerySchema.safeParse({ lat, lon });
  if (!coordinates.success) {
    throw new AppError('Coordenadas inválidas.', 'BAD_REQUEST', 400, coordinates.error.issues);
  }

  return unwrapCachedResult(await loadWeather(roundCoordinate(coordinates.data.lat), roundCoordinate(coordinates.data.lon)));
}
