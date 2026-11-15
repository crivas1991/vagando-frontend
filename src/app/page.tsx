import { Card } from '@/shared/components/ui/Card';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Spinner } from '@/shared/components/ui/Spinner';

/**
 * Página de inicio TEMPORAL: muestra los componentes de `shared/components/ui`
 * para revisarlos visualmente. Se reemplaza por la página real en el Paso 6.
 */
export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Turismo en Centroamérica</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Vagando</h1>
        <p className="max-w-2xl text-muted sm:text-lg">
          Vista previa de los componentes de interfaz. Esta página se reemplaza por el inicio real en el Paso 6.
        </p>
      </section>

      <section aria-labelledby="preview-cards" className="space-y-4">
        <h2 id="preview-cards" className="font-display text-2xl font-semibold">Card</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {['Volcanes', 'Playas', 'Ruinas mayas'].map((title) => (
            <Card key={title} as="li" interactive>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted">Tarjeta reutilizable con hover y padding responsive.</p>
            </Card>
          ))}
        </ul>
      </section>

      <section aria-labelledby="preview-loading" className="space-y-4">
        <h2 id="preview-loading" className="font-display text-2xl font-semibold">Skeleton y Spinner</h2>
        <div role="status" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <span className="sr-only">Cargando destinos…</span>
          {[1, 2, 3].map((item) => (
            <Card key={item} padding="none">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </div>
      </section>

      <section aria-labelledby="preview-states" className="space-y-4">
        <h2 id="preview-states" className="font-display text-2xl font-semibold">ErrorState y EmptyState</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <ErrorState
            variant="section"
            title="No pudimos obtener el clima"
            message="El servicio del clima no responde. El resto de la página sigue funcionando."
          />
          <EmptyState
            title="Aún no tienes destinos favoritos"
            message="Guarda los países que te gustaría visitar y aparecerán aquí."
            action={{ label: 'Explorar destinos', href: '/explore' }}
          />
        </div>
      </section>
    </div>
  );
}
