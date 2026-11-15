const compactFormatter = new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 });
const fullFormatter = new Intl.NumberFormat('es');

/** 6338193 → "6,3 M" */
export function formatPopulationCompact(population: number): string {
  return compactFormatter.format(population);
}

/** 6338193 → "6.338.193" */
export function formatPopulation(population: number): string {
  return fullFormatter.format(population);
}
