/**
 * Datos mínimos de un país para mostrarlo en la lista de favoritos.
 * Es un subconjunto estructural de `Country` (feature countries): la página puede pasar países
 * completos sin que `favorites` dependa de `countries` (evita una dependencia circular, AGENTS.md 1.4).
 */
export type FavoriteCountry = {
  code: string;
  name: string;
  population: number;
  capital: { name: string } | null;
  flag: { png: string; alt: string };
};
