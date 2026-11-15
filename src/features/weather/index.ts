// API pública del feature weather (segura para cliente). Ver AGENTS.md 1.5
// Los services y WeatherSection (que usa el service) NO se exportan aquí: están en ./server.ts

export { CurrentWeather } from './components/CurrentWeather';
export { ForecastList } from './components/ForecastList';
export { WeatherSkeleton } from './components/WeatherSkeleton';
export { weatherQuerySchema } from './schemas/weather.schema';
export type { CurrentWeatherData, DailyForecast, Weather, WeatherQuery, WeatherResponse } from './types/weather.types';
export { formatForecastDay, formatForecastDayLong } from './utils/formatForecastDay';
export { describeWeatherCode, type WeatherDescription } from './utils/weatherCode';
