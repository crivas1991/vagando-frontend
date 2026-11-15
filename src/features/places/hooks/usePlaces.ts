'use client';

// 'use client': se reexporta en el barrel `index.ts`, que también importan Server Components (AGENTS.md 2.8).

import { useCallback, useEffect, useState } from 'react';

import { ApiRequestError, fetchApi } from '@/shared/lib/fetch-api';
import { DEFAULT_ERROR_MESSAGE } from '@/shared/lib/read-api-error';

import type { Place, PlacesResponse } from '@/features/places/types/place.types';
import type { PlaceKind } from '@/features/places/utils/placeKinds';

type PlacesResult = {
  /** Consulta a la que corresponde este resultado (lat, lon, categoría e intento). */
  key: string;
  kind: PlaceKind;
  data: Place[] | null;
  error: string | null;
};

export type UsePlacesResult = {
  data: Place[] | null;
  /** Categoría a la que pertenecen los datos actuales (puede diferir de la pedida mientras carga). */
  dataKind: PlaceKind | null;
  error: string | null;
  isLoading: boolean;
  retry: () => void;
};

function isPlacesResponse(body: unknown): body is PlacesResponse {
  return typeof body === 'object' && body !== null && 'places' in body && Array.isArray(body.places);
}

/**
 * Lugares turísticos de una categoría desde `GET /api/places` (AGENTS.md 2.8 y 3.5).
 *
 * - `useEffect` consulta cada vez que cambia la categoría o se reintenta.
 * - Cancela la petición anterior con `AbortController` (por ejemplo, si el usuario cambia rápido de categoría).
 * - `isLoading` es derivado: no hay `setState` síncrono dentro del efecto.
 * - Mientras carga otra categoría, conserva los datos anteriores para que la grilla no parpadee.
 */
export function usePlaces(lat: number, lon: number, kind: PlaceKind): UsePlacesResult {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<PlacesResult | null>(null);

  const key = `${lat}|${lon}|${kind}|${attempt}`;

  useEffect(() => {
    const controller = new AbortController();
    const requestKey = `${lat}|${lon}|${kind}|${attempt}`;

    const load = async () => {
      try {
        const params = new URLSearchParams({ lat: String(lat), lon: String(lon), kind });
        const body = await fetchApi(`/api/places?${params}`, controller.signal);
        if (!isPlacesResponse(body)) throw new ApiRequestError(DEFAULT_ERROR_MESSAGE);

        setResult({ key: requestKey, kind, data: body.places, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        setResult({
          key: requestKey,
          kind,
          data: null,
          error: error instanceof ApiRequestError ? error.message : DEFAULT_ERROR_MESSAGE,
        });
      }
    };

    void load();
    return () => controller.abort();
  }, [lat, lon, kind, attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  const isLoading = result?.key !== key;

  return {
    data: result?.data ?? null,
    dataKind: result?.kind ?? null,
    error: isLoading ? null : (result?.error ?? null),
    isLoading,
    retry,
  };
}
