'use client';

import { useEffect, useId, useState, type MouseEvent, type ReactNode } from 'react';

type MobileMenuProps = {
  /** Links del menú (se renderizan en el servidor y llegan como children). */
  children: ReactNode;
};

/**
 * Menú hamburguesa para móvil. Se oculta desde el breakpoint `md`.
 * - `aria-expanded` y `aria-controls` para lectores de pantalla.
 * - Se cierra con Escape o al tocar un link.
 */
export function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cierra el menú cuando se toca cualquier link dentro del panel.
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('a')) setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary-hover hover:text-primary-foreground"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
          {isOpen ? (
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          id={panelId}
          onClick={handlePanelClick}
          className="absolute inset-x-0 top-full border-b border-border bg-surface px-4 pb-4 pt-2 shadow-lg"
        >
          <nav aria-label="Navegación principal (móvil)">{children}</nav>
        </div>
      )}
    </div>
  );
}
