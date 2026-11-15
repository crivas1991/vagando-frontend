'use client';

import { cn } from '@/shared/lib/cn';

import { PLACE_KINDS, PLACE_KIND_VALUES, type PlaceKind } from '@/features/places/utils/placeKinds';

type KindFilterProps = {
  value: PlaceKind;
  onChange: (kind: PlaceKind) => void;
  /** Categorías que no se ofrecen (por ejemplo, la actual en el estado vacío). */
  exclude?: PlaceKind[];
};

/**
 * Filtro de categorías (Client Component).
 * Botones con `aria-pressed`; en móvil se desplaza en horizontal.
 */
export function KindFilter({ value, onChange, exclude = [] }: KindFilterProps) {
  const kinds = PLACE_KIND_VALUES.filter((kind) => !exclude.includes(kind));

  return (
    <div role="group" aria-label="Categoría de lugares" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {kinds.map((kind) => {
        const isActive = kind === value;
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(kind)}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface text-foreground hover:border-primary-hover hover:bg-primary-hover hover:text-primary-foreground',
            )}
          >
            <span aria-hidden="true">{PLACE_KINDS[kind].emoji}</span>
            {PLACE_KINDS[kind].label}
          </button>
        );
      })}
    </div>
  );
}
