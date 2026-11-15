'use client';

import { RouteErrorView } from '@/shared/components/ui/RouteErrorView';

/**
 * Error de /favorites (AGENTS.md 2.7). Los favoritos guardados no se pierden:
 * están en el navegador; lo que falló es obtener los datos de los países.
 */
export default function FavoritesError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <RouteErrorView
      error={error}
      retry={retry}
      boundary="favorites/error"
      title="No pudimos cargar tus favoritos"
      message="Tus destinos siguen guardados en este navegador, pero no pudimos obtener su información. Intenta de nuevo en unos segundos."
      fallbackLink={{ href: '/explore', label: 'Explorar destinos' }}
    />
  );
}
