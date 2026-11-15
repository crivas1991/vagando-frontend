import Link from 'next/link';

import { cn } from '@/shared/lib/cn';
import { siteConfig } from '@/shared/lib/site-config';

type NavLinkListProps = {
  /** Ruta actual. Si no se conoce (por ejemplo, en el fallback de Suspense), ningún link se marca como activo. */
  activePath?: string;
  orientation?: 'horizontal' | 'vertical';
};

function isActive(href: string, activePath?: string): boolean {
  if (!activePath) return false;
  return href === '/' ? activePath === '/' : activePath === href || activePath.startsWith(`${href}/`);
}

/** Lista de links de navegación. Es presentacional: sirve tanto en servidor como en cliente. */
export function NavLinkList({ activePath, orientation = 'horizontal' }: NavLinkListProps) {
  return (
    <ul className={cn('flex', orientation === 'horizontal' ? 'items-center gap-1' : 'flex-col gap-1')}>
      {siteConfig.nav.map(({ href, label }) => {
        const active = isActive(href, activePath);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors',
                orientation === 'vertical' && 'w-full text-base',
                active ? 'bg-primary-soft text-foreground' : 'text-muted hover:bg-surface-muted hover:text-foreground',
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
