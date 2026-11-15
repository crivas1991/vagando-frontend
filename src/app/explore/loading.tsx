import { CountryGridSkeleton } from '@/features/countries';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Carga de /explore: imita el encabezado, el formulario de búsqueda y la grilla (AGENTS.md 3.7). */
export default function ExploreLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3" aria-hidden="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div aria-hidden="true" className="grid gap-4 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <Skeleton className="h-11 w-full rounded-full" />
        <Skeleton className="h-11 w-full rounded-full sm:w-56" />
      </div>

      <CountryGridSkeleton />
    </div>
  );
}
