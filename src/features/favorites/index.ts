// API pública del feature favorites (segura para cliente). Ver AGENTS.md 1.5
// Este feature no tiene código de servidor (usa localStorage), por eso no tiene server.ts.
// IMPORTANTE: favorites NO importa de countries (countries sí importa FavoriteButton). Así se evita un ciclo.

export { FavoriteButton } from './components/FavoriteButton';
export { FavoritesList } from './components/FavoritesList';
export { useFavorites, type UseFavoritesResult } from './hooks/useFavorites';
export { MAX_FAVORITES } from './schemas/favorites.schema';
export type { FavoriteCountry } from './types/favorites.types';
export { FAVORITES_STORAGE_KEY } from './utils/favoritesStorage';
