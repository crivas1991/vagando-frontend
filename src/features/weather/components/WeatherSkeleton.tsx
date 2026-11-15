import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Skeleton con la forma de `CurrentWeather` + `ForecastList` (AGENTS.md 3.7). */
export function WeatherSkeleton() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Cargando el clima…</span>
      <div aria-hidden="true">
        <Card className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </Card>
      </div>
      <div aria-hidden="true" className="flex gap-3 overflow-hidden md:grid md:grid-cols-7">
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className="h-36 min-w-28 rounded-2xl md:min-w-0" />
        ))}
      </div>
    </div>
  );
}
