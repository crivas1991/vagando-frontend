import 'server-only';

import { z } from 'zod';

import { AppError } from './errors';

/**
 * Variables de entorno del servidor validadas con zod (AGENTS.md 2.4 y 3.8).
 *
 * - Es el único lugar del proyecto donde se lee `process.env`.
 * - La validación es perezosa: se ejecuta la primera vez que se llama a `getServerEnv()`.
 *   Así el build no falla en entornos donde todavía no se configuraron las keys
 *   (por ejemplo, el primer deploy en Vercel) y el error aparece justo donde se necesita.
 * - Si falta una variable, el log indica cuál es, pero NUNCA muestra su valor.
 */

/** Los valores de ejemplo de `.env.example` empiezan con `your_`. */
const PLACEHOLDER_PREFIX = 'your_';

function apiKey(name: string) {
  return z
    .string({ error: `${name} no está definida` })
    .trim()
    .min(1, `${name} está vacía`)
    .refine((value) => !value.startsWith(PLACEHOLDER_PREFIX), `${name} todavía tiene el valor de ejemplo de .env.example`);
}

const serverEnvSchema = z.object({
  REST_COUNTRIES_API_KEY: apiKey('REST_COUNTRIES_API_KEY'),
  GEOAPIFY_API_KEY: apiKey('GEOAPIFY_API_KEY'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const parsed = serverEnvSchema.safeParse({
    REST_COUNTRIES_API_KEY: process.env.REST_COUNTRIES_API_KEY,
    GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
  });

  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => issue.message).join('; ');
    throw new AppError(
      'El servicio no está disponible en este momento.',
      'INTERNAL',
      500,
      new Error(`Variables de entorno inválidas: ${problems}. Revisa .env.local (ver .env.example).`),
    );
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
