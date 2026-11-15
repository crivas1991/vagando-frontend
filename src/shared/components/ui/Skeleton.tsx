import { cn } from '@/shared/lib/cn';

type SkeletonProps = {
  /** Define tamaño y forma: por ejemplo `h-4 w-32` o `aspect-video w-full`. */
  className?: string;
};

/**
 * Bloque de carga que imita la forma del contenido final (AGENTS.md 3.7).
 * Es decorativo (`aria-hidden`): el contenedor que lo usa debe anunciar la carga
 * con `role="status"` y un texto `sr-only`.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-lg bg-surface-muted motion-safe:animate-pulse', className)}
    />
  );
}
