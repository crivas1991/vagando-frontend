'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { buttonClassName } from '@/shared/components/ui/Button';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { getErrorDigest, reportClientError } from '@/shared/lib/report-client-error';

type ErrorPageProps = {
  /** En producción, los errores del servidor llegan con mensaje genérico y un `digest`. */
  error: unknown;
  /** Vuelve a pedir los datos al servidor y re-renderiza el segmento (estable desde Next 16.3). */
  retry: () => void;
};

/**
 * Límite de error de la app (AGENTS.md 2.7).
 * Captura errores de las páginas y layouts anidados. No captura errores de `app/layout.tsx`:
 * esos los maneja `global-error.tsx`.
 */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    reportClientError(error, 'app/error');
  }, [error]);

  const digest = getErrorDigest(error);

  return (
    <div className="space-y-4">
      <ErrorState
        title="Nos desviamos del camino"
        message="Ocurrió un problema al cargar esta página. Puede ser algo temporal: intenta de nuevo en unos segundos."
        onRetry={retry}
        action={
          <Link href="/" className={buttonClassName('secondary')}>
            Volver al inicio
          </Link>
        }
      />
      {digest && <p className="text-center text-xs text-muted">Código de referencia: {digest}</p>}
    </div>
  );
}
