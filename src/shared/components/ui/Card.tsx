import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type CardProps = {
  children: ReactNode;
  /** Etiqueta semántica: `article` para tarjetas independientes, `li` dentro de listas. */
  as?: 'div' | 'article' | 'section' | 'li';
  /** `none` para tarjetas con imagen a sangre. */
  padding?: 'none' | 'md';
  /** Agrega efecto hover (para tarjetas que son enlaces). */
  interactive?: boolean;
  className?: string;
};

export function Card({ children, as: Tag = 'div', padding = 'md', interactive = false, className }: CardProps) {
  return (
    <Tag
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-surface shadow-sm',
        padding === 'md' && 'p-5 sm:p-6',
        interactive && [
          'transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0',
          // Foco visible (AGENTS.md 3.6): `overflow-hidden` recortaría el contorno del enlace interno,
          // así que el anillo se dibuja en la tarjeta completa cuando su enlace recibe foco con teclado.
          'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background',
        ].join(' '),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
