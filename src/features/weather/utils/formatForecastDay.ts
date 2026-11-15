const weekdayFormatter = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
const longFormatter = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

/**
 * "2026-11-17" → "mar 17". El primer día es "Hoy" y el segundo "Mañana".
 * Se interpreta la fecha en UTC al mediodía para que la zona horaria del servidor no cambie el día.
 */
export function formatForecastDay(date: string, index: number): string {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  return weekdayFormatter.format(new Date(`${date}T12:00:00Z`));
}

/** "2026-11-17" → "martes, 17 de noviembre" (para lectores de pantalla). */
export function formatForecastDayLong(date: string): string {
  return longFormatter.format(new Date(`${date}T12:00:00Z`));
}
