import type { z } from 'zod';

import type { countriesQuerySchema, countrySchema } from '@/features/countries/schemas/country.schema';

/** País en el modelo de Vagando (nombres en español), derivado del schema. */
export type Country = z.infer<typeof countrySchema>;

export type CountriesQuery = z.infer<typeof countriesQuerySchema>;

/** Respuesta exitosa de `GET /api/countries`. */
export type CountriesResponse = {
  countries: Country[];
};
