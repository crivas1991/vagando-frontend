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
        interactive && 'transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
