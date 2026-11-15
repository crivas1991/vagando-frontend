/**
 * Configuración general del sitio: nombre, navegación y créditos.
 * Es la única fuente de verdad para Navbar, Footer y metadata.
 */

export type NavItem = {
  href: string;
  label: string;
};

export type Attribution = {
  name: string;
  href: string;
  license?: string;
};

export const siteConfig = {
  name: 'Vagando',
  tagline: 'Turismo en Centroamérica',
  description:
    'Descubre los destinos de Centroamérica: información de cada país, clima en tiempo real y lugares turísticos para planear tu próximo viaje.',
  nav: [
    { href: '/', label: 'Inicio' },
    { href: '/explore', label: 'Explorar' },
    { href: '/favorites', label: 'Favoritos' },
  ] satisfies NavItem[],
  /** Créditos de las fuentes de datos (Open-Meteo y OpenStreetMap exigen atribución). */
  attributions: [
    { name: 'REST Countries', href: 'https://restcountries.com' },
    { name: 'Open-Meteo', href: 'https://open-meteo.com', license: 'CC BY 4.0' },
    { name: 'Geoapify', href: 'https://www.geoapify.com' },
    { name: 'OpenStreetMap', href: 'https://www.openstreetmap.org/copyright', license: 'ODbL' },
  ] satisfies Attribution[],
} as const;
