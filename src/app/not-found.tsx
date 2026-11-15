import type { Metadata } from 'next';
import Link from 'next/link';

import { buttonClassName } from '@/shared/components/ui/Button';

export const metadata: Metadata = {
  title: 'Página no encontrada',
};

/**
 * Página 404 (AGENTS.md 2.7). Se muestra cuando:
 * - la URL no coincide con ninguna ruta, o
 * - una página llama a `notFound()` (por ejemplo, /country/XXX con un código inexistente).
 */
export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-8 text-center sm:py-16">
      {/* Mapa doblado con una ruta que se pierde: ilustración decorativa */}
      <svg aria-hidden="true" viewBox="0 0 120 96" fill="none" className="w-40 sm:w-48">
        <path d="M8 16 40 6l40 10 32-10v74l-32 10-40-10L8 90V16Z" className="fill-surface stroke-border" strokeWidth="2" strokeLinejoin="round" />
        <path d="M40 6v74M80 16v74" className="stroke-border" strokeWidth="2" />
        <path d="M20 70c8-14 18-6 26-18s16-6 24-14" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 6" />
        <path d="m78 30 10 10m0-10L78 40" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Error 404</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Este destino no está en el mapa</h1>
        <p className="text-muted sm:text-lg">
          La página que buscas no existe o cambió de lugar. Pero Centroamérica tiene mucho más por descubrir.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/" className={buttonClassName('primary')}>
          Volver al inicio
        </Link>
        <Link href="/explore" className={buttonClassName('secondary')}>
          Explorar destinos
        </Link>
      </div>
    </section>
  );
}
