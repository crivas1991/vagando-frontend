import type { Metadata } from 'next';

import { CountrySearch } from '@/features/countries';

export const metadata: Metadata = {
  title: 'Explorar destinos',
  description: 'Busca países de Centroamérica por nombre, capital o código y fíltralos por población.',
};

/**
 * Explorar (Server Component). El encabezado se prerenderiza en el servidor
 * y solo el buscador (`CountrySearch`) es interactivo en el cliente (AGENTS.md 3.4).
 */
export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-strong">Explorar</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Encuentra tu próximo destino</h1>
        <p className="max-w-2xl text-muted">
          Busca por nombre, capital o código de país, y filtra por población para descubrir el destino ideal.
        </p>
      </header>

      <CountrySearch />
    </div>
  );
}
