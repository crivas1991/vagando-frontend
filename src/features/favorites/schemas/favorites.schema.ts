// `zod/mini` y no `zod` (Paso 14): este schema viaja al navegador (lo usa `FavoriteButton` en casi todas
// las páginas). La versión completa de zod sumaba ~30 KB gzip al JavaScript del cliente.
import * as z from 'zod/mini';

/** Máximo de favoritos guardados (protege contra datos corruptos o manipulados). */
export const MAX_FAVORITES = 50;

/**
 * Lo que se guarda en `localStorage`: solo los códigos ISO alpha-3 de los países (por ejemplo, `["SLV","PAN"]`).
 * Los datos del país se obtienen siempre de REST Countries, así nunca quedan desactualizados.
 * Se valida al leer porque `localStorage` puede tener cualquier cosa (AGENTS.md 2.4).
 * Los duplicados se eliminan en `readFavorites`.
 */
export const storedFavoritesSchema = z
  .array(z.string().check(z.regex(/^[A-Z]{3}$/)))
  .check(z.maxLength(MAX_FAVORITES));
