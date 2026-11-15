'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { buttonClassName } from '@/shared/components/ui/Button';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { getErrorDigest, reportClientError } from '@/shared/lib/report-client-error';

type PlacesErrorProps = {
  error: unknown;
  retry: () => void;
};

/**
 * Error de la página de lugares (AGENTS.md 2.7).
 * Los fallos de Geoapify los maneja el propio explorador (con su "Reintentar");
 * aquí solo llega un error de la página, por ejemplo al obtener los datos del país.
 */
export default function PlacesError({ error, retry }: PlacesErrorProps) {
  useEffect(() => {
    reportClientError(error, 'country/[code]/places/error');
  }, [error]);

  const digest = getErrorDigest(error);

  return (
    <div className="space-y-4">
      <ErrorState
        title="No pudimos cargar los lugares de este destino"
        message="Ocurrió un problema al preparar la página. Intenta de nuevo en unos segundos."
        onRetry={retry}
        action={
          <Link href="/explore" className={buttonClassName('secondary')}>
            Ver otros destinos
          </Link>
        }
      />
      {digest && <p className="text-center text-xs text-muted">Código de referencia: {digest}</p>}
    </div>
  );
}
