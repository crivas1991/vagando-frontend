import type { z } from 'zod';

import type { weatherQuerySchema, weatherSchema } from '@/features/weather/schemas/weather.schema';

export type Weather = z.infer<typeof weatherSchema>;
export type CurrentWeatherData = Weather['current'];
export type DailyForecast = Weather['daily'][number];
export type WeatherQuery = z.infer<typeof weatherQuerySchema>;

/** Respuesta exitosa de `GET /api/weather`. */
export type WeatherResponse = {
  weather: Weather;
};
