import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Fuentes de la app. Se definen en un solo lugar porque las usan dos documentos HTML distintos:
 * `app/layout.tsx` y `app/global-error.tsx` (que reemplaza al layout cuando este falla).
 */

/** Texto: sans-serif moderna y muy legible en pantallas pequeñas. */
export const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

/** Títulos: serif con carácter editorial, al estilo de una revista de viajes. */
export const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

export const fontVariables = `${jakarta.variable} ${fraunces.variable}`;
