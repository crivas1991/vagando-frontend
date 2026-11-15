import { logger } from '@/shared/lib/logger';

import { MAX_FAVORITES, storedFavoritesSchema } from '@/features/favorites/schemas/favorites.schema';

export const FAVORITES_STORAGE_KEY = 'vagando:favorites';

/** Evento para sincronizar todos los botones y listas de la pestaña actual. */
export const FAVORITES_CHANGE_EVENT = 'vagando:favorites-change';

/**
 * Copia en memoria: si `localStorage` no está disponible (modo incógnito estricto, almacenamiento lleno
 * o bloqueado), los favoritos siguen funcionando durante la sesión.
 */
let memoryFavorites: string[] = [];

/**
 * Lee y valida los favoritos. SOLO se llama desde el navegador (dentro de `useEffect` o de eventos),
 * nunca durante el render, para evitar errores de hidratación (AGENTS.md 3.5).
 */
export function readFavorites(): string[] {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch (error) {
    // Excepción permitida por AGENTS.md 2.9: se registra y se usa la copia en memoria.
    logger.warn('localStorage no disponible al leer favoritos; se usa la copia en memoria', error);
    return memoryFavorites;
  }

  if (raw === null) return memoryFavorites;

  try {
    const parsed = storedFavoritesSchema.safeParse(JSON.parse(raw));
    if (parsed.success) {
      memoryFavorites = [...new Set(parsed.data)];
      return memoryFavorites;
    }
    logger.warn('Favoritos guardados con formato inválido; se reinician', parsed.error.issues);
  } catch (error) {
    logger.warn('Favoritos guardados no son JSON válido; se reinician', error);
  }

  memoryFavorites = [];
  return memoryFavorites;
}

/** Guarda los favoritos y avisa a los demás componentes de la pestaña. */
export function writeFavorites(codes: string[]): void {
  memoryFavorites = codes.slice(0, MAX_FAVORITES);

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(memoryFavorites));
  } catch (error) {
    // Excepción permitida por AGENTS.md 2.9: los favoritos quedan solo en memoria durante la sesión.
    logger.warn('No se pudieron guardar los favoritos en localStorage; quedan solo en memoria', error);
  }

  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}
