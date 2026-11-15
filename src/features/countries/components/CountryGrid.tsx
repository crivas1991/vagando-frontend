import { EmptyState } from '@/shared/components/ui/EmptyState';

import type { Country } from '@/features/countries/types/country.types';

import { CountryCard } from './CountryCard';

type CountryGridProps = {
  countries: Country[];
  headingLevel?: 'h2' | 'h3';
  /** Mensaje cuando no hay países (AGENTS.md 3.7). */
  emptyTitle?: string;
  emptyMessage?: string;
};

/** Grilla responsive de países: 1 columna en móvil, 2 en tablet y 3 en escritorio. */
export function CountryGrid({
  countries,
  headingLevel,
  emptyTitle = 'No encontramos países',
  emptyMessage = 'Intenta con otro nombre o explora todos los destinos.',
}: CountryGridProps) {
  if (countries.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} action={{ label: 'Ver todos los destinos', href: '/explore' }} />;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {countries.map((country) => (
        <li key={country.code}>
          <CountryCard country={country} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
