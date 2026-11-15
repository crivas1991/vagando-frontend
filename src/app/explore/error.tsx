'use client';

import { RouteErrorView } from '@/shared/components/ui/RouteErrorView';

/** Error de /explore (AGENTS.md 2.7). Los fallos de la búsqueda los maneja el propio buscador. */
export default function ExploreError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <RouteErrorView
      error={error}
      retry={retry}
      boundary="explore/error"
      title="No pudimos abrir el explorador de destinos"
      message="Ocurrió un problema al preparar la página. Intenta de nuevo en unos segundos."
      fallbackLink={{ href: '/', label: 'Volver al inicio' }}
    />
  );
}
