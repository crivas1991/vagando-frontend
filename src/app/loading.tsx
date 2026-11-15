import { Card } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';

/**
 * Estado de carga genérico (AGENTS.md 3.7).
 * Next.js lo convierte en un límite de <Suspense> alrededor de las páginas que no tengan
 * su propio `loading.tsx`. Imita la forma más común de la app: un encabezado y una grilla de tarjetas.
 */
export default function Loading() {
  return (
    <div role="status" className="space-y-10">
      <span className="sr-only">Cargando contenido…</span>

      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Card key={index} padding="none">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-2 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
