import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { Button } from './Button';

type ErrorStateProps = {
  title?: string;
  /** Mensaje seguro para el usuario. Nunca pasar `error.message` crudo (AGENTS.md 2.7). */
  message: string;
  /**
   * Muestra el botón "Reintentar". Solo se puede pasar desde un Client Component
   * (por ejemplo, `reset` en `error.tsx`), porque las funciones no se serializan.
   */
  onRetry?: () => void;
  retryLabel?: string;
  /** Acción extra, por ejemplo un enlace "Volver al inicio". */
  action?: ReactNode;
  /** `section` para errores de una sola sección de la página (degradación elegante). */
  variant?: 'page' | 'section';
  className?: string;
};

/**
 * Estado de error reutilizable (AGENTS.md 2.7 y 2.10).
 * No lleva 'use client': si se usa sin `onRetry` en un Server Component, no agrega JavaScript al cliente.
 */
export function ErrorState({
  title = 'Algo salió mal',
  message,
  onRetry,
  retryLabel = 'Reintentar',
  action,
  variant = 'page',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border border-danger/30 bg-danger-soft text-center',
        variant === 'page' ? 'px-6 py-12 sm:py-16' : 'px-4 py-8',
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-10 text-danger">
        <path
          d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="space-y-1">
        <p className="font-display text-lg font-semibold sm:text-xl">{title}</p>
        <p className="mx-auto max-w-md text-sm text-muted sm:text-base">{message}</p>
      </div>

      {(onRetry || action) && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {onRetry && <Button onClick={onRetry}>{retryLabel}</Button>}
          {action}
        </div>
      )}
    </div>
  );
}
