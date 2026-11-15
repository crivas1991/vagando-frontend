'use client';

import { usePathname } from 'next/navigation';

import { NavLinkList } from './NavLinkList';

type ActiveNavLinksProps = {
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Marca el link de la ruta actual.
 *
 * IMPORTANTE: con `cacheComponents`, `usePathname` se suspende en rutas con params dinámicos
 * (por ejemplo, /country/[code]). Este componente SIEMPRE debe renderizarse dentro de <Suspense>,
 * o el build falla. Ver node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-pathname.md
 */
export function ActiveNavLinks({ orientation }: ActiveNavLinksProps) {
  const pathname = usePathname();
  return <NavLinkList activePath={pathname} orientation={orientation} />;
}
