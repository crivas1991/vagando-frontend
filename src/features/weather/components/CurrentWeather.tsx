import { Card } from '@/shared/components/ui/Card';

import type { CurrentWeatherData } from '@/features/weather/types/weather.types';
import { describeWeatherCode } from '@/features/weather/utils/weatherCode';

type CurrentWeatherProps = {
  current: CurrentWeatherData;
};

const temperatureFormatter = new Intl.NumberFormat('es', { maximumFractionDigits: 0 });

/** Clima actual: condición, temperatura y detalles. */
export function CurrentWeather({ current }: CurrentWeatherProps) {
  const { label, emoji } = describeWeatherCode(current.weatherCode, current.isDay);

  const details = [
    { label: 'Sensación térmica', value: `${temperatureFormatter.format(current.apparentTemperature)} °C` },
    { label: 'Humedad', value: `${temperatureFormatter.format(current.humidity)} %` },
    { label: 'Viento', value: `${temperatureFormatter.format(current.windSpeed)} km/h` },
  ];

  return (
    <Card className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="text-6xl leading-none sm:text-7xl">
          {emoji}
        </span>
        <div>
          <p className="font-display text-5xl font-semibold tracking-tight">
            {temperatureFormatter.format(current.temperature)}
            <span className="text-2xl align-top"> °C</span>
          </p>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted">Actualizado a las {current.localTime} (hora local)</p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 sm:justify-self-end">
        {details.map((detail) => (
          <div key={detail.label} className="rounded-xl bg-surface-muted px-3 py-2 text-center">
            <dt className="text-xs text-muted">{detail.label}</dt>
            <dd className="font-semibold">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
