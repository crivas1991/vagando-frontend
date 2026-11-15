import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Skeleton con la forma de `CountryDetail` (AGENTS.md 3.7). */
export function CountryDetailSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-8">
      <Skeleton className="h-5 w-36" />

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-10">
        <Skeleton className="aspect-[3/2] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-11 w-48 rounded-full" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
