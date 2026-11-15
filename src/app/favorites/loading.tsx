import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/** Carga de /favorites (AGENTS.md 3.7). */
export default function FavoritesLoading() {
  return (
    <div role="status" className="space-y-8">
      <span className="sr-only">Cargando tus favoritos…</span>
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <ul aria-hidden="true" className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index}>
            <Card padding="none">
              <Skeleton className="aspect-[3/2] w-full rounded-none" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
