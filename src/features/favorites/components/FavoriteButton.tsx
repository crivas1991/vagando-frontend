'use client';

import { cn } from '@/shared/lib/cn';

import { useFavorites } from '@/features/favorites/hooks/useFavorites';

type FavoriteButtonProps = {
  code: string;
  /** Nombre del país, para el texto accesible ("Agregar El Salvador a favoritos"). */
  name: string;
  /** `icon`: corazón flotante sobre una tarjeta. `full`: botón con texto (página de detalle). */
  variant?: 'icon' | 'full';
  className?: string;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
      <path
        d="M12 20.5s-7.5-4.6-9.4-9.3C1.3 7.9 3.4 4.5 6.9 4.5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.5 0 5.6 3.4 4.3 6.7-1.9 4.7-9.4 9.3-9.4 9.3Z"
        className={cn('stroke-current', filled ? 'fill-current' : 'fill-none')}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Botón de favorito (Client Component). Usa `aria-pressed` para anunciar el estado.
 * Hasta leer `localStorage` se muestra deshabilitado, para que el primer clic no use un estado incorrecto.
 */
export function FavoriteButton({ code, name, variant = 'icon', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isReady } = useFavorites();
  const active = isFavorite(code);
  const label = active ? `Quitar ${name} de favoritos` : `Agregar ${name} a favoritos`;

  if (variant === 'full') {
    return (
      <button
        type="button"
        aria-pressed={active}
        disabled={!isReady}
        onClick={() => toggleFavorite(code)}
        className={cn(
          'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors disabled:opacity-50',
          active
            ? 'border-accent bg-accent-soft text-accent-strong hover:border-primary-hover hover:bg-primary-hover hover:text-primary-foreground'
            : 'border-border bg-surface text-foreground hover:border-primary-hover hover:bg-primary-hover hover:text-primary-foreground',
          className,
        )}
      >
        <HeartIcon filled={active} />
        {active ? 'En tus favoritos' : 'Guardar en favoritos'}
        <span className="sr-only"> ({label})</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      disabled={!isReady}
      onClick={() => toggleFavorite(code)}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface/90 shadow-sm backdrop-blur transition-colors disabled:opacity-50',
        active ? 'text-accent' : 'text-muted',
        'hover:border-primary-hover hover:bg-primary-hover hover:text-primary-foreground',
        className,
      )}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
