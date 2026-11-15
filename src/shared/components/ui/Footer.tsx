import { siteConfig } from '@/shared/lib/site-config';

import { Logo } from './Logo';

/**
 * Pie de página con créditos de las fuentes de datos.
 * No muestra el año actual: con `cacheComponents`, leer la fecha en un Server Component
 * vuelve dinámica toda la ruta, y no vale la pena por un dato decorativo.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted">{siteConfig.description}</p>
        </div>

        <div className="space-y-3 md:justify-self-end">
          <h2 className="text-sm font-semibold">Datos proporcionados por</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            {siteConfig.attributions.map((source) => (
              <li key={source.name}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  {source.name}
                </a>
                {'license' in source && <span className="text-xs"> ({source.license})</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        {siteConfig.name} · Proyecto académico desarrollado con Vibe Coding
      </p>
    </footer>
  );
}
