import { Suspense } from 'react';

import { ActiveNavLinks } from './ActiveNavLinks';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavLinkList } from './NavLinkList';

/**
 * Barra de navegación principal (Server Component).
 * Solo las partes interactivas son de cliente: el link activo (`ActiveNavLinks`) y el menú móvil (`MobileMenu`).
 * Mientras se resuelve la ruta actual, el fallback muestra los mismos links sin marcar el activo.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="page-container relative flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label="Navegación principal" className="hidden md:block">
          <Suspense fallback={<NavLinkList />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>

        <MobileMenu>
          <Suspense fallback={<NavLinkList orientation="vertical" />}>
            <ActiveNavLinks orientation="vertical" />
          </Suspense>
        </MobileMenu>
      </div>
    </header>
  );
}
