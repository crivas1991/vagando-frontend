/**
 * Categorías de lugares de Vagando y su equivalente en Geoapify.
 *
 * `radiusKm` varía por categoría: los museos y restaurantes están en la ciudad,
 * pero las playas y la naturaleza suelen estar lejos de la capital
 * (desde Ciudad de Guatemala, la costa más cercana queda a más de 80 km).
 */
export const PLACE_KINDS = {
  sights: { label: 'Atractivos', emoji: '🏛️', geoapifyCategory: 'tourism.sights', radiusKm: 15 },
  museums: { label: 'Museos', emoji: '🖼️', geoapifyCategory: 'entertainment.museum', radiusKm: 15 },
  nature: { label: 'Naturaleza', emoji: '🌋', geoapifyCategory: 'natural', radiusKm: 60 },
  beaches: { label: 'Playas', emoji: '🏖️', geoapifyCategory: 'beach', radiusKm: 120 },
  food: { label: 'Gastronomía', emoji: '🍽️', geoapifyCategory: 'catering.restaurant', radiusKm: 10 },
} as const;

export type PlaceKind = keyof typeof PLACE_KINDS;

/** Valores válidos de `kind`, en el orden en que se muestran en el filtro. */
export const PLACE_KIND_VALUES = ['sights', 'museums', 'nature', 'beaches', 'food'] as const satisfies readonly PlaceKind[];

export const DEFAULT_PLACE_KIND: PlaceKind = 'sights';

/** Máximo de lugares por consulta. */
export const PLACES_LIMIT = 24;
