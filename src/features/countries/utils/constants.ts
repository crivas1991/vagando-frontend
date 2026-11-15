/**
 * Países que Vagando considera "Centroamérica" (los 7 del istmo), por código ISO alpha-3.
 *
 * La subregión "Central America" de REST Countries sigue la clasificación de la ONU,
 * que también incluye a México. Esta lista blanca deja solo los países del istmo.
 */
export const CENTRAL_AMERICA_CODES = ['BLZ', 'CRI', 'SLV', 'GTM', 'HND', 'NIC', 'PAN'] as const;

/** Máximo de caracteres aceptados en la búsqueda de países. */
export const COUNTRY_SEARCH_MAX_LENGTH = 50;
