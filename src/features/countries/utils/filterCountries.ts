import type { Country } from '@/features/countries/types/country.types';

/** Quita tildes y pasa a minúsculas: "Panamá" → "panama". */
function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

/**
 * Filtra países por nombre (español o inglés), nombre oficial, capital o código.
 * Ignora mayúsculas y tildes. Sin búsqueda, devuelve todos.
 */
export function filterCountries(countries: Country[], query?: string): Country[] {
  const needle = normalize(query?.trim() ?? '');
  if (!needle) return countries;

  return countries.filter((country) =>
    [country.name, country.nameEn, country.officialName, country.capital?.name ?? '', country.code]
      .map(normalize)
      .some((value) => value.includes(needle)),
  );
}
