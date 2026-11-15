/**
 * Códigos de clima WMO (los que usa Open-Meteo) → descripción en español + emoji.
 * Referencia: https://open-meteo.com/en/docs (sección "WMO Weather interpretation codes").
 */

export type WeatherDescription = {
  label: string;
  emoji: string;
};

const WMO_CODES: Record<number, WeatherDescription> = {
  0: { label: 'Despejado', emoji: '☀️' },
  1: { label: 'Mayormente despejado', emoji: '🌤️' },
  2: { label: 'Parcialmente nublado', emoji: '⛅' },
  3: { label: 'Nublado', emoji: '☁️' },
  45: { label: 'Niebla', emoji: '🌫️' },
  48: { label: 'Niebla con escarcha', emoji: '🌫️' },
  51: { label: 'Llovizna ligera', emoji: '🌦️' },
  53: { label: 'Llovizna moderada', emoji: '🌦️' },
  55: { label: 'Llovizna intensa', emoji: '🌧️' },
  56: { label: 'Llovizna helada ligera', emoji: '🌧️' },
  57: { label: 'Llovizna helada intensa', emoji: '🌧️' },
  61: { label: 'Lluvia ligera', emoji: '🌦️' },
  63: { label: 'Lluvia moderada', emoji: '🌧️' },
  65: { label: 'Lluvia intensa', emoji: '🌧️' },
  66: { label: 'Lluvia helada ligera', emoji: '🌧️' },
  67: { label: 'Lluvia helada intensa', emoji: '🌧️' },
  71: { label: 'Nevada ligera', emoji: '🌨️' },
  73: { label: 'Nevada moderada', emoji: '🌨️' },
  75: { label: 'Nevada intensa', emoji: '❄️' },
  77: { label: 'Granos de nieve', emoji: '🌨️' },
  80: { label: 'Chubascos ligeros', emoji: '🌦️' },
  81: { label: 'Chubascos moderados', emoji: '🌧️' },
  82: { label: 'Chubascos violentos', emoji: '⛈️' },
  85: { label: 'Chubascos de nieve ligeros', emoji: '🌨️' },
  86: { label: 'Chubascos de nieve intensos', emoji: '🌨️' },
  95: { label: 'Tormenta eléctrica', emoji: '⛈️' },
  96: { label: 'Tormenta con granizo ligero', emoji: '⛈️' },
  99: { label: 'Tormenta con granizo intenso', emoji: '⛈️' },
};

const UNKNOWN: WeatherDescription = { label: 'Condición desconocida', emoji: '🌡️' };

/** Describe un código WMO. De noche, "despejado" usa luna en lugar de sol. */
export function describeWeatherCode(code: number, isDay = true): WeatherDescription {
  const description = WMO_CODES[code] ?? UNKNOWN;
  if (!isDay && code <= 1) return { ...description, emoji: '🌙' };
  return description;
}
