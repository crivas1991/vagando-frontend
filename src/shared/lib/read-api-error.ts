import type { ApiErrorBody } from '@/shared/types/api.types';

export const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error inesperado. Intenta de nuevo más tarde.';

function isApiErrorBody(body: unknown): body is ApiErrorBody {
  if (typeof body !== 'object' || body === null || !('error' in body)) return false;
  const { error } = body;
  return typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string';
}

/**
 * Lee el mensaje del formato uniforme `{ error: { code, message } }` (AGENTS.md 2.5 y 2.8).
 * Si la respuesta no tiene ese formato, devuelve un mensaje genérico.
 */
export function readApiErrorMessage(body: unknown): string {
  return isApiErrorBody(body) ? body.error.message : DEFAULT_ERROR_MESSAGE;
}
