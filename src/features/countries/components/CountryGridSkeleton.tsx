import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

type CountryGridSkeletonProps = {
  count?: number;
};

/** Skeleton con la misma forma que `CountryGrid` (AGENTS.md 3.7). */
export function CountryGridSkeleton({ count = 6 }: CountryGridSkeletonProps) {
  return (
    <div role="status">
      <span className="sr-only">Cargando destinos…</span>
      <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <Card padding="none">
              <Skeleton className="aspect-[3/2] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
