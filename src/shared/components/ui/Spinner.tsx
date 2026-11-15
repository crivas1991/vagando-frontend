import { cn } from '@/shared/lib/cn';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  /** Texto para lectores de pantalla. */
  label?: string;
  className?: string;
};

const sizes = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
} as const;

export function Spinner({ size = 'md', label = 'Cargando…', className }: SpinnerProps) {
  return (
    <span role="status" className={cn('inline-flex items-center text-primary', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={cn(sizes[size], 'motion-safe:animate-spin')}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
