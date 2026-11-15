import 'server-only';

import { cacheLife } from 'next/cache';

import { toCachedFailure, unwrapCachedResult, type CachedResult } from '@/shared/lib/cached-result';
import { getServerEnv } from '@/shared/lib/env';
import { AppError } from '@/shared/lib/errors';
import { fetchJson } from '@/shared/lib/http';
import { logger } from '@/shared/lib/logger';

import { countryCodeSchema, countrySchema, restCountriesResponseSchema } from '@/features/countries/schemas/country.schema';
import type { Country } from '@/features/countries/types/country.types';
import { CENTRAL_AMERICA_CODES } from '@/features/countries/utils/constants';
import { filterCountries } from '@/features/countries/utils/filterCountries';

const REST_COUNTRIES_BASE_URL = 'https://api.restcountries.com/countries/v5';

/** Campos que se piden a la API (`response_fields`), para no descargar los 90+ campos de cada país. */
const RESPONSE_FIELDS = [
  'names.common',
  'names.official',
  'names.translations.spa',
  'codes.alpha_2',
  'codes.alpha_3',
  'flag.url_png',
  'flag.url_svg',
  'flag.emoji',
  'capitals',
  'population',
  'region',
  'subregion',
  'currencies',
  'languages',
  'coordinates',
  'area.kilometers',
].join(',');

const allowedCodes = new Set<string>(CENTRAL_AMERICA_CODES);

/** Petición a REST Countries. Puede lanzar `AppError`; la llama solo `loadCentralAmericaCountries`. */
async function requestCentralAmericaCountries(): Promise<Country[]> {
  const { REST_COUNTRIES_API_KEY } = getServerEnv();

  const url = new URL(`${REST_COUNTRIES_BASE_URL}/subregion/${encodeURIComponent('Central America')}`);
  url.searchParams.set('response_fields', RESPONSE_FIELDS);
  url.searchParams.set('limit', '25');

  const body = await fetchJson(url, restCountriesResponseSchema, {
    // La key va en el header, nunca en la URL (AGENTS.md 3.8).
    headers: { Authorization: `Bearer ${REST_COUNTRIES_API_KEY}` },
  });

  const countries: Country[] = [];
  for (const item of body.data.objects) {
    const parsed = countrySchema.safeParse(item);
    if (!parsed.success) {
      // Degradación elegante: se omite solo el país con formato inesperado.
      logger.warn('REST Countries: país con formato inesperado, se omite', { issues: parsed.error.issues });
      continue;
    }
    if (allowedCodes.has(parsed.data.code)) countries.push(parsed.data);
  }

  if (countries.length === 0) {
    throw new AppError('No pudimos obtener los países en este momento.', 'UPSTREAM_ERROR', 502, {
      reason: 'empty-country-list',
      received: body.data.objects.length,
    });
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

/**
 * Versión cacheada. Devuelve un resultado serializable en lugar de lanzar
 * (un `AppError` lanzado dentro de `'use cache'` pierde su tipo, ver `shared/lib/cached-result.ts`):
 * - éxito → se cachea 1 día (`cacheLife('days')`, equivalente a `revalidate: 86400`),
 * - falla → se cachea solo unos segundos, para reintentar pronto.
 *
 * `'use cache: remote'` (Paso 14): en serverless (Vercel) la caché en memoria no se comparte entre
 * instancias, y cada visita podría gastar la cuota de 1000 peticiones/mes. La caché remota la provee
 * la plataforma y es compartida. Si la plataforma no ofrece una (por ejemplo, en local),
 * Next.js usa la caché en memoria normal (`next/dist/server/use-cache/handlers.js`).
 */
async function loadCentralAmericaCountries(): Promise<CachedResult<Country[]>> {
  'use cache: remote';

  try {
    const countries = await requestCentralAmericaCountries();
    cacheLife('days');
    return { ok: true, data: countries };
  } catch (error) {
    cacheLife('seconds');
    return toCachedFailure(error, 'countries');
  }
}

/**
 * Países de Centroamérica, ordenados por nombre en español.
 *
 * Estrategia de cuota (plan gratuito: 1000 peticiones/mes):
 * - UNA sola petición trae los 7 países y se cachea 1 día.
 * - `searchCountries` y `findCountryByCode` reutilizan esta lista: buscar o abrir un país
 *   no gasta peticiones extra.
 */
export async function getCentralAmericaCountries(): Promise<Country[]> {
  return unwrapCachedResult(await loadCentralAmericaCountries());
}

/** Busca países por nombre, capital o código. Sin búsqueda, devuelve todos. */
export async function searchCountries(query?: string): Promise<Country[]> {
  const countries = await getCentralAmericaCountries();
  return filterCountries(countries, query);
}

/**
 * Busca un país por su código alpha-3 (sin importar mayúsculas).
 * Devuelve `null` si el código no es válido o no es un país de Centroamérica.
 * Pensado para las páginas, que deciden llamar a `notFound()`.
 */
export async function findCountryByCode(code: string): Promise<Country | null> {
  const parsedCode = countryCodeSchema.safeParse(code);
  if (!parsedCode.success) return null;

  const countries = await getCentralAmericaCountries();
  return countries.find((item) => item.code === parsedCode.data) ?? null;
}

/**
 * Devuelve un país por su código alpha-3 (por ejemplo, `SLV`).
 * Lanza `AppError NOT_FOUND` si no existe (pensado para Route Handlers).
 */
export async function getCountryByCode(code: string): Promise<Country> {
  const country = await findCountryByCode(code);

  if (!country) {
    throw new AppError('No encontramos ese destino.', 'NOT_FOUND', 404, { code });
  }

  return country;
}
