/**
 * Errores tipados de la aplicación (AGENTS.md 2.2).
 *
 * Todo error controlado es un `AppError` con un código y un status HTTP.
 * - `message`: texto seguro para mostrar al usuario (español, sin detalles técnicos).
 * - `cause`: detalle técnico. Solo se registra en el logger del servidor; nunca se envía al cliente.
 */

export const APP_ERROR_STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL: 500,
  UPSTREAM_ERROR: 502,
} as const satisfies Record<string, number>;

export type AppErrorCode = keyof typeof APP_ERROR_STATUS;

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor(
    message: string,
    code: AppErrorCode,
    status: number = APP_ERROR_STATUS[code],
    cause?: unknown,
  ) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
