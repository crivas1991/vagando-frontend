import { z } from 'zod';

import { COUNTRY_SEARCH_MAX_LENGTH } from '@/features/countries/utils/constants';

/**
 * Schemas de REST Countries v5 (AGENTS.md 2.4).
 *
 * - Solo se declaran los campos que la app usa.
 * - `countrySchema` valida el formato de la API y lo transforma al modelo de Vagando (`Country`),
 *   con nombres en español. Los tipos se derivan de aquí con `z.infer` (una sola fuente de verdad).
 */

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const nameSchema = z.object({
  common: z.string().min(1),
  official: z.string().min(1),
});

/** Formato de un país tal como lo devuelve REST Countries v5. */
export const restCountrySchema = z.object({
  names: nameSchema.extend({
    translations: z
      .record(z.string(), z.object({ common: z.string().optional(), official: z.string().optional() }))
      .optional(),
  }),
  codes: z.object({
    alpha_2: z.string().length(2),
    alpha_3: z.string().length(3),
  }),
  flag: z.object({
    url_png: z.url(),
    url_svg: z.url().optional(),
    emoji: z.string().optional(),
  }),
  capitals: z
    .array(
      z.object({
        name: z.string(),
        coordinates: coordinatesSchema.optional(),
      }),
    )
    .default([]),
  population: z.number().int().nonnegative(),
  region: z.string(),
  subregion: z.string(),
  currencies: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
        symbol: z.string().optional(),
      }),
    )
    .default([]),
  languages: z
    .array(
      z.object({
        name: z.string(),
        native_name: z.string().optional(),
      }),
    )
    .default([]),
  coordinates: coordinatesSchema,
  area: z.object({ kilometers: z.number() }).optional(),
});

/** Valida un país de la API y lo transforma al modelo de la app. */
export const countrySchema = restCountrySchema.transform((raw) => {
  const spanish = raw.names.translations?.spa;
  const name = spanish?.common ?? raw.names.common;
  const capital = raw.capitals[0];

  return {
    code: raw.codes.alpha_3,
    code2: raw.codes.alpha_2,
    name,
    nameEn: raw.names.common,
    officialName: spanish?.official ?? raw.names.official,
    flag: {
      png: raw.flag.url_png,
      svg: raw.flag.url_svg ?? null,
      emoji: raw.flag.emoji ?? null,
      alt: `Bandera de ${name}`,
    },
    capital: capital
      ? {
          name: capital.name,
          lat: capital.coordinates?.lat ?? null,
          lng: capital.coordinates?.lng ?? null,
        }
      : null,
    population: raw.population,
    region: raw.region,
    subregion: raw.subregion,
    currencies: raw.currencies.map(({ code, name: currencyName, symbol }) => ({
      code,
      name: currencyName,
      symbol: symbol ?? null,
    })),
    languages: raw.languages.map((language) => language.native_name ?? language.name),
    coordinates: raw.coordinates,
    areaKm2: raw.area?.kilometers ?? null,
  };
});

/**
 * Envoltorio de las respuestas de listado de la v5: `{ data: { objects: [...] } }`.
 * Los países se validan uno por uno en el service, para omitir solo los que vengan mal.
 */
export const restCountriesResponseSchema = z.object({
  data: z.object({
    objects: z.array(z.unknown()),
  }),
});

/** Query params de `GET /api/countries`. */
export const countriesQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .max(COUNTRY_SEARCH_MAX_LENGTH, `La búsqueda admite máximo ${COUNTRY_SEARCH_MAX_LENGTH} caracteres.`)
    .optional(),
});

/** Código de país ISO alpha-3 (por ejemplo, `SLV`). Se normaliza a mayúsculas. */
export const countryCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/)
  .transform((code) => code.toUpperCase());
