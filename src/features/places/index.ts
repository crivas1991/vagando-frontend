// API pública del feature places (segura para cliente). Ver AGENTS.md 1.5
// Los services NO se exportan aquí: están en ./server.ts

export { KindFilter } from './components/KindFilter';
export { PlaceCard } from './components/PlaceCard';
export { PlacesExplorer } from './components/PlacesExplorer';
export { PlacesList } from './components/PlacesList';
export { PlacesSkeleton } from './components/PlacesSkeleton';
export { usePlaces, type UsePlacesResult } from './hooks/usePlaces';
export { placesQuerySchema } from './schemas/place.schema';
export type { Place, PlacesQuery, PlacesResponse } from './types/place.types';
export { DEFAULT_PLACE_KIND, PLACE_KINDS, PLACE_KIND_VALUES, type PlaceKind } from './utils/placeKinds';
