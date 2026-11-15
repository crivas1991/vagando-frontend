import Link from 'next/link';

import { cn } from '@/shared/lib/cn';

import { buttonClassName } from './Button';

type EmptyStateProps = {
  title: string;
  message?: string;
  /** Acción útil para salir del estado vacío (AGENTS.md 3.7). */
  action?: {
    label: string;
    href: string;
  };
  className?: string;
};

export function EmptyState({ title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center sm:py-16',
        className,
      )}
    >
      {/* Brújula: ícono decorativo */}
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-12 text-primary">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>

      <div className="space-y-1">
        <p className="font-display text-lg font-semibold sm:text-xl">{title}</p>
        {message && <p className="mx-auto max-w-md text-sm text-muted sm:text-base">{message}</p>}
      </div>

      {action && (
        <Link href={action.href} className={buttonClassName('primary')}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
