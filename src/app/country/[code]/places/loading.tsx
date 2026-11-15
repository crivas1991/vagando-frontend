import { PlacesSkeleton } from '@/features/places';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Carga de /country/[code]/places: encabezado, filtro de categorías y grilla (AGENTS.md 3.7 y 3.9). */
export default function PlacesLoading() {
  return (
    <div className="space-y-8">
      <div aria-hidden="true" className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      </div>

      <div aria-hidden="true" className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-11 w-32 shrink-0 rounded-full" />
        ))}
      </div>

      <PlacesSkeleton />
    </div>
  );
}
