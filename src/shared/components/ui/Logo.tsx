import Link from 'next/link';

import { siteConfig } from '@/shared/lib/site-config';

export function Logo() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg" aria-label={`${siteConfig.name}, ir al inicio`}>
      {/* Pin de mapa con ola: ícono decorativo */}
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0">
        <path d="M16 2C10.5 2 6 6.4 6 11.9 6 19.3 16 30 16 30s10-10.7 10-18.1C26 6.4 21.5 2 16 2Z" className="fill-primary" />
        <path d="M10.5 13.5c1.8-1.6 3.7-1.6 5.5 0s3.7 1.6 5.5 0" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-primary-foreground" />
        <circle cx="16" cy="9" r="2.2" className="fill-accent" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
