/**
 * Registro de errores capturados en el navegador (error.tsx y global-error.tsx).
 *
 * `logger` solo escribe en el servidor, así que los límites de error del cliente usan esta función:
 * - En desarrollo: muestra el error completo en la consola para depurar.
 * - En producción: solo muestra el `digest`, sin el mensaje (podría contener información interna).
 *   El detalle completo ya quedó registrado en el servidor con el mismo `digest`.
 *
 * Es el punto donde, en el futuro, se conectaría un servicio de monitoreo (Sentry, etc.).
 */
export function getErrorDigest(error: unknown): string | undefined {
  if (error instanceof Error && 'digest' in error && typeof error.digest === 'string') {
    return error.digest;
  }
  return undefined;
}

export function reportClientError(error: unknown, boundary: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${boundary}]`, error);
    return;
  }

  const digest = getErrorDigest(error);
  console.error(`[${boundary}] Ocurrió un error${digest ? ` (referencia: ${digest})` : ''}`);
}
