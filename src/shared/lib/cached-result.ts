import { AppError, isAppError, type AppErrorCode } from './errors';
import { logger } from './logger';

/**
 * Resultados serializables para funciones con `'use cache'` (AGENTS.md 2.3).
 *
 * PROBLEMA: un error lanzado dentro de `'use cache'` cruza una frontera de serialización.
 * En producción sale como un `Error` genérico ("An error occurred in the Server Components render...")
 * y se pierden la clase `AppError`, el código y el status.
 *
 * SOLUCIÓN (patrón "conditional cache lifetimes" de la documentación de Next.js):
 * - Dentro de la caché, la falla se DEVUELVE como `{ ok: false, error }` con `cacheLife('seconds')`,
 *   para que no quede guardada mucho tiempo.
 * - Fuera de la caché, `unwrapCachedResult` vuelve a lanzar un `AppError` con su código y status reales.
 */

export type SerializedAppError = {
  message: string;
  code: AppErrorCode;
  status: number;
};

export type CachedResult<T> = { ok: true; data: T } | { ok: false; error: SerializedAppError };

const UNEXPECTED_MESSAGE = 'Ocurrió un error inesperado. Intenta de nuevo más tarde.';

/** Convierte un error en un resultado serializable. El detalle técnico se registra aquí, en el servidor. */
export function toCachedFailure(error: unknown, context: string): { ok: false; error: SerializedAppError } {
  if (isAppError(error)) {
    logger.warn(`[${context}] ${error.code}: ${error.message}`, error.cause);
    return { ok: false, error: { message: error.message, code: error.code, status: error.status } };
  }

  logger.error(`[${context}] Error no controlado`, error);
  return { ok: false, error: { message: UNEXPECTED_MESSAGE, code: 'INTERNAL', status: 500 } };
}

/** Devuelve los datos o vuelve a lanzar el `AppError` original (fuera de la frontera de caché). */
export function unwrapCachedResult<T>(result: CachedResult<T>): T {
  if (result.ok) return result.data;
  throw new AppError(result.error.message, result.error.code, result.error.status, { source: 'cached-result' });
}
