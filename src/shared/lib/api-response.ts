import 'server-only';

import { unstable_rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';

import type { ApiErrorBody } from '@/shared/types/api.types';

import { isAppError } from './errors';
import { logger } from './logger';

/**
 * Convierte cualquier error en una respuesta JSON uniforme (AGENTS.md 2.5 y 2.6).
 *
 * - `AppError`: responde con su código, su mensaje (seguro para el usuario) y su status.
 * - Cualquier otro error: responde 500 con un mensaje genérico.
 * - El detalle técnico (`cause`, stack) solo se registra en el logger del servidor.
 */

const GENERIC_ERROR_MESSAGE = 'Ocurrió un error inesperado. Intenta de nuevo más tarde.';

export function handleRouteError(error: unknown): NextResponse<ApiErrorBody> {
  // Next.js usa errores internos como señales de control (prerenderizado, notFound(), redirect()).
  // No son fallas de la app: se devuelven a Next.js para que los maneje él mismo.
  unstable_rethrow(error);

  if (isAppError(error)) {
    const log = error.status >= 500 ? logger.error : logger.warn;
    log(`[${error.code}] ${error.message}`, error.cause);

    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  logger.error('Error no controlado en Route Handler', error);

  return NextResponse.json(
    { error: { code: 'INTERNAL', message: GENERIC_ERROR_MESSAGE } },
    { status: 500 },
  );
}
