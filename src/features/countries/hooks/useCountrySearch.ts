'use client';

// 'use client': este hook se reexporta en el barrel `index.ts`, que también importan Server Components.
// La directiva hace que el servidor solo reciba una referencia al módulo, sin ejecutar `useState`/`useEffect`.

import { useCallback, useEffect, useState } from 'react';

import { ApiRequestError, fetchApi } from '@/shared/lib/fetch-api';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/lib/read-api-error';

import type { CountriesResponse, Country } from '@/features/countries/types/country.types';

/** Espera tras la última tecla antes de consultar la API. */
export const SEARCH_DEBOUNCE_MS = 400;

type SearchResult = {
  /** Búsqueda e intento a los que corresponde este resultado. */
  query: string;
  attempt: number;
  data: Country[] | null;
  error: string | null;
};

export type UseCountrySearchResult = {
  data: Country[] | null;
  error: string | null;
  isLoading: boolean;
  /** Repite la última búsqueda (para el botón "Reintentar"). */
  retry: () => void;
};

function isCountriesResponse(body: unknown): body is CountriesResponse {
  return typeof body === 'object' && body !== null && 'countries' in body && Array.isArray(body.countries);
}

/**
 * Busca países en `GET /api/countries?q=` (AGENTS.md 2.8 y 3.5).
 *
 * - Debounce de 400 ms: solo consulta cuando el usuario deja de escribir.
 *   La primera carga (búsqueda vacía) es inmediata.
 * - Cancela la petición anterior con `AbortController` en el cleanup del efecto.
 * - `isLoading` es DERIVADO: está cargando mientras el último resultado no corresponde a la búsqueda
 *   actual. Así el efecto nunca llama a `setState` de forma síncrona (regla `react-hooks/set-state-in-effect`).
 * - Mientras carga, conserva los datos anteriores para que la grilla no parpadee.
 * - `initialCountries` (Paso 14): si la página ya trae los países desde el servidor, la búsqueda vacía
 *   los usa directamente. Así no hay skeleton ni petición al abrir `/explore`, y la API solo se
 *   consulta cuando el usuario escribe.
 */
export function useCountrySearch(rawQuery: string, initialCountries?: Country[]): UseCountrySearchResult {
  const query = rawQuery.trim();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<SearchResult | null>(null);

  const usesInitialData = query === '' && initialCountries !== undefined;

  useEffect(() => {
    if (usesInitialData) return;

    const controller = new AbortController();

    const timer = setTimeout(
      async () => {
        try {
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          const url = params.size > 0 ? `/api/countries?${params}` : '/api/countries';

          const body = await fetchApi(url, controller.signal);
          if (!isCountriesResponse(body)) throw new ApiRequestError(DEFAULT_ERROR_MESSAGE);

          setResult({ query, attempt, data: body.countries, error: null });
        } catch (error) {
          // Cancelación (el usuario siguió escribiendo o salió de la página): no es un error.
          if (controller.signal.aborted) return;
          setResult({
            query,
            attempt,
            data: null,
            // Solo se muestran mensajes preparados para el usuario, nunca errores técnicos.
            error: error instanceof ApiRequestError ? error.message : DEFAULT_ERROR_MESSAGE,
          });
        }
      },
      query ? SEARCH_DEBOUNCE_MS : 0,
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, attempt, usesInitialData]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  if (usesInitialData) {
    return { data: initialCountries, error: null, isLoading: false, retry };
  }

  const isLoading = result === null || result.query !== query || result.attempt !== attempt;

  return {
    // Mientras llega la primera búsqueda se siguen mostrando los países iniciales (atenuados).
    data: result?.data ?? initialCountries ?? null,
    error: isLoading ? null : (result?.error ?? null),
    isLoading,
    retry,
  };
}
