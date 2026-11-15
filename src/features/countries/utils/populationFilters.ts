export const POPULATION_FILTERS = [
  { value: 'all', label: 'Cualquier población' },
  { value: 'small', label: 'Menos de 5 millones' },
  { value: 'medium', label: 'De 5 a 10 millones' },
  { value: 'large', label: 'Más de 10 millones' },
] as const;

export type PopulationFilter = (typeof POPULATION_FILTERS)[number]['value'];

const MILLION = 1_000_000;

export function isPopulationFilter(value: string): value is PopulationFilter {
  return POPULATION_FILTERS.some((filter) => filter.value === value);
}

export function matchesPopulation(population: number, filter: PopulationFilter): boolean {
  switch (filter) {
    case 'small':
      return population < 5 * MILLION;
    case 'medium':
      return population >= 5 * MILLION && population <= 10 * MILLION;
    case 'large':
      return population > 10 * MILLION;
    case 'all':
      return true;
  }
}
