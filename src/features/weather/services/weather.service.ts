import 'server-only';

import { cacheLife } from 'next/cache';

import { AppError } from '@/shared/lib/errors';
import { fetchJson } from '@/shared/lib/http';

import { weatherQuerySchema, weatherSchema } from '@/features/weather/schemas/weather.schema';
import type { Weather } from '@/features/weather/types/weather.types';

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** Media hora: el clima cambia, pero no tanto como para consultar en cada visita. */
const WEATHER_REVALIDATE_SECONDS = 1800;

/** Redondea a 2 decimales (~1 km): coordenadas casi iguales comparten la misma entrada de caché. */
function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  'use cache';
  cacheLife({ revalidate: WEATHER_REVALIDATE_SECONDS, expire: WEATHER_REVALIDATE_SECONDS * 2 });

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
 * Clima actual y pronóstico de 7 días para unas coordenadas.
 * Se cachea 30 minutos con `'use cache'` + `cacheLife` (equivalente a `revalidate: 1800`).
 * Lanza `AppError BAD_REQUEST` si las coordenadas están fuera de rango.
 */
export async function getWeather(lat: number, lon: number): Promise<Weather> {
  const coordinates = weatherQuerySchema.safeParse({ lat, lon });
  if (!coordinates.success) {
    throw new AppError('Coordenadas inválidas.', 'BAD_REQUEST', 400, coordinates.error.issues);
  }

  return fetchWeather(roundCoordinate(coordinates.data.lat), roundCoordinate(coordinates.data.lon));
}
