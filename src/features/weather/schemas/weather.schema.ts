import { z } from 'zod';

/**
 * Schemas de Open-Meteo (AGENTS.md 2.4).
 * `weatherSchema` valida la respuesta y la transforma al modelo de la app:
 * los arreglos paralelos de `daily` se convierten en una lista de días.
 */

const openMeteoResponseSchema = z.object({
  timezone: z.string(),
  current: z.object({
    /** Hora local de la medición, por ejemplo "2026-11-15T13:00". */
    time: z.string(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    apparent_temperature: z.number(),
    weather_code: z.number().int(),
    wind_speed_10m: z.number(),
    is_day: z.union([z.literal(0), z.literal(1)]),
  }),
  daily: z
    .object({
      time: z.array(z.string()),
      weather_code: z.array(z.number().int()),
      temperature_2m_max: z.array(z.number()),
      temperature_2m_min: z.array(z.number()),
      precipitation_probability_max: z.array(z.number().nullable()),
    })
    .refine(
      (daily) =>
        [daily.weather_code, daily.temperature_2m_max, daily.temperature_2m_min, daily.precipitation_probability_max].every(
          (values) => values.length === daily.time.length,
        ),
      'Los arreglos diarios de Open-Meteo no tienen la misma longitud',
    ),
});

export const weatherSchema = openMeteoResponseSchema.transform((raw) => ({
  timezone: raw.timezone,
  current: {
    /** "HH:MM" en hora local del lugar. */
    localTime: raw.current.time.slice(11, 16),
    temperature: raw.current.temperature_2m,
    apparentTemperature: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    windSpeed: raw.current.wind_speed_10m,
    weatherCode: raw.current.weather_code,
    isDay: raw.current.is_day === 1,
  },
  daily: raw.daily.time.map((date, index) => ({
    /** "YYYY-MM-DD" */
    date,
    weatherCode: raw.daily.weather_code[index] ?? 0,
    max: raw.daily.temperature_2m_max[index] ?? 0,
    min: raw.daily.temperature_2m_min[index] ?? 0,
    precipitationProbability: raw.daily.precipitation_probability_max[index] ?? null,
  })),
}));

/** Query params de `GET /api/weather` (y validación de entrada del service). */
export const weatherQuerySchema = z.object({
  lat: z.coerce
    .number({ error: 'El parámetro lat debe ser un número.' })
    .min(-90, 'La latitud debe estar entre -90 y 90.')
    .max(90, 'La latitud debe estar entre -90 y 90.'),
  lon: z.coerce
    .number({ error: 'El parámetro lon debe ser un número.' })
    .min(-180, 'La longitud debe estar entre -180 y 180.')
    .max(180, 'La longitud debe estar entre -180 y 180.'),
});
