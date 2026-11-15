'use client';

import { RouteErrorView } from '@/shared/components/ui/RouteErrorView';

/**
 * Error de la página de lugares (AGENTS.md 2.7).
 * Los fallos de Geoapify los maneja el propio explorador (con su "Reintentar");
 * aquí solo llega un error de la página, por ejemplo al obtener los datos del país.
 */
export default function PlacesError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <RouteErrorView
      error={error}
      retry={retry}
      boundary="country/[code]/places/error"
      title="No pudimos cargar los lugares de este destino"
      message="Ocurrió un problema al preparar la página. Intenta de nuevo en unos segundos."
      fallbackLink={{ href: '/explore', label: 'Ver otros destinos' }}
    />
  );
}
