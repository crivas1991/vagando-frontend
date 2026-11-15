import { CENTRAL_AMERICA_CODES } from '@/features/countries/utils/constants';

type BoundingBox = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

/**
 * Rectángulo geográfico de cada país de Centroamérica, con un pequeño margen (~10 km).
 * Incluye islas: Cayos de Belice, Islas del Cisne (Honduras), Corn Islands (Nicaragua)
 * e Isla del Coco (Costa Rica).
 *
 * Es una aproximación: un rectángulo puede cubrir una franja de un país vecino o de mar,
 * pero basta para impedir que `/api/places` y `/api/weather` se usen con coordenadas
 * de cualquier parte del mundo (lo que agotaría la cuota de las APIs).
 */
export const CENTRAL_AMERICA_BOUNDS: Record<(typeof CENTRAL_AMERICA_CODES)[number], BoundingBox> = {
  BLZ: { minLat: 15.8, maxLat: 18.6, minLon: -89.3, maxLon: -87.3 },
  GTM: { minLat: 13.6, maxLat: 17.9, minLon: -92.3, maxLon: -88.1 },
  SLV: { minLat: 13.1, maxLat: 14.5, minLon: -90.2, maxLon: -87.6 },
  HND: { minLat: 12.9, maxLat: 17.5, minLon: -89.4, maxLon: -83.1 },
  NIC: { minLat: 10.7, maxLat: 15.1, minLon: -87.7, maxLon: -82.6 },
  CRI: { minLat: 5.4, maxLat: 11.3, minLon: -87.2, maxLon: -82.5 },
  PAN: { minLat: 7.1, maxLat: 9.7, minLon: -83.1, maxLon: -77.1 },
};

export const OUT_OF_REGION_MESSAGE = 'Las coordenadas deben estar dentro de uno de los países de Centroamérica.';

/** `true` si las coordenadas caen dentro de alguno de los 7 países de Centroamérica. */
export function isInCentralAmerica(lat: number, lon: number): boolean {
  return Object.values(CENTRAL_AMERICA_BOUNDS).some(
    (box) => lat >= box.minLat && lat <= box.maxLat && lon >= box.minLon && lon <= box.maxLon,
  );
}
