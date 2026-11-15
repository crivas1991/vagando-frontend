import type { DailyForecast } from '@/features/weather/types/weather.types';
import { formatForecastDay, formatForecastDayLong } from '@/features/weather/utils/formatForecastDay';
import { describeWeatherCode } from '@/features/weather/utils/weatherCode';

type ForecastListProps = {
  days: DailyForecast[];
};

const temperatureFormatter = new Intl.NumberFormat('es', { maximumFractionDigits: 0 });

/**
 * Pronóstico por día.
 * Responsive (AGENTS.md 3.6): scroll horizontal con snap en móvil y grilla de 7 columnas desde `md`.
 */
export function ForecastList({ days }: ForecastListProps) {
  return (
    <ul
      aria-label="Pronóstico de los próximos días"
      className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0 md:pb-0"
    >
      {days.map((day, index) => {
        const { label, emoji } = describeWeatherCode(day.weatherCode);
        return (
          <li
            key={day.date}
            className="flex min-w-28 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-4 text-center md:min-w-0"
          >
            <p className="text-sm font-semibold capitalize">
              <span aria-hidden="true">{formatForecastDay(day.date, index)}</span>
              <span className="sr-only">{formatForecastDayLong(day.date)}</span>
            </p>
            <span aria-hidden="true" className="text-3xl leading-none">
              {emoji}
            </span>
            <p className="sr-only">{label}</p>
            <p className="text-sm">
              <span className="font-semibold">{temperatureFormatter.format(day.max)}°</span>{' '}
              <span className="text-muted">/ {temperatureFormatter.format(day.min)}°</span>
              <span className="sr-only"> (máxima / mínima)</span>
            </p>
            {day.precipitationProbability !== null && (
              <p className="text-xs text-muted">
                <span aria-hidden="true">💧 </span>
                {day.precipitationProbability} %<span className="sr-only"> de probabilidad de lluvia</span>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
