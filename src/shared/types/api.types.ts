import type { AppErrorCode } from '@/shared/lib/errors';

/**
 * Formato uniforme de error que devuelven todos los Route Handlers (AGENTS.md 2.5).
 * Los hooks de cliente lo usan para leer el mensaje cuando la respuesta no es `ok`.
 */
export type ApiErrorBody = {
  error: {
    code: AppErrorCode;
    message: string;
  };
};
