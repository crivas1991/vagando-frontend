import 'server-only';

import { cacheLife } from 'next/cache';

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

/**
 * Países de Centroamérica, ordenados por nombre en español.
 *
 * Estrategia de cuota (plan gratuito: 1000 peticiones/mes):
 * - UNA sola petición trae los 7 países y se cachea con `'use cache'` + `cacheLife('days')`
 *   (se revalida cada día, como un `revalidate: 86400`).
 * - `searchCountries` y `getCountryByCode` reutilizan esta lista: buscar o abrir un país
 *   no gasta peticiones extra.
 */
export async function getCentralAmericaCountries(): Promise<Country[]> {
  'use cache';
  cacheLife('days');

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

/** Busca países por nombre, capital o código. Sin búsqueda, devuelve todos. */
export async function searchCountries(query?: string): Promise<Country[]> {
  const countries = await getCentralAmericaCountries();
  return filterCountries(countries, query);
}

/**
 * Devuelve un país por su código alpha-3 (por ejemplo, `SLV`).
 * Lanza `AppError NOT_FOUND` si el código no es válido o no es un país de Centroamérica.
 */
export async function getCountryByCode(code: string): Promise<Country> {
  const parsedCode = countryCodeSchema.safeParse(code);
  if (!parsedCode.success) {
    throw new AppError('No encontramos ese destino.', 'NOT_FOUND', 404, { code });
  }

  const countries = await getCentralAmericaCountries();
  const country = countries.find((item) => item.code === parsedCode.data);

  if (!country) {
    throw new AppError('No encontramos ese destino.', 'NOT_FOUND', 404, { code: parsedCode.data });
  }

  return country;
}
