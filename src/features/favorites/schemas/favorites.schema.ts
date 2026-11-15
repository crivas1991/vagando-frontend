import { z } from 'zod';

/** Máximo de favoritos guardados (protege contra datos corruptos o manipulados). */
export const MAX_FAVORITES = 50;

/**
 * Lo que se guarda en `localStorage`: solo los códigos ISO alpha-3 de los países (por ejemplo, `["SLV","PAN"]`).
 * Los datos del país se obtienen siempre de REST Countries, así nunca quedan desactualizados.
 * Se valida al leer porque `localStorage` puede tener cualquier cosa (AGENTS.md 2.4).
 */
export const storedFavoritesSchema = z
  .array(z.string().regex(/^[A-Z]{3}$/))
  .max(MAX_FAVORITES)
  .transform((codes) => [...new Set(codes)]);
