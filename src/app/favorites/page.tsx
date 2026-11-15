import type { Metadata } from 'next';

import { getCentralAmericaCountries } from '@/features/countries/server';
import { FavoritesList } from '@/features/favorites';

export const metadata: Metadata = {
  title: 'Mis favoritos',
  description: 'Los destinos de Centroamérica que guardaste para tu próximo viaje.',
  alternates: { canonical: '/favorites' },
  // Página personal (localStorage): para un buscador siempre está vacía, así que no se indexa.
  robots: { index: false, follow: true },
};

/**
 * Favoritos (Server Component). Obtiene los países (lista cacheada, sin peticiones extra)
 * y `FavoritesList` (cliente) muestra solo los guardados en `localStorage`.
 */
export default async function FavoritesPage() {
  const countries = await getCentralAmericaCountries();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Favoritos</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Tus destinos guardados</h1>
        <p className="max-w-2xl text-muted">
          Se guardan en este navegador. Toca el corazón de un destino para quitarlo de la lista.
        </p>
      </header>

      <FavoritesList countries={countries} />
    </div>
  );
}
