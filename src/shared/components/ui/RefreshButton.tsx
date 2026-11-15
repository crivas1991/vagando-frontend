'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button, type ButtonVariant } from './Button';

type RefreshButtonProps = {
  label?: string;
  variant?: ButtonVariant;
};

/**
 * "Reintentar" para secciones renderizadas en el servidor (degradación elegante, AGENTS.md 2.10).
 * Un Server Component no puede pasar `onRetry` a `ErrorState` (las funciones no se serializan),
 * así que este botón vuelve a pedir la página al servidor con `router.refresh()` sin recargar el navegador.
 */
export function RefreshButton({ label = 'Reintentar', variant = 'primary' }: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button variant={variant} disabled={isPending} onClick={() => startTransition(() => router.refresh())}>
      {isPending ? 'Reintentando…' : label}
    </Button>
  );
}
