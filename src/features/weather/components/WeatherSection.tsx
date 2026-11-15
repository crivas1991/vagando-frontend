import 'server-only';

import { unstable_rethrow } from 'next/navigation';
import { connection } from 'next/server';

import { ErrorState } from '@/shared/components/ui/ErrorState';
import { RefreshButton } from '@/shared/components/ui/RefreshButton';
import { logger } from '@/shared/lib/logger';

import { getWeather } from '@/features/weather/services/weather.service';
import type { Weather } from '@/features/weather/types/weather.types';

import { CurrentWeather } from './CurrentWeather';
import { ForecastList } from './ForecastList';

type WeatherSectionProps = {
  lat: number;
  lon: number;
};

/**
 * Sección de clima (Server Component asíncrono). Se usa dentro de un <Suspense> propio.
 *
 * Degradación elegante (AGENTS.md 2.10): si Open-Meteo falla, NO se propaga el error a `error.tsx`.
 * Se muestra un `ErrorState` solo en esta sección y el resto de la página del país sigue funcionando.
 */
export async function WeatherSection({ lat, lon }: WeatherSectionProps) {
  let weather: Weather;

  try {
    weather = await getWeather(lat, lon);
  } catch (error) {
    // Señales internas de Next.js (prerenderizado, notFound...) no son fallas: se devuelven a Next.
    unstable_rethrow(error);
    // Si la falla ocurre durante el build, no se "congela" el error en la página estática:
    // `connection()` pospone esta sección hasta la petición real, donde se vuelve a intentar.
    await connection();
    logger.warn('Clima no disponible; se muestra el estado de error de la sección', error);

    return (
      <ErrorState
        variant="section"
        title="No pudimos obtener el clima"
        message="El servicio del clima no responde en este momento. El resto de la información del destino sigue disponible."
        action={<RefreshButton />}
      />
    );
  }

  return (
    <div className="space-y-4">
      <CurrentWeather current={weather.current} />
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted">Próximos 7 días</h3>
        <ForecastList days={weather.daily} />
      </div>
    </div>
  );
}
