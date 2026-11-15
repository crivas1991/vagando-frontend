import Image from 'next/image';

import { cn } from '@/shared/lib/cn';

import { PLACE_KINDS, type PlaceKind } from '@/features/places/utils/placeKinds';

type PlaceImageProps = {
  name: string;
  kind: PlaceKind;
  imageUrl: string | null;
};

/** Fondo de la imagen de respaldo según la categoría (paleta de Vagando). */
const FALLBACK_STYLES: Record<PlaceKind, string> = {
  sights: 'from-primary to-primary-hover',
  museums: 'from-accent-strong to-accent',
  nature: 'from-success to-primary',
  beaches: 'from-primary to-accent',
  food: 'from-accent to-accent-strong',
};

/**
 * Foto del lugar o, si no hay, una imagen de respaldo temática (AGENTS.md 4.4).
 * Geoapify casi nunca trae fotos, así que el respaldo es el caso más común.
 */
export function PlaceImage({ name, kind, imageUrl }: PlaceImageProps) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        // Respaldo decorativo: el nombre del lugar ya está en el título de la tarjeta.
        <div aria-hidden="true" className={cn('flex size-full items-center justify-center bg-gradient-to-br', FALLBACK_STYLES[kind])}>
          <svg viewBox="0 0 400 225" preserveAspectRatio="none" className="absolute inset-0 size-full text-white opacity-15">
            <path d="M0 170 80 110l60 40 90-80 70 60 100-70v165H0Z" fill="currentColor" />
            <path d="M0 200c60-20 120-20 180 0s130 20 220-5v30H0Z" fill="currentColor" />
          </svg>
          <span className="relative text-5xl drop-shadow-sm">{PLACE_KINDS[kind].emoji}</span>
        </div>
      )}
    </div>
  );
}
