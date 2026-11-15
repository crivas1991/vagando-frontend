<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Reglas del proyecto Vagando

> Estas reglas son **obligatorias durante TODO el desarrollo**. Cualquier código generado (por una persona o por un asistente de IA) debe cumplirlas. Si una tarea entra en conflicto con estas reglas, se detiene y se consulta antes de continuar.

> 🔒 **NOTA IMPORTANTE:** **No se hace `git commit` ni `git push` sin la autorización explícita del responsable del repositorio.** El asistente de IA prepara los cambios, propone el mensaje de commit y **espera la aprobación** antes de ejecutarlo. Una autorización vale solo para el commit o push que se aprobó, no para los siguientes.

## Contexto del proyecto

**Vagando** es una app con temática de turismo en Centroamérica.

- **Stack:** Next.js 16 (App Router), TypeScript y Tailwind CSS
- **APIs consumidas:**

| API | Feature | Uso | Key | Base URL | Límites (plan gratuito) |
|---|---|---|---|---|---|
| [REST Countries v5](https://restcountries.com/docs/countries) | `countries` | Datos del país: bandera, capital, moneda, idiomas, coordenadas | Sí: `REST_COUNTRIES_API_KEY`, enviada en el header `Authorization: Bearer <key>` | `https://api.restcountries.com/countries/v5` | 1000 peticiones/mes y 20 peticiones cada 10 s |
| [Open-Meteo](https://open-meteo.com) | `weather` | Clima actual y pronóstico | No | `https://api.open-meteo.com/v1` | Uso no comercial gratuito |
| [Geoapify Places API](https://www.geoapify.com/places-api) | `places` | Lugares turísticos cercanos | Sí: `GEOAPIFY_API_KEY`, enviada como query param `apiKey` | `https://api.geoapify.com/v2` | 3000 peticiones/día |

> **REST Countries:** las versiones v1–v4 (`restcountries.com/v3.1/...`) fueron dadas de baja y ya no devuelven datos. Solo se usa la **v5**. Sus respuestas vienen dentro de `{ data: { objects: [...] } }` y los nombres de los campos cambiaron (por ejemplo, `names.common` y `codes.alpha_3`). Como la cuota es mensual, los datos de países se cachean por largo tiempo (los países casi no cambian).

---

## 1. Arquitectura basada en features (REGLA PRINCIPAL)

El código se organiza por **dominio de negocio (feature)**, no por tipo de archivo. Todo el repositorio debe cumplir esta estructura.

### 1.1 Estructura de carpetas

```
src/
├── app/                          # SOLO rutas (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx / error.tsx / not-found.tsx
│   ├── <ruta>/page.tsx
│   └── api/<recurso>/route.ts    # Route Handlers
│
├── features/
│   ├── countries/
│   ├── weather/
│   ├── places/
│   └── favorites/
│       ├── components/           # Componentes de UI exclusivos del feature
│       ├── hooks/                # Hooks de React del feature
│       ├── services/             # Acceso a datos / APIs externas
│       ├── schemas/              # Esquemas de validación de datos
│       ├── types/                # Tipos e interfaces del feature
│       ├── utils/                # Funciones puras auxiliares del feature
│       ├── index.ts              # API pública segura para cliente (barrel)
│       └── server.ts             # API pública solo para servidor (services)
│
└── shared/
    ├── components/ui/            # Componentes genéricos reutilizables (Button, Card, Skeleton...)
    ├── lib/                      # Utilidades transversales (cliente HTTP, configuración...)
    ├── hooks/                    # Hooks genéricos (no ligados a un feature)
    └── types/                    # Tipos globales compartidos
```

Cada feature tiene las subcarpetas `components`, `hooks`, `services`, `schemas`, `types` y `utils`, además de sus archivos `index.ts` y `server.ts`. Una subcarpeta puede quedar vacía si el feature no la necesita, pero **no se crean carpetas fuera de esta estructura**.

### 1.2 Features definidos

| Feature | Responsabilidad |
|---|---|
| `countries` | Listado, búsqueda y detalle de países de Centroamérica |
| `weather` | Clima actual y pronóstico de un país o ciudad |
| `places` | Lugares turísticos cercanos |
| `favorites` | Destinos guardados por el usuario |

Para agregar un feature nuevo, primero se actualiza esta tabla.

### 1.3 `src/app/` solo compone

- Las páginas (`page.tsx`) y layouts **solo importan y componen** componentes de features y de `shared`.
- **Prohibido en `app/`:** lógica de negocio, transformación de datos y llamadas `fetch` directas.
- Los Route Handlers (`app/api/**/route.ts`) son una capa delgada: validan la entrada, delegan al `service` del feature y devuelven la respuesta.

```tsx
// ✅ Correcto: app/country/[code]/page.tsx
import { CountryDetail } from '@/features/countries';
import { getCountryByCode } from '@/features/countries/server';

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = await getCountryByCode(code);
  return <CountryDetail country={country} />;
}
```

```tsx
// ❌ Incorrecto: fetch y lógica directa en la página
export default async function CountryPage() {
  const res = await fetch('https://restcountries.com/v3.1/alpha/SLV');
  const data = await res.json();
  const name = data[0].name.common.toUpperCase();
  // ...
}
```

### 1.4 Aislamiento entre features

- Un feature **no importa archivos internos** de otro feature.
- Entre features, y desde `app/`, solo se importa a través del `index.ts` o del `server.ts` del feature.
- Si dos features necesitan lo mismo, ese código se mueve a `shared/`.

```ts
// ✅ Correcto
import { CountryCard } from '@/features/countries';

// ❌ Incorrecto: acceso a un archivo interno de otro feature
import { CountryCard } from '@/features/countries/components/CountryCard';
```

> Dentro de un mismo feature sí se permiten imports internos entre sus propias carpetas.

### 1.5 `index.ts` y `server.ts` como API pública

Cada feature tiene **dos** puntos de entrada públicos:

| Archivo | Qué exporta | Quién lo puede importar |
|---|---|---|
| `index.ts` | Componentes, hooks, tipos y utils (código seguro para el navegador) | Cualquier módulo, incluidos los Client Components |
| `server.ts` | Services que usan `import 'server-only'` (acceso a APIs y keys) | Solo Server Components y Route Handlers |

- Cada feature expone **solo** lo que otros módulos necesitan.
- Lo que no se exporta en `index.ts` ni en `server.ts` se considera privado del feature.
- `index.ts` **nunca** reexporta services. Si lo hiciera, un Client Component que importe del barrel arrastraría código de servidor y el build fallaría por `server-only`.

```ts
// features/countries/index.ts
export { CountryCard } from './components/CountryCard';
export { CountryDetail } from './components/CountryDetail';
export type { Country } from './types/country.types';
```

```ts
// features/countries/server.ts
export { getCountryByCode, getCentralAmericaCountries } from './services/countries.service';
```

### 1.6 `shared/` es independiente

- `shared/` **nunca** importa de `features/`.
- La dirección de dependencias es siempre la misma:

```
app/  ──►  features/  ──►  shared/
app/  ──────────────────►  shared/
```

- `shared/` solo contiene código genérico, sin conocimiento del dominio (nada que sepa qué es un "país" o un "lugar").

### 1.7 Alias `@/` obligatorio

- Todos los imports entre carpetas usan el alias `@/` (que apunta a `src/`).
- Se permiten rutas relativas (`./`) **solo** para archivos dentro de la misma carpeta.
- Prohibido usar rutas relativas largas (`../../`).

```ts
// ✅ Correcto
import { Card } from '@/shared/components/ui/Card';

// ❌ Incorrecto
import { Card } from '../../../shared/components/ui/Card';
```

### 1.8 Checklist de cumplimiento

Antes de dar por terminada cualquier tarea, se verifica:

- [ ] No hay `fetch` ni lógica de negocio en `src/app/`.
- [ ] Ningún feature importa archivos internos de otro feature.
- [ ] `shared/` no importa nada de `features/`.
- [ ] Todo lo que se usa fuera de un feature está exportado en su `index.ts` o en su `server.ts`.
- [ ] Ningún `index.ts` reexporta services.
- [ ] Todos los imports entre carpetas usan `@/`.

---

## 2. Manejo de errores/excepciones

Toda falla debe ser **tipada, controlada y segura**: el usuario ve un mensaje claro, el detalle técnico se queda en el servidor y ningún error deja la app en blanco.

### 2.1 Archivos de la capa de errores

| Archivo | Responsabilidad |
|---|---|
| `shared/lib/errors.ts` | Clase `AppError` y type guard `isAppError` |
| `shared/lib/http.ts` | Cliente HTTP único (`fetchJson`) |
| `shared/lib/env.ts` | Validación de variables de entorno con zod (solo servidor) |
| `shared/lib/logger.ts` | Logger de servidor (`error`, `warn`, `info`) |
| `shared/lib/api-response.ts` | Helper `handleRouteError(error)` para Route Handlers |

### 2.2 Clase `AppError` tipada

Todo error controlado de la app es un `AppError` con un **código** y un **status HTTP**.

| Código | Status | Cuándo se usa |
|---|---|---|
| `BAD_REQUEST` | 400 | Query params o datos de entrada inválidos |
| `NOT_FOUND` | 404 | El recurso no existe (país, lugar) |
| `RATE_LIMITED` | 429 | La API externa respondió 429 (límite de peticiones) |
| `UPSTREAM_ERROR` | 502 | Una API externa falla, no responde, excede el timeout o devuelve datos con formato inesperado |
| `INTERNAL` | 500 | Cualquier error no previsto |

```ts
// shared/lib/errors.ts
export type AppErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
    public readonly status: number,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
```

- El `message` de un `AppError` debe ser **seguro para mostrar al usuario** (en español y sin detalles técnicos).
- El detalle técnico va en `cause`, que solo se registra en el logger y nunca se envía al cliente.

### 2.3 Cliente HTTP único (`shared/lib/http.ts`)

**Todas** las llamadas a APIs externas pasan por `fetchJson`. Está prohibido usar `fetch` directo en services, componentes o Route Handlers.

`fetchJson` debe:
1. Aplicar un timeout con `AbortSignal.timeout(10_000)`.
2. Verificar `res.ok` antes de leer el body.
3. Convertir los errores HTTP en `AppError`:

| Respuesta externa | `AppError` |
|---|---|
| 404 | `NOT_FOUND` |
| 429 | `RATE_LIMITED` |
| 401 / 403 (key inválida o cuota mensual agotada) | `UPSTREAM_ERROR` (sin mencionar la key en el mensaje) |
| 5xx, error de red o timeout | `UPSTREAM_ERROR` |
| Respuesta que no pasa la validación de zod | `UPSTREAM_ERROR` |

4. Validar la respuesta con el schema zod que recibe y devolver datos **tipados y validados**.

```ts
// Firma esperada
export async function fetchJson<T>(
  url: string | URL,
  schema: ZodType<T>,
  options?: RequestInit & { timeoutMs?: number },
): Promise<T>;
```

> **Caché con `cacheComponents`:** el proyecto tiene `cacheComponents: true` en `next.config.ts`. En este modo, la caché **no** se configura en `fetch` (`next: { revalidate }`), sino en las funciones de los services con la directiva `'use cache'` y `cacheLife()`. Por eso `fetchJson` no recibe opciones de caché. Ver `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`.

> Cuidado: las URLs con API key **no se registran completas** en el logger. Se registra el host y la ruta, nunca los query params sensibles.

### 2.4 Validación con zod

Se valida con zod en tres puntos de entrada de datos:

| Qué | Dónde | Si falla |
|---|---|---|
| Respuestas de APIs externas | `features/<feature>/schemas/*.schema.ts` | `UPSTREAM_ERROR` |
| Query params y params de ruta | Route Handlers y services | `BAD_REQUEST` |
| Variables de entorno | `shared/lib/env.ts` (`getServerEnv()`) | `INTERNAL` la primera vez que se leen. El log indica qué variable falta, sin mostrar su valor |

- Los tipos del feature se derivan de los schemas con `z.infer` (una sola fuente de verdad).
- Los schemas de respuestas externas solo declaran los campos que la app usa, y los campos que pueden faltar se marcan con `.optional()`.

### 2.5 Route Handlers: `try/catch` y respuesta uniforme

Todo Route Handler:
- envuelve su lógica en `try/catch`,
- responde los errores **siempre** con el mismo formato,
- usa el status HTTP correcto según el `AppError`.

```json
{ "error": { "code": "UPSTREAM_ERROR", "message": "No pudimos obtener el clima en este momento." } }
```

```ts
// shared/lib/api-response.ts
export function handleRouteError(error: unknown): NextResponse {
  if (isAppError(error)) {
    logger.warn(error.code, error.cause);
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }
  logger.error('Unhandled error', error);
  return NextResponse.json(
    { error: { code: 'INTERNAL', message: 'Ocurrió un error inesperado.' } },
    { status: 500 },
  );
}
```

```ts
// app/api/weather/route.ts
export async function GET(request: NextRequest) {
  try {
    const params = weatherQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
    if (!params.success) {
      throw new AppError('Parámetros de ubicación inválidos.', 'BAD_REQUEST', 400, params.error);
    }
    const weather = await getWeather(params.data.lat, params.data.lon);
    return NextResponse.json(weather);
  } catch (error) {
    return handleRouteError(error);
  }
}
```

> **No capturar las señales internas de Next.js:** `notFound()`, `redirect()` y las APIs de petición (`searchParams`, `cookies()`, `headers()`) lanzan errores internos que Next.js usa como señales de control, por ejemplo para marcar una ruta como dinámica durante el prerenderizado. `handleRouteError` llama a **`unstable_rethrow(error)`** al inicio para devolvérselos a Next.js. Cualquier otro `try/catch` en Server Components o Route Handlers que pueda envolver estas llamadas debe hacer lo mismo.

### 2.6 Seguridad en los errores

**Nunca** se envía al cliente:
- stack traces,
- API keys o URLs que las contengan,
- mensajes internos de librerías o de APIs externas,
- el contenido de `cause`.

El detalle técnico **solo** se registra en el servidor con `logger`. Está prohibido usar `console.log` suelto para errores.

### 2.7 Error UI en el App Router

| Archivo | Uso |
|---|---|
| `app/**/error.tsx` | Uno por cada segmento que obtiene datos. Es un Client Component (`'use client'`), muestra un mensaje amigable y un botón **"Reintentar"** que llama a `retry()` |
| `app/global-error.tsx` | Captura los errores del layout raíz; debe incluir sus propias etiquetas `<html>` y `<body>`, y además importar estilos y fuentes |
| `app/not-found.tsx` | Página 404 con diseño de la app y link al inicio |
| `notFound()` | Se llama en el servidor cuando un recurso no existe (por ejemplo, `/country/XXX`) |

**`retry()` y no `reset()`:** desde Next.js 16.3, los límites de error reciben `retry()`, que **vuelve a pedir los datos al servidor** y re-renderiza el segmento. `reset()` solo re-renderiza con los datos que ya tenía, así que no sirve para recuperarse de fallos temporales de una API (timeout, servicio caído). Se usa siempre `retry()`.

```tsx
// app/country/[code]/error.tsx
'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/shared/components/ui/ErrorState';
import { reportClientError } from '@/shared/lib/report-client-error';

export default function CountryError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    reportClientError(error, 'country/error');
  }, [error]);

  return (
    <ErrorState
      title="No pudimos cargar este destino"
      message="Intenta de nuevo en unos segundos."
      onRetry={retry}
    />
  );
}
```

- `error` se tipa como **`unknown`**: los errores lanzados en Client Components pueden no ser instancias de `Error`.
- En `error.tsx` no se muestra `error.message` al usuario, porque en producción puede contener información interna. Se puede mostrar `error.digest` como **código de referencia**, porque coincide con el registro del servidor.
- Los errores en el navegador se registran con `reportClientError` (`shared/lib/report-client-error.ts`), ya que `logger` solo escribe en el servidor.

### 2.8 Hooks de cliente

Todo hook que consulta datos:
- expone **siempre** `{ data, error, isLoading }`,
- cancela la petición con `AbortController` en el cleanup de `useEffect`,
- ignora el error `AbortError` (es una cancelación, no una falla),
- lee el formato `{ error: { code, message } }` cuando la respuesta no es `ok`.

```ts
useEffect(() => {
  const controller = new AbortController();
  setIsLoading(true);
  setError(null);

  fetch(`/api/countries?q=${encodeURIComponent(query)}`, { signal: controller.signal })
    .then(async (res) => {
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? 'Ocurrió un error inesperado.');
      setData(body);
    })
    .catch((err: unknown) => {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    })
    .finally(() => {
      if (!controller.signal.aborted) setIsLoading(false);
    });

  return () => controller.abort();
}, [query]);
```

### 2.9 Prohibido el `catch` vacío

Todo `catch` debe hacer al menos una de estas cosas:
- relanzar el error (idealmente como `AppError`),
- registrarlo con `logger`,
- convertirlo en un estado de error visible para el usuario.

```ts
// ❌ Prohibido
try { ... } catch {}

// ❌ Prohibido: tragarse el error en silencio
try { ... } catch (e) { return null; }
```

> Única excepción permitida: lectura de `localStorage` (puede fallar en modo incógnito). Aun así, se registra con `logger.warn` y se usa un valor por defecto.

### 2.10 Degradación elegante

La información del país (REST Countries) es la **fuente principal**. Clima (Open-Meteo) y lugares (Geoapify) son **fuentes secundarias**.

- Si falla una API secundaria, la página del país **sigue funcionando** y muestra un estado de error **solo en esa sección**.
- Cada sección secundaria se envuelve en su propio `<Suspense>` con su propio fallback de carga.
- El componente de la sección captura el error y muestra `ErrorState` en lugar de propagarlo a `error.tsx`.
- Solo un fallo de la fuente principal (o un país inexistente) puede llevar a `error.tsx` o a `notFound()`.

```
┌─────────────── /country/SLV ───────────────┐
│  🇸🇻 El Salvador  (REST Countries ✅)        │
│  ┌─ Clima ──────────────┐ ┌─ Lugares ─────┐ │
│  │ ⚠️ No pudimos obtener │ │ ✅ 12 lugares  │ │
│  │ el clima. Reintentar │ │ ...           │ │
│  └──────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────┘
```

### 2.11 Checklist de cumplimiento

- [ ] Ninguna llamada externa usa `fetch` directo; todas pasan por `fetchJson`.
- [ ] Toda respuesta externa, query param y variable de entorno está validada con zod.
- [ ] Todo Route Handler tiene `try/catch` y usa `handleRouteError`.
- [ ] Ninguna respuesta al cliente incluye stack traces, keys ni mensajes internos.
- [ ] Cada segmento con datos tiene su `error.tsx` con botón "Reintentar".
- [ ] Existen `global-error.tsx` y `not-found.tsx`.
- [ ] Los hooks de cliente exponen `{ data, error, isLoading }` y usan `AbortController`.
- [ ] No hay ningún `catch` vacío.
- [ ] Si falla el clima o los lugares, la página del país sigue funcionando.

---

## 3. Requisitos de la actividad (buenas prácticas y estándares)

### 3.1 Stack y TypeScript

- **Next.js 16+** con **App Router** (no se usa `pages/`).
- **TypeScript en modo `strict`** (`"strict": true` en `tsconfig.json`).
- **Prohibido `any`**, tanto explícito como implícito. Para datos desconocidos se usa `unknown` y se hace narrowing o se valida con zod.
- Prohibido `// @ts-ignore`. Si de verdad es inevitable, se usa `// @ts-expect-error` con un comentario que explique el motivo.
- **Tailwind CSS** para todos los estilos. Nada de estilos inline, salvo valores dinámicos que Tailwind no pueda expresar.

### 3.2 Rutas (mínimo 4)

| Ruta | Tipo de página | Contenido | Feature(s) |
|---|---|---|---|
| `/` | Server Component | Hero y destinos destacados de Centroamérica | `countries` |
| `/explore` | Server + Client | Buscador y filtros de países | `countries` |
| `/country/[code]` | Server Component | Detalle del país, clima y acceso a lugares | `countries`, `weather` |
| `/country/[code]/places` | Server + Client | Lugares turísticos con filtro por categoría | `places` |
| `/favorites` | Client (dentro de una página Server) | Destinos guardados | `favorites` |

### 3.3 Consumo de APIs mediante Route Handlers

| Route Handler | API externa | Método |
|---|---|---|
| `/api/countries` | REST Countries | `GET` |
| `/api/weather` | Open-Meteo | `GET` |
| `/api/places` | Geoapify Places | `GET` |

- **Los Client Components consumen datos solo a través de `/api/*`**. Nunca llaman directo a una API externa.
- **Los Server Components llaman directo al service del feature** (vía `server.ts`), no a su propio `/api/*`. Hacer una petición HTTP al propio servidor desde el servidor es un salto innecesario y una mala práctica en Next.js.
- Route Handlers y Server Components usan **el mismo service**, así que la lógica no se duplica.

```
Client Component ──► /api/places (Route Handler) ──► places.service ──► Geoapify
Server Component ─────────────────────────────────► places.service ──► Geoapify
```

### 3.4 Server Components vs Client Components

- **Server Component por defecto.** Todo componente es de servidor salvo que necesite interactividad.
- **`'use client'` solo si el componente usa:** estado (`useState`), efectos (`useEffect`), eventos (`onClick`, `onChange`...) o APIs del navegador (`localStorage`, `window`).
- Los Client Components son **pequeños y van en las hojas** del árbol. La página sigue siendo Server Component y solo la parte interactiva es de cliente.
- Un Client Component **nunca** importa de `server.ts`.
- Los datos que se pasan de un Server Component a un Client Component por props deben ser serializables (no se pueden pasar funciones ni instancias de clases).

```tsx
// ✅ app/explore/page.tsx → Server Component
import { CountrySearch } from '@/features/countries'; // ← 'use client' dentro del feature

export default function ExplorePage() {
  return (
    <section>
      <h1>Explora Centroamérica</h1>
      <CountrySearch />
    </section>
  );
}
```

### 3.5 `useState` y `useEffect` en hooks de cliente

- La lógica con estado y efectos se encapsula en **hooks personalizados** dentro de `features/<feature>/hooks/` (no se mete directo en los componentes).
- Hooks mínimos esperados:

| Hook | Feature | Uso de `useState` / `useEffect` |
|---|---|---|
| `useCountrySearch` | `countries` | Búsqueda con debounce que consulta `/api/countries` |
| `usePlaces` | `places` | Filtro por categoría que consulta `/api/places` |
| `useFavorites` | `favorites` | Lectura y escritura en `localStorage` |

- Todo `useEffect` declara sus dependencias completas y devuelve una función de cleanup cuando hay peticiones, timers o listeners.
- Para evitar errores de hidratación, `localStorage` y `window` solo se leen **dentro de `useEffect`**, nunca durante el render.

### 3.6 Diseño responsive mobile-first

- Se diseña primero para móvil y luego se amplía con breakpoints: `base` → `sm` → `md` → `lg` → `xl`.
- Las grillas se adaptan: 1 columna en móvil, 2 en tablet y 3 o 4 en escritorio.
- La navegación tiene menú hamburguesa en móvil y barra horizontal en escritorio.
- No debe existir scroll horizontal en ningún ancho de pantalla (mínimo 320px).
- Los elementos táctiles miden al menos 44×44px.
- Las imágenes usan `next/image` con `sizes` definido. Los dominios externos se configuran en `images.remotePatterns` de `next.config.ts`.
- **Accesibilidad:** HTML semántico (`header`, `nav`, `main`, `section`, `footer`), `alt` descriptivo en imágenes, foco visible y contraste suficiente.

### 3.7 Estados de carga y estados vacíos

- Toda ruta que obtiene datos tiene su **`loading.tsx` con skeletons** que imitan la forma del contenido final (no solo un spinner).
- Las secciones independientes (clima, lugares) usan `<Suspense>` con su propio skeleton.
- Los Client Components muestran un skeleton mientras `isLoading` es `true`.
- **Todo listado tiene estado vacío** con un mensaje útil y, si aplica, una acción. Por ejemplo: *"No encontramos países con ese nombre"* o *"Aún no tienes destinos favoritos. Explorar destinos →"*.
- Además del contenido, cada listado maneja tres estados: **carga**, **error** y **vacío**.

### 3.8 Variables de entorno y secretos

| Archivo | ¿Se versiona? | Contenido |
|---|---|---|
| `.env.local` | ❌ **Nunca** (está en `.gitignore`) | Valores reales de las keys |
| `.env.example` | ✅ Sí | Nombres de las variables, valores de ejemplo y comentarios |

```bash
# .env.example (resumen; el archivo real tiene la documentación completa)
# Solo se usan en el servidor. NUNCA agregar el prefijo NEXT_PUBLIC_.
REST_COUNTRIES_API_KEY=your_rest_countries_api_key_here   # https://restcountries.com/sign-up
GEOAPIFY_API_KEY=your_geoapify_api_key_here               # https://myprojects.geoapify.com
```

- Cuando la API lo permite, la key se envía en un **header** y no en la URL, para que no termine en logs ni en el historial (REST Countries usa `Authorization: Bearer`). Si la API solo acepta la key en la URL (Geoapify), el logger la oculta con `redact()`.

- **Nunca se usa el prefijo `NEXT_PUBLIC_` para una API key.** Ese prefijo incluye el valor en el JavaScript que se envía al navegador.
- Todo archivo en `features/*/services/` empieza con **`import 'server-only';`**. Así, si un Client Component lo importa por error, el build falla en lugar de exponer la key.
- Las variables se leen **solo** a través de `shared/lib/env.ts` (validado con zod), nunca con `process.env` directo en el resto del código.
- Las keys no se hardcodean, no se registran en logs, no aparecen en mensajes de error y no se comparten en capturas ni en chats.
- En producción (Vercel), las variables se configuran en **Settings → Environment Variables**.
- **Las keys deben existir también durante el build.** La página de inicio se prerenderiza con datos de REST Countries, así que si `REST_COUNTRIES_API_KEY` falta o es inválida, el build falla (`Error occurred prerendering page "/"`). Es intencional: evita publicar un sitio roto. En Vercel, las variables se configuran **antes** del primer deploy.

### 3.9 `params` y `searchParams` son `Promise` en Next 16

En Next.js 16, `params` y `searchParams` de páginas, layouts, `generateMetadata` y Route Handlers son **asíncronos**. Siempre se tipan como `Promise` y se resuelven con `await`.

```tsx
// ✅ Correcto
type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function PlacesPage({ params, searchParams }: Props) {
  const { code } = await params;
  const { category } = await searchParams;
  // ...
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  // ...
}
```

```tsx
// ❌ Incorrecto: acceso síncrono
export default function PlacesPage({ params }: { params: { code: string } }) {
  const code = params.code;
}
```

> En Client Components se usan los hooks `useParams()` y `useSearchParams()` de `next/navigation`.

#### Con `cacheComponents`: datos dinámicos siempre dentro de `<Suspense>`

Con `cacheComponents: true`, Next.js prerenderiza un "esqueleto" estático de cada ruta. **Todo lo que solo se conoce al momento de la petición debe estar dentro de un límite de `<Suspense>`, o el build falla.** Esto incluye:

- `await params` / `await searchParams` en rutas dinámicas (`/country/[code]`),
- `fetch` sin caché, `cookies()`, `headers()` y `connection()`,
- los hooks de cliente `usePathname()`, `useSearchParams()` y `useParams()` en rutas con params dinámicos,
- leer la fecha u hora actual (`new Date()`) en un Server Component.

Cómo cumplirlo:
- Cada ruta dinámica tiene su **`loading.tsx`**, que Next.js convierte en un límite de `<Suspense>` para la página. Esto ya es obligatorio por la regla 3.7.
- Los componentes de cliente que usan `usePathname()` dentro del layout se envuelven en `<Suspense>` con un fallback equivalente (ver `shared/components/ui/Navbar.tsx`).
- Los datos que pueden cachearse se leen en funciones con `'use cache'` (ver 2.3).

Errores típicos del build si no se cumple: `blocking-prerender-dynamic` y `blocking-prerender-client-hook`.

### 3.10 Checklist de cumplimiento

- [ ] `tsconfig.json` con `strict: true` y ningún `any` en el código.
- [ ] Las 5 rutas existen y funcionan.
- [ ] Los 3 Route Handlers existen y usan el formato de error uniforme.
- [ ] Los Client Components solo consumen `/api/*`; los Server Components usan los services.
- [ ] `'use client'` solo en componentes con interactividad.
- [ ] `useState` y `useEffect` están encapsulados en hooks del feature.
- [ ] La app se ve bien en 320px, 768px y 1280px, sin scroll horizontal.
- [ ] Cada ruta con datos tiene `loading.tsx` con skeleton, y cada listado tiene estado vacío.
- [ ] `.env.local` no está versionado y `.env.example` está documentado.
- [ ] Ninguna key usa `NEXT_PUBLIC_` y todos los services tienen `import 'server-only'`.
- [ ] Todo acceso a `params` y `searchParams` usa `await`.

---

## 4. Convenciones

### 4.1 Nombres de archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes | `PascalCase.tsx` | `CountryCard.tsx`, `ErrorState.tsx` |
| Hooks | `useXxx.ts` (camelCase con prefijo `use`) | `useCountrySearch.ts`, `useFavorites.ts` |
| Services | `xxx.service.ts` | `countries.service.ts`, `places.service.ts` |
| Schemas | `xxx.schema.ts` | `country.schema.ts`, `weather.schema.ts` |
| Tipos | `xxx.types.ts` | `country.types.ts` |
| Utils | `camelCase.ts` | `weatherCode.ts`, `formatPopulation.ts` |
| Carpetas | `kebab-case` (o el nombre del feature) | `components/ui`, `features/places` |
| Archivos especiales de Next.js | Nombre que exige el framework | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` |

### 4.2 Nombres dentro del código

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes y tipos | `PascalCase` | `CountryCard`, `type Country` |
| Funciones y variables | `camelCase` | `getCountryByCode`, `isLoading` |
| Constantes globales | `UPPER_SNAKE_CASE` | `REQUEST_TIMEOUT_MS`, `CENTRAL_AMERICA_CODES` |
| Schemas zod | `camelCase` + `Schema` | `countrySchema`, `weatherQuerySchema` |
| Booleanos | Prefijo `is`, `has`, `can` o `should` | `isFavorite`, `hasError` |
| Handlers de eventos | Prefijo `handle` (props: `on`) | `handleSearch` / `onSearch` |

- Los componentes se exportan con **export nombrado**. El `export default` se usa solo donde Next.js lo exige (`page.tsx`, `layout.tsx`, `error.tsx`, etc.).
- Un componente por archivo, y el nombre del archivo coincide con el del componente.

### 4.3 Conventional Commits

Formato:

```
<tipo>(<scope>): <descripción>
```

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un error |
| `refactor` | Cambio de código que no altera el comportamiento |
| `style` | Cambios de formato o estilos visuales sin cambio de lógica |
| `perf` | Mejora de rendimiento |
| `docs` | Documentación (`README.md`, `AGENTS.md`, `docs/`) |
| `chore` | Configuración, dependencias, tareas de mantenimiento |
| `test` | Pruebas |

**Scopes permitidos:** `countries`, `weather`, `places`, `favorites`, `shared`, `ui`, `app`, `api`, `config`.

Reglas:
- Descripción en **imperativo**, en minúsculas y sin punto final: `agregar`, no `agregado` ni `agrega`.
- Máximo 72 caracteres en la primera línea.
- **Un commit por cambio lógico.** Nada de commits gigantes que mezclen varias features.
- Nunca se commitean `.env.local`, keys ni archivos generados (`.next/`, `node_modules/`).
- **Sin autorización no hay commit ni push** (ver la nota al inicio de este documento). El flujo es: el asistente muestra los archivos modificados y el mensaje propuesto, el responsable aprueba y recién entonces se ejecuta.

```bash
# ✅ Correcto
feat(countries): agregar búsqueda con debounce en /explore
fix(places): mostrar imagen de respaldo cuando no hay foto
docs: documentar las APIs en docs/APIS.md

# ❌ Incorrecto
cambios
fix
feat: muchas cosas nuevas y arreglos varios.
```

### 4.4 Imágenes (`next/image`)

- **Todas** las imágenes usan `next/image`. Prohibida la etiqueta `<img>`.
- Se define `width` y `height`, o bien `fill` junto con `sizes`, para evitar saltos de layout (CLS).
- La imagen principal visible al cargar la página (la que define el LCP) lleva **`preload`**. En Next 16, `priority` está **deprecado** y no se usa. Tampoco se pone `preload` en grillas donde cualquier tarjeta podría ser la imagen principal.
- Los dominios externos (por ejemplo, las banderas de `flags.restcountries.com`) se declaran en `images.remotePatterns` de `next.config.ts`.
- Si una imagen externa puede faltar (lugares sin foto), se muestra una imagen o ilustración de respaldo.

### 4.5 Texto alternativo (`alt`)

- Todo `alt` describe **qué muestra** la imagen, en español: `alt="Bandera de El Salvador"`, no `alt="imagen"` ni `alt="flag.png"`.
- Las imágenes puramente decorativas usan `alt=""`.
- Los botones que solo tienen un ícono llevan `aria-label`: `<button aria-label="Agregar a favoritos">`.

### 4.6 HTML semántico

- Estructura de layout: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Contenido: `<section>` para bloques temáticos, `<article>` para tarjetas independientes (país, lugar), `<ul>`/`<li>` para listados.
- **Un solo `<h1>` por página**, y los encabezados siguen el orden sin saltos (`h1` → `h2` → `h3`).
- `<Link>` de `next/link` para navegar y `<button>` para acciones. Prohibido usar `<div onClick>`.
- Todo `<input>` tiene su `<label>` asociado (visible o con la clase `sr-only`).

### 4.7 Checklist de cumplimiento

- [ ] Los nombres de archivos siguen la tabla 4.1.
- [ ] Los commits siguen Conventional Commits con un scope permitido.
- [ ] No hay ninguna etiqueta `<img>`; todas las imágenes usan `next/image`.
- [ ] Todas las imágenes tienen un `alt` descriptivo (o `alt=""` si son decorativas).
- [ ] Cada página tiene un solo `<h1>` y usa etiquetas semánticas.

---

## 5. Testing de cada tarea

Una tarea **no se considera terminada** hasta pasar todas estas verificaciones. Si alguna falla, se corrige antes de pasar a la siguiente tarea.

### 5.1 Verificación automática

```bash
npm run lint    # sin errores ni warnings nuevos
npm run build   # build de producción exitoso (también valida los tipos de TypeScript)
```

- No se desactivan reglas de ESLint ni se usa `// eslint-disable` para que el lint pase. Se corrige el código.
- Los errores de build no se esconden con `ignoreBuildErrors` ni con `ignoreDuringBuilds` en `next.config.ts`.

### 5.2 Verificación manual de estados

Cada funcionalidad que muestre datos se prueba en sus tres estados:

| Estado | Cómo provocarlo | Resultado esperado |
|---|---|---|
| **Carga** | DevTools → Network → throttling **Slow 4G** | Aparece el skeleton (no una pantalla en blanco) |
| **Error** | DevTools → Network → **Offline**, una key inválida en `.env.local`, una ruta como `/country/XXX` o params inválidos en `/api/*` | Mensaje amigable, botón "Reintentar" o página 404, y ninguna key ni detalle técnico visible |
| **Vacío** | Buscar un texto sin resultados (`zzzz`) o abrir `/favorites` sin favoritos | Mensaje de estado vacío con una acción útil |

Además, cuando aplique:
- **Degradación elegante:** se fuerza un error en el clima o en los lugares, y el resto de la página del país debe seguir funcionando.
- **Responsive:** se revisa en 320px, 768px y 1280px.
- **Seguridad:** en DevTools → Network se confirma que la key de Geoapify **no aparece** en ninguna petición del navegador, y `git status` no muestra `.env.local`.

### 5.3 Reporte al terminar una tarea

Al cerrar cada tarea se informa brevemente:
1. Resultado de `npm run lint` y `npm run build`.
2. Qué estados se probaron (carga, error y vacío) y cómo.
3. Cualquier verificación que no se haya podido hacer, indicando el motivo.
