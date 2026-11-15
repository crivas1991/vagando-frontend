/**
 * Logger de la aplicación (AGENTS.md 2.6).
 *
 * - Solo registra en el servidor. En el navegador es un no-op, así que importarlo
 *   desde un Client Component no expone información en la consola del usuario.
 * - Oculta automáticamente API keys y tokens que aparezcan en URLs o mensajes.
 * - Es el único lugar del proyecto donde se permite usar `console`.
 */

type LogLevel = 'info' | 'warn' | 'error';

const isServer = typeof window === 'undefined';

/** Query params sensibles: apiKey, api_key, api-key, key, token... */
const SENSITIVE_PARAM = /([?&](?:api[_-]?key|key|token|access_token)=)[^&\s"']+/gi;

export function redact(text: string): string {
  return text.replace(SENSITIVE_PARAM, '$1[REDACTED]');
}

function serialize(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: redact(value.message),
      stack: value.stack ? redact(value.stack) : undefined,
      cause: value.cause === undefined ? undefined : serialize(value.cause),
    };
  }

  if (typeof value === 'string') return redact(value);

  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : (JSON.parse(redact(json)) as unknown);
  } catch {
    // Valores no serializables (por ejemplo, referencias circulares): se registra su representación en texto.
    return redact(String(value));
  }
}

function write(level: LogLevel, message: string, context?: unknown): void {
  if (!isServer) return;

  const entry = {
    level,
    time: new Date().toISOString(),
    message: redact(message),
    ...(context === undefined ? {} : { context: serialize(context) }),
  };

  console[level](JSON.stringify(entry));
}

export const logger = {
  info: (message: string, context?: unknown) => write('info', message, context),
  warn: (message: string, context?: unknown) => write('warn', message, context),
  error: (message: string, context?: unknown) => write('error', message, context),
};
