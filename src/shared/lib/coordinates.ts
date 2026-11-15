import { z } from 'zod';

/**
 * Coordenadas geográficas validadas (latitud -90..90, longitud -180..180).
 * Acepta strings numéricos (`z.coerce`) porque llegan como query params.
 * La usan los features que consultan APIs por ubicación (clima y lugares).
 */
export const coordinatesSchema = z.object({
  lat: z.coerce
    .number({ error: 'El parámetro lat debe ser un número.' })
    .min(-90, 'La latitud debe estar entre -90 y 90.')
    .max(90, 'La latitud debe estar entre -90 y 90.'),
  lon: z.coerce
    .number({ error: 'El parámetro lon debe ser un número.' })
    .min(-180, 'La longitud debe estar entre -180 y 180.')
    .max(180, 'La longitud debe estar entre -180 y 180.'),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;

/** Redondea a 2 decimales (~1 km): coordenadas casi iguales comparten la misma entrada de caché. */
export function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}
