'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { buttonClassName } from '@/shared/components/ui/Button';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { Logo } from '@/shared/components/ui/Logo';
import { fontVariables } from '@/shared/lib/fonts';
import { getErrorDigest, reportClientError } from '@/shared/lib/report-client-error';
import { siteConfig } from '@/shared/lib/site-config';

import './globals.css';

type GlobalErrorProps = {
  error: unknown;
  retry: () => void;
};

/**
 * Último recurso (AGENTS.md 2.7): se muestra cuando falla el propio `app/layout.tsx`.
 *
 * - REEMPLAZA al layout raíz, por eso define su propio <html> y <body> e importa
 *   los estilos y las fuentes por su cuenta.
 * - No usa Navbar ni Footer: si el layout falló, podrían ser la causa.
 * - No admite `export const metadata` (es Client Component): el título se define con <title>.
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    reportClientError(error, 'app/global-error');
  }, [error]);

  const digest = getErrorDigest(error);

  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-8 bg-background px-4 py-12 font-sans text-foreground">
        <title>{`Error · ${siteConfig.name}`}</title>

        <Logo />

        <main className="w-full max-w-xl space-y-4">
          <ErrorState
            title="La aplicación no pudo cargar"
            message="Tuvimos un problema inesperado. Intenta de nuevo o vuelve al inicio."
            onRetry={retry}
            action={
              <Link href="/" className={buttonClassName('secondary')}>
                Volver al inicio
              </Link>
            }
          />
          {digest && <p className="text-center text-xs text-muted">Código de referencia: {digest}</p>}
        </main>
      </body>
    </html>
  );
}
