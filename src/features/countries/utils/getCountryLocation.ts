import type { Country } from '@/features/countries/types/country.types';

export type CountryLocation = {
  /** Nombre del lugar al que corresponden las coordenadas. */
  name: string;
  lat: number;
  lon: number;
};

/**
 * Ubicación de referencia de un país: su capital si tiene coordenadas;
 * si no, el centro geográfico del país.
 * La usan las secciones de clima y lugares turísticos.
 */
export function getCountryLocation(country: Country): CountryLocation {
  const { capital } = country;

  if (capital && capital.lat !== null && capital.lng !== null) {
    return { name: capital.name, lat: capital.lat, lon: capital.lng };
  }

  return { name: country.name, lat: country.coordinates.lat, lon: country.coordinates.lng };
}
