'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { buttonClassName } from '@/shared/components/ui/Button';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { getErrorDigest, reportClientError } from '@/shared/lib/report-client-error';

type CountryErrorProps = {
  error: unknown;
  retry: () => void;
};

/**
 * Error del detalle de un país (AGENTS.md 2.7).
 * Solo llega aquí si falla la fuente PRINCIPAL (REST Countries).
 * Si falla el clima, lo maneja su propia sección sin romper la página (AGENTS.md 2.10).
 */
export default function CountryError({ error, retry }: CountryErrorProps) {
  useEffect(() => {
    reportClientError(error, 'country/[code]/error');
  }, [error]);

  const digest = getErrorDigest(error);

  return (
    <div className="space-y-4">
      <ErrorState
        title="No pudimos cargar este destino"
        message="Tuvimos un problema al obtener la información del país. Intenta de nuevo en unos segundos."
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
