import type { Metadata } from 'next';

import { CountrySearch } from '@/features/countries';
import { getCentralAmericaCountries } from '@/features/countries/server';

export const metadata: Metadata = {
  title: 'Explorar destinos',
  description: 'Busca países de Centroamérica por nombre, capital o código y fíltralos por población.',
  alternates: { canonical: '/explore' },
  openGraph: { url: '/explore' },
};

/**
 * Explorar (Server Component). Los países llegan ya renderizados desde el servidor (lista cacheada),
 * así que la página se prerenderiza con contenido: sin skeleton, sin petición inicial y visible para SEO.
 * `CountrySearch` (cliente) consulta `/api/countries` solo cuando el usuario escribe (AGENTS.md 3.4).
 */
export default async function ExplorePage() {
  const countries = await getCentralAmericaCountries();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Explorar</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Encuentra tu próximo destino</h1>
        <p className="max-w-2xl text-muted">
          Busca por nombre, capital o código de país, y filtra por población para descubrir el destino ideal.
        </p>
      </header>

      <CountrySearch initialCountries={countries} />
    </div>
  );
}
