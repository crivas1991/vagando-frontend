'use client';

import { RouteErrorView } from '@/shared/components/ui/RouteErrorView';

/**
 * Error del detalle de un país (AGENTS.md 2.7).
 * Solo llega aquí si falla la fuente PRINCIPAL (REST Countries).
 * Si falla el clima, lo maneja su propia sección sin romper la página (AGENTS.md 2.10).
 */
export default function CountryError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <RouteErrorView
      error={error}
      retry={retry}
      boundary="country/[code]/error"
      title="No pudimos cargar este destino"
      message="Tuvimos un problema al obtener la información del país. Intenta de nuevo en unos segundos."
      fallbackLink={{ href: '/explore', label: 'Ver otros destinos' }}
    />
  );
}
