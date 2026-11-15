// API pública del feature countries (segura para cliente). Ver AGENTS.md 1.5
// Los services NO se exportan aquí: están en ./server.ts

export { CountriesHero } from './components/CountriesHero';
export { CountryCard } from './components/CountryCard';
export { CountryDetail } from './components/CountryDetail';
export { CountryDetailSkeleton } from './components/CountryDetailSkeleton';
export { CountryGrid } from './components/CountryGrid';
export { CountryGridSkeleton } from './components/CountryGridSkeleton';
export { CountrySearch } from './components/CountrySearch';
export { useCountrySearch, SEARCH_DEBOUNCE_MS, type UseCountrySearchResult } from './hooks/useCountrySearch';
export { countriesQuerySchema, countryCodeSchema } from './schemas/country.schema';
export type { CountriesQuery, CountriesResponse, Country } from './types/country.types';
export { CENTRAL_AMERICA_BOUNDS, OUT_OF_REGION_MESSAGE, isInCentralAmerica } from './utils/centralAmericaBounds';
export { CENTRAL_AMERICA_CODES, COUNTRY_SEARCH_MAX_LENGTH } from './utils/constants';
export { filterCountries } from './utils/filterCountries';
export { formatPopulation, formatPopulationCompact } from './utils/formatPopulation';
export { getCountryLocation, type CountryLocation } from './utils/getCountryLocation';
export { POPULATION_FILTERS, matchesPopulation, type PopulationFilter } from './utils/populationFilters';
