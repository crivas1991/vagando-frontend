'use client';

import { useId, useState } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { Spinner } from '@/shared/components/ui/Spinner';
import { cn } from '@/shared/lib/cn';

import { useCountrySearch } from '@/features/countries/hooks/useCountrySearch';
import type { Country } from '@/features/countries/types/country.types';
import { COUNTRY_SEARCH_MAX_LENGTH } from '@/features/countries/utils/constants';
import {
  POPULATION_FILTERS,
  isPopulationFilter,
  matchesPopulation,
  type PopulationFilter,
} from '@/features/countries/utils/populationFilters';

import { CountryGrid } from './CountryGrid';
import { CountryGridSkeleton } from './CountryGridSkeleton';

/**
 * Buscador de países (Client Component).
 * - El texto se busca en el servidor (`/api/countries?q=`) con debounce.
 * - El filtro de población se aplica en el cliente sobre los resultados.
 * - Estados: skeleton en la primera carga, spinner en búsquedas siguientes, error con reintento y vacío.
 * - `initialCountries`: países que ya trae el servidor; con ellos no hay skeleton ni petición al abrir la página.
 */
export function CountrySearch({ initialCountries }: { initialCountries?: Country[] }) {
  const [query, setQuery] = useState('');
  const [population, setPopulation] = useState<PopulationFilter>('all');
  const { data, error, isLoading, retry } = useCountrySearch(query, initialCountries);

  const searchId = useId();
  const populationId = useId();

  const countries = (data ?? []).filter((country) => matchesPopulation(country.population, population));
  const hasFilters = query.trim() !== '' || population !== 'all';

  const clearFilters = () => {
    setQuery('');
    setPopulation('all');
  };

  return (
    <div className="space-y-6">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-4 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5"
      >
        <div className="space-y-1.5">
          <label htmlFor={searchId} className="text-sm font-semibold">
            Buscar destino
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={COUNTRY_SEARCH_MAX_LENGTH}
            placeholder="Nombre, capital o código (ej. Panamá, Managua, CRI)"
            autoComplete="off"
            className="min-h-11 w-full rounded-full border border-border bg-background px-4 text-base placeholder:text-muted focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={populationId} className="text-sm font-semibold">
            Población
          </label>
          <select
            id={populationId}
            value={population}
            onChange={(event) => {
              if (isPopulationFilter(event.target.value)) setPopulation(event.target.value);
            }}
            className="min-h-11 w-full rounded-full border border-border bg-background px-4 text-base focus:border-primary sm:w-56"
          >
            {POPULATION_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Resumen anunciado a lectores de pantalla cuando cambian los resultados */}
      <div className="flex min-h-6 items-center gap-3 text-sm text-muted" aria-live="polite">
        {isLoading && data !== null ? (
          <Spinner size="sm" label="Buscando destinos…" />
        ) : null}
        {!error && data !== null && (
          <p>
            {countries.length === 1 ? '1 destino encontrado' : `${countries.length} destinos encontrados`}
          </p>
        )}
      </div>

      {error ? (
        <ErrorState
          variant="section"
          title="No pudimos buscar destinos"
          message={error}
          onRetry={retry}
        />
      ) : data === null ? (
        <CountryGridSkeleton />
      ) : countries.length === 0 ? (
        <EmptyState
          title="No encontramos destinos"
          message={
            query.trim()
              ? `Ningún país coincide con "${query.trim()}" y el filtro de población elegido.`
              : 'Ningún país coincide con el filtro de población elegido.'
          }
        >
          {hasFilters && <Button onClick={clearFilters}>Limpiar filtros</Button>}
        </EmptyState>
      ) : (
        <div className={cn('transition-opacity', isLoading && 'opacity-60')}>
          <CountryGrid countries={countries} headingLevel="h2" />
        </div>
      )}
    </div>
  );
}
