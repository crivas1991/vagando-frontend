'use client';

// 'use client': se reexporta en el barrel `index.ts`, que también importan Server Components (AGENTS.md 2.8).

import { useCallback, useEffect, useState } from 'react';

import {
  FAVORITES_CHANGE_EVENT,
  FAVORITES_STORAGE_KEY,
  readFavorites,
  writeFavorites,
} from '@/features/favorites/utils/favoritesStorage';

export type UseFavoritesResult = {
  /** Códigos de los países favoritos, en el orden en que se agregaron. */
  favorites: string[];
  /** `false` hasta leer `localStorage` después del montaje (evita mostrar "sin favoritos" por un instante). */
  isReady: boolean;
  isFavorite: (code: string) => boolean;
  toggleFavorite: (code: string) => void;
  removeFavorite: (code: string) => void;
};

/**
 * Favoritos guardados en `localStorage` (AGENTS.md 3.5).
 *
 * - `useState` guarda la lista; empieza vacía, igual que en el servidor, así no hay errores de hidratación.
 * - `useEffect` lee `localStorage` SOLO después de montar, y se suscribe a los cambios:
 *   `FAVORITES_CHANGE_EVENT` (otros componentes de esta pestaña) y `storage` (otras pestañas).
 * - Cada escritura lee primero el valor actual, para no pisar cambios hechos en otro componente.
 */
export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setFavorites(readFavorites());
      setIsReady(true);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === FAVORITES_STORAGE_KEY) sync();
    };

    sync();
    window.addEventListener(FAVORITES_CHANGE_EVENT, sync);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(FAVORITES_CHANGE_EVENT, sync);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const isFavorite = useCallback((code: string) => favorites.includes(code), [favorites]);

  const toggleFavorite = useCallback((code: string) => {
    const current = readFavorites();
    writeFavorites(current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);
  }, []);

  const removeFavorite = useCallback((code: string) => {
    writeFavorites(readFavorites().filter((item) => item !== code));
  }, []);

  return { favorites, isReady, isFavorite, toggleFavorite, removeFavorite };
}
