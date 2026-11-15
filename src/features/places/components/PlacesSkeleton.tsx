import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Skeleton con la forma de `PlacesList` (AGENTS.md 3.7). */
export function PlacesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status">
      <span className="sr-only">Cargando lugares turísticos…</span>
      <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <Card padding="none">
              <Skeleton className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
