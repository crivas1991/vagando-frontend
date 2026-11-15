import 'server-only';

import type { ZodType } from 'zod';

import { AppError } from './errors';

/**
 * Cliente HTTP único para APIs externas (AGENTS.md 2.3).
 *
 * Todas las llamadas a APIs externas pasan por `fetchJson`. Se encarga de:
 * 1. Timeout con `AbortSignal.timeout`.
 * 2. Verificar `res.ok` y convertir los errores HTTP en `AppError`.
 * 3. Validar la respuesta con un schema de zod y devolver datos tipados.
 *
 * La caché NO se configura aquí: con `cacheComponents` activado, los services
 * cachean con la directiva `'use cache'` y `cacheLife()`.
 */

export const REQUEST_TIMEOUT_MS = 10_000;

export type FetchJsonOptions = RequestInit & {
  /** Tiempo máximo de espera en milisegundos. Por defecto, 10 segundos. */
  timeoutMs?: number;
};

const MESSAGES = {
  badRequest: 'La solicitud contiene datos inválidos.',
  notFound: 'No encontramos el recurso solicitado.',
  rateLimited: 'Se alcanzó el límite de solicitudes. Intenta de nuevo en unos minutos.',
  rejected: 'El servicio externo rechazó la solicitud.',
  unavailable: 'El servicio externo no está disponible en este momento.',
  timeout: 'El servicio externo tardó demasiado en responder.',
  network: 'No pudimos conectar con el servicio externo.',
  invalidResponse: 'El servicio externo devolvió una respuesta inesperada.',
} as const;

/** URL sin query params, para que una API key nunca termine en logs ni en `cause`. */
function toSafeUrl(url: URL): string {
  return `${url.origin}${url.pathname}`;
}

function httpStatusToAppError(status: number, safeUrl: string): AppError {
  const cause = { url: safeUrl, status };

  switch (status) {
    case 400:
      return new AppError(MESSAGES.badRequest, 'BAD_REQUEST', 400, cause);
    case 401:
    case 403:
      // Normalmente indica una API key inválida. El mensaje no la menciona.
      return new AppError(MESSAGES.rejected, 'UPSTREAM_ERROR', 502, { ...cause, hint: 'credenciales' });
    case 404:
      return new AppError(MESSAGES.notFound, 'NOT_FOUND', 404, cause);
    case 429:
      return new AppError(MESSAGES.rateLimited, 'RATE_LIMITED', 429, cause);
    default:
      return new AppError(MESSAGES.unavailable, 'UPSTREAM_ERROR', 502, cause);
  }
}

export async function fetchJson<T>(
  url: string | URL,
  schema: ZodType<T>,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { timeoutMs = REQUEST_TIMEOUT_MS, signal, headers, ...init } = options;

  const target = new URL(url);
  const safeUrl = toSafeUrl(target);

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Accept')) requestHeaders.set('Accept', 'application/json');

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const requestSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(target, { ...init, headers: requestHeaders, signal: requestSignal });
  } catch (error) {
    // Cancelación pedida por quien llama: no es una falla, se propaga tal cual.
    if (signal?.aborted) throw error;

    if (timeoutSignal.aborted) {
      throw new AppError(MESSAGES.timeout, 'UPSTREAM_ERROR', 502, { url: safeUrl, reason: 'timeout', timeoutMs });
    }

    throw new AppError(MESSAGES.network, 'UPSTREAM_ERROR', 502, { url: safeUrl, reason: 'network', error });
  }

  if (!response.ok) {
    throw httpStatusToAppError(response.status, safeUrl);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    throw new AppError(MESSAGES.invalidResponse, 'UPSTREAM_ERROR', 502, { url: safeUrl, reason: 'invalid-json', error });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(MESSAGES.invalidResponse, 'UPSTREAM_ERROR', 502, {
      url: safeUrl,
      reason: 'schema-mismatch',
      issues: parsed.error.issues,
    });
  }

  return parsed.data;
}
