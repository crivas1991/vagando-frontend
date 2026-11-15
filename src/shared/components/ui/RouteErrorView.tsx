'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { getErrorDigest, reportClientError } from '@/shared/lib/report-client-error';

import { buttonClassName } from './Button';
import { ErrorState } from './ErrorState';

type RouteErrorViewProps = {
  /** Props que Next.js entrega a `error.tsx`. */
  error: unknown;
  retry: () => void;
  /** Identifica el segmento en el registro de errores, por ejemplo `explore/error`. */
  boundary: string;
  title: string;
  message: string;
  /** Enlace alternativo para salir de la página con error. */
  fallbackLink: { href: string; label: string };
};

/**
 * Contenido común de los `error.tsx` por segmento (AGENTS.md 2.7):
 * registra el error, muestra un mensaje seguro, "Reintentar" con `retry()`,
 * un enlace alternativo y el código de referencia (`digest`).
 */
export function RouteErrorView({ error, retry, boundary, title, message, fallbackLink }: RouteErrorViewProps) {
  useEffect(() => {
    reportClientError(error, boundary);
  }, [error, boundary]);

  const digest = getErrorDigest(error);

  return (
    <div className="space-y-4">
      <ErrorState
        title={title}
        message={message}
        onRetry={retry}
        action={
          <Link href={fallbackLink.href} className={buttonClassName('secondary')}>
            {fallbackLink.label}
          </Link>
        }
      />
      {digest && <p className="text-center text-xs text-muted">Código de referencia: {digest}</p>}
    </div>
  );
}
