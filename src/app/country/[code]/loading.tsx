import { CountryDetailSkeleton } from '@/features/countries';
import { WeatherSkeleton } from '@/features/weather';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/**
 * Carga de /country/[code] (AGENTS.md 3.7 y 3.9).
 * Además del skeleton, es el límite de <Suspense> que `cacheComponents` exige
 * para `await params` en rutas dinámicas.
 */
export default function CountryLoading() {
  return (
    <div role="status" className="space-y-12">
      <span className="sr-only">Cargando destino…</span>
      <CountryDetailSkeleton />
      <div className="space-y-4">
        <Skeleton className="h-7 w-56" />
        <WeatherSkeleton />
      </div>
    </div>
  );
}
