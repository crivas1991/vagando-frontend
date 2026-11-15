import { DEFAULT_ERROR_MESSAGE, readApiErrorMessage } from './read-api-error';

export const NETWORK_ERROR_MESSAGE = 'No pudimos conectarnos. Revisa tu conexión a internet e intenta de nuevo.';

/** Error con un mensaje ya listo para mostrar al usuario. */
export class ApiRequestError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ApiRequestError';
  }
}

/**
 * `fetch` para los hooks de cliente que consultan nuestros Route Handlers (`/api/*`).
 *
 * Todo error termina como `ApiRequestError` con un mensaje en español:
 * - sin conexión → `NETWORK_ERROR_MESSAGE` (en lugar del "Failed to fetch" del navegador),
 * - respuesta de error → el mensaje del formato `{ error: { code, message } }`,
 * - respuesta que no es JSON → mensaje genérico.
 *
 * Si la petición se cancela con `signal`, se relanza el error original para que el hook lo ignore.
 */
export async function fetchApi(url: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiRequestError(NETWORK_ERROR_MESSAGE, { cause: error });
  }

  // Si el cuerpo no es JSON (por ejemplo, una página HTML de error), queda `undefined` y se maneja abajo.
  const body: unknown = await response.json().catch((error: unknown) => {
    if (signal?.aborted) throw error;
    return undefined;
  });

  if (!response.ok) throw new ApiRequestError(readApiErrorMessage(body));
  if (body === undefined) throw new ApiRequestError(DEFAULT_ERROR_MESSAGE);

  return body;
}
