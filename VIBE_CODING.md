# 🤖 VIBE_CODING.md — Proceso de desarrollo de Vagando

Este documento registra cómo se construyó **Vagando** usando **Vibe Coding**: la IA funciona como copiloto de desarrollo y el desarrollador conserva el control de las decisiones y de la calidad del código.

Para cada paso se registran:
- los **prompts** principales,
- las **iteraciones** con la IA,
- las **decisiones técnicas**,
- los **desafíos** encontrados y cómo se resolvieron,
- el **commit** resultante.

---

## 🧱 Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework: rutas, Server/Client Components y Route Handlers |
| **TypeScript** (modo `strict`) | Tipado estático de todo el proyecto |
| **Tailwind CSS** | Estilos y diseño responsive mobile-first |

## 🛠️ Herramienta de IA

| Herramienta | Modelo | Uso |
|---|---|---|
| Claude Code (CLI) | Claude Opus 5.5 | Copiloto de desarrollo: definición de reglas, generación de código, revisión y corrección |

## 🔁 Metodología de trabajo

1. **Contexto antes que código:** se le da a la IA el contexto por partes y se le pide explícitamente *"aún no generes código"* hasta tener todo definido.
2. **Reglas primero:** antes de escribir código se crea `AGENTS.md` con las reglas que la IA debe seguir durante todo el proyecto.
3. **Pasos pequeños:** cada paso produce un resultado que se puede verificar y termina en un commit.
4. **Validación humana:** cada resultado se revisa antes de aprobarlo. La IA **no hace commit ni push sin autorización**.
5. **Registro continuo:** este documento se actualiza al terminar cada paso, no al final del proyecto.

---

## 📜 Historial de commits

| # | Paso | Commit | Mensaje | Descripción |
|---|---|---|---|---|
| 1 | Paso 1 | `21d812a` | `docs: agregar AGENTS.md con reglas del proyecto` | Commit inicial: reglas de arquitectura, manejo de errores, requisitos, convenciones y testing |
| 2 | Paso 2 | `cee082d` | `chore: inicializar proyecto Next.js 16 con estructura por features` | Proyecto Next.js 16.4, estructura de features y shared, zod, server-only, `.gitignore` y `AGENTS.md` combinado |
| 3 | Pasos 0–2 | *(ver `git log`)* | `docs: agregar VIBE_CODING.md con registro del proceso` | Este documento con el registro de los pasos 0, 1 y 2 |

> Esta tabla se actualiza con cada commit nuevo. El hash de un commit que modifica este archivo se completa en el commit siguiente, porque un commit no puede contener su propio hash.

---

## 🧭 Registro por paso

### Paso 0 — Concepción del proyecto y elección de APIs

**Objetivo:** definir la temática de la app y las APIs que se van a consumir.

**Prompt principal:**
> "Necesito hacer esta actividad. ¿Qué API me recomiendas que no sea algo trivial como Pokémon o Rick and Morty?"

**Iteraciones:**

| # | Propuesta / pregunta | Resultado |
|---|---|---|
| 1 | La IA propuso NASA, football-data.org, RAWG y una app de turismo (REST Countries + Open-Meteo) | Se evaluaron las opciones |
| 2 | Se comparó **CineScope (TMDB)** contra una **app de turismo** | Se eligió turismo por ser más original y porque combinar varias APIs demuestra más nivel técnico |
| 3 | Se acotó el alcance a **Centroamérica** y a 3 APIs | Se evita que el proyecto crezca más de lo que el tiempo permite |

**Decisiones técnicas:**
- **Temática:** turismo en Centroamérica.
- **Nombre de la app:** **Vagando** (al inicio se llamó "Wanderly").
- **APIs:** REST Countries (datos del país), Open-Meteo (clima) y una API de lugares turísticos con key, que sirve además para cumplir el requisito de `.env.local`.

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| El registro en **OpenTripMap** fallaba con **error 500** y nunca llegó el correo de confirmación | La IA propuso cambiar a **Geoapify Places API**, que es gratuita (3000 peticiones/día) y permite iniciar sesión con Google o GitHub. Se actualizó toda la guía del proyecto |
| Dudas sobre cuál de los valores del panel de Geoapify era la API key | Se confirmó cuál era la key sin mostrarla completa. La IA recomendó no compartirla en chats ni capturas y probarla en el navegador antes de usarla |

**Resultado:**

| API | Uso | ¿Usa key? |
|---|---|---|
| [REST Countries](https://restcountries.com) | Datos del país: bandera, capital, moneda, idiomas, coordenadas | No |
| [Open-Meteo](https://open-meteo.com) | Clima actual y pronóstico | No |
| [Geoapify Places](https://www.geoapify.com/places-api) | Lugares turísticos cercanos | Sí |

---

### Paso 1 — Reglas del proyecto (`AGENTS.md`)

**Objetivo:** definir, antes de escribir código, las reglas que la IA debe seguir durante todo el desarrollo.

**Estrategia:** en lugar de un solo prompt gigante, el contexto y las reglas se entregaron **por partes**. Después de cada entrega se revisó lo que generó la IA.

**Prompts principales:**

<details>
<summary>1. Contexto del stack y del repositorio</summary>

> "Ayúdame con el Vibe Coding de una app Front Next con el siguiente stack: Next.js 16 (App Router) + TypeScript + Tailwind. El repo en el que se versionará el código está en la carpeta `vagando-frontend`. Te daré más contexto antes de generar código."
</details>

<details>
<summary>2. Contexto de la app y APIs</summary>

> "Ayúdame a construir 'Vagando', una app con temática de turismo de Centroamérica que consume las siguientes APIs: REST Countries (datos del país, sin key), Open-Meteo (clima, sin key), Geoapify Places API (lugares turísticos, con API key). Aún no generes código, continuaré dando más contexto."
</details>

<details>
<summary>3. Regla 1: Arquitectura basada en features</summary>

> "Antes de escribir código, genera un archivo AGENTS.md con las reglas del proyecto que deberás seguir durante TODO el desarrollo. Debe incluir:
> 1. ARQUITECTURA BASADA EN FEATURES (regla principal): estructura src/app (solo rutas), src/features/&lt;feature&gt;/{components,hooks,services,schemas,types,utils,index.ts} y src/shared/{components/ui,lib,hooks,types}. Features: countries, weather, places, favorites. app/ solo compone componentes; sin lógica de negocio ni fetch directo. Un feature no importa archivos internos de otro; solo se usa su index.ts. shared/ nunca importa de features/. Alias @/ obligatorio."
</details>

<details>
<summary>4. Regla 2: Manejo de errores/excepciones</summary>

> "2. MANEJO DE ERRORES/EXCEPCIONES: clase AppError tipada con código (BAD_REQUEST, NOT_FOUND, UPSTREAM_ERROR, RATE_LIMITED, INTERNAL) y status. Cliente HTTP único en shared/lib/http.ts: verifica res.ok, timeout con AbortSignal.timeout, mapea errores HTTP a AppError. Validación con zod de respuestas externas, query params y variables de entorno. Route Handlers con try/catch y respuesta uniforme { error: { code, message } } + status HTTP correcto. Helper handleRouteError(error) reutilizable. Nunca exponer stack traces, API keys ni mensajes internos al cliente; log en servidor con logger. error.tsx por segmento (con botón Reintentar usando reset()), global-error.tsx, not-found.tsx + notFound(). Hooks de cliente exponen { data, error, isLoading } y cancelan peticiones con AbortController. Prohibido catch vacío. Degradación elegante: si una API secundaria falla (clima o lugares), la página del país sigue funcionando y muestra un estado de error solo en esa sección."
</details>

<details>
<summary>5. Regla 3: Requisitos de la actividad</summary>

> "3. REQUISITOS DE LA ACTIVIDAD (seguiremos buenas prácticas y estándares): Next.js 16+ App Router, TypeScript strict (prohibido any), Tailwind CSS. Mínimo 4 rutas: /, /explore, /country/[code], /country/[code]/places, /favorites. Consumo de APIs mediante Route Handlers en /api/*. Uso combinado de Server Components (por defecto) y Client Components ('use client' solo si hay interactividad). useState y useEffect en hooks de cliente. Diseño responsive mobile-first. loading.tsx con skeletons y estados vacíos en cada listado. Secretos en .env.local; .env.example documentado; nunca NEXT_PUBLIC_ para la API key; import 'server-only' en services. En Next 16, params y searchParams son Promise: siempre await."
</details>

<details>
<summary>6. Reglas 4 y 5: Convenciones y Testing</summary>

> "4. CONVENCIONES: nombres PascalCase.tsx para componentes, useXxx.ts para hooks, xxx.service.ts, xxx.schema.ts. Conventional Commits: feat(scope): ..., fix(scope): ... next/image para imágenes, alt descriptivo, HTML semántico.
> 5. TESTING de cada tarea: npm run lint y npm run build sin errores. Caso de carga, caso de error y caso vacío probados."
</details>

<details>
<summary>7. Nota de control de versiones</summary>

> "Agrega como nota a las reglas: no hacer commit ni push sin mi autorización."
</details>

**Iteraciones:**

| # | Entrega | Qué hizo la IA | Ajuste / revisión |
|---|---|---|---|
| 1 | Primer intento de definir reglas | La IA acumuló el contexto | Se decidió **reiniciar desde cero** para ordenar mejor los prompts y documentar el proceso |
| 2 | Contexto del stack y de las APIs | Confirmó el contexto sin generar código | — |
| 3 | Regla 1 (features) | Creó `AGENTS.md` con estructura, ejemplos ✅/❌ y checklist | Se revisó y se aprobó |
| 4 | Regla 2 (errores) | Agregó la sección con tabla de códigos, ejemplos de `AppError`, `fetchJson`, `handleRouteError`, hooks y un diagrama de degradación elegante | La IA agregó por su cuenta tres reglas de seguridad (ver decisiones), que se aceptaron |
| 5 | Regla 3 (requisitos) | Agregó tablas de rutas y Route Handlers, y reglas de Server/Client, responsive, estados y env | **La IA detectó un conflicto con la Regla 1** y la ajustó (ver desafíos) |
| 6 | Reglas 4 y 5 | Agregó convenciones de nombres, Conventional Commits con scopes, accesibilidad y una tabla para probar los estados de carga, error y vacío | — |
| 7 | Nota de commits | Agregó la nota al inicio del documento y en la sección 4.3 | — |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| **Arquitectura basada en features** como regla principal | Agrupar el código por dominio (`countries`, `weather`, `places`, `favorites`) facilita encontrarlo, mantenerlo y escalar el proyecto |
| Dirección de dependencias `app → features → shared` | Evita dependencias circulares y mantiene `shared` genérico |
| **Consumo de APIs solo vía Route Handlers o en el servidor** | La key de Geoapify nunca llega al navegador |
| Los Server Components llaman directo al service y no a su propio `/api/*` | Hacer HTTP del servidor hacia sí mismo es un salto innecesario y una mala práctica en Next.js |
| Validación con **zod** en las entradas de datos | Las APIs externas pueden cambiar o devolver datos incompletos, y es mejor detectarlo con un error controlado |
| Si Geoapify responde 401/403, el error **no menciona la key** y las URLs con key no se registran completas | Sugerido por la IA para evitar fugas de la key en logs y mensajes |
| `error.tsx` **no muestra `error.message`** al usuario | Sugerido por la IA: en producción el mensaje puede contener información interna |
| Excepción al `catch` vacío para `localStorage` (con log y valor por defecto) | Sugerido por la IA: `localStorage` puede fallar en modo incógnito |
| Commits en **español y en imperativo** | Consistencia con el idioma del proyecto |
| La IA no hace commit ni push sin autorización | Mantener el control humano sobre el historial del repositorio |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| **Conflicto entre reglas:** la Regla 1 decía que cada feature se importa solo por `index.ts`, y la Regla 3 exige `import 'server-only'` en los services. Si `index.ts` exportara los services, un Client Component que importara cualquier componente del feature arrastraría código de servidor y **el build fallaría** | La IA lo detectó al agregar la Regla 3 y propuso **dos puntos de entrada por feature**: `index.ts` (código seguro para el cliente) y `server.ts` (services). Actualizó las secciones 1.1, 1.3, 1.4, 1.5 y 1.8 |
| Ambigüedad: *"consumo de APIs mediante Route Handlers"* frente a Server Components que obtienen datos | Se precisó que los **Client Components** consumen `/api/*` y los **Server Components** usan el service directamente. Ambos caminos comparten el mismo service, así que la lógica no se duplica |
| El mensaje de commit sugerido en la guía estaba en inglés (`docs: add AGENTS.md with project rules`) | Se usó la versión en español para respetar la regla 4.3 del propio `AGENTS.md` |

**Validación:**
- [x] Se leyó el `AGENTS.md` completo.
- [x] Están las dos reglas principales: arquitectura basada en features y manejo de errores/excepciones.
- [x] Están los requisitos de la actividad, las convenciones y el testing.
- [x] Se autorizó el commit y luego el push.

**Commit:**
```
21d812a docs: agregar AGENTS.md con reglas del proyecto
```

---

### Paso 2 — Inicialización del proyecto

**Objetivo:** crear el proyecto Next.js, instalar dependencias y armar la estructura de carpetas definida en `AGENTS.md`.

**Prompt principal:**
> "Siguiendo AGENTS.md, dame los comandos para crear el proyecto Next.js 16 con TypeScript, Tailwind, ESLint, App Router, carpeta src/ y alias @/*. Luego crea la estructura de carpetas vacía de features y shared definida en las reglas, con un index.ts en cada feature. Instala zod y server-only. Configura .gitignore para que incluya .env.local."

**Comandos utilizados:**
```bash
# 1. Generar el proyecto en una carpeta temporal (el repo ya tenía archivos)
npx create-next-app@latest vagando-tmp --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --skip-install --disable-git --yes

# 2. Copiar los archivos generados al repositorio (sin sobrescribir AGENTS.md)

# 3. Instalar dependencias
npm install
npm install zod server-only

# 4. Verificar
npm run lint
npm run build
```

**Iteraciones:**

| # | Qué se pidió | Qué hizo la IA | Ajuste / revisión |
|---|---|---|---|
| 1 | Crear el proyecto | Generó el proyecto en una carpeta temporal en lugar de hacerlo directo en el repo | El repo ya tenía `.git`, `AGENTS.md` y `VIBE_CODING.md`, y `create-next-app` podía sobrescribirlos o rechazar la carpeta |
| 2 | Revisar los archivos generados | Detectó que Next.js 16.4 genera su propio `AGENTS.md` | Se **combinaron** los dos archivos (ver desafíos) |
| 3 | Configurar `.gitignore` | Detectó que la regla por defecto `.env*` también ignoraba `.env.example` | Se agregaron `.env.local` (explícito) y `!.env.example` |
| 4 | Crear la estructura | Creó los 4 features con sus 6 subcarpetas, `index.ts` en cada uno y `server.ts` en los features con services. También creó `shared/` | Se agregaron archivos `.gitkeep` porque Git no versiona carpetas vacías |

**Versiones instaladas:**

| Paquete | Versión |
|---|---|
| `next` | 16.4.6 |
| `react` / `react-dom` | 19.3.0 |
| `tailwindcss` | 4.3.3 |
| `typescript` | 5.x (modo `strict` activado por defecto) |
| `zod` | 4.6.7 |
| `server-only` | 0.0.1 |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| Generar el proyecto en una carpeta temporal y luego copiarlo | Proteger los archivos que ya existían en el repositorio |
| `server.ts` solo en `countries`, `weather` y `places` | `favorites` usa `localStorage` y no tiene código de servidor |
| `.gitkeep` en las carpetas vacías | Que la estructura de features quede versionada desde el primer commit |
| No ejecutar `npm audit fix --force` | Las 8 vulnerabilidades moderadas están en herramientas de desarrollo (ESLint → `minimatch`) que no llegan a producción. `--force` instalaría versiones incompatibles con Next 16 |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| **Next.js 16.4 genera su propio `AGENTS.md`** con un bloque que indica leer la documentación incluida en `node_modules/next/dist/docs/`, porque la versión tiene cambios incompatibles con versiones anteriores. Además, `next dev` vuelve a agregar ese bloque si no está | Se **combinaron** los archivos: el bloque de Next.js quedó al inicio y debajo siguen nuestras reglas. Así `next dev` no genera cambios inesperados en el archivo |
| `.gitignore` con `.env*` impedía versionar `.env.example`, que es un entregable obligatorio | Se agregó la excepción `!.env.example` y se comprobó con `git check-ignore` |
| El `next.config.ts` generado trae activado **`cacheComponents: true`** | Se tendrá en cuenta al obtener datos en los siguientes pasos: este modo cambia cómo funcionan la caché y el renderizado dinámico. Hay que revisar la documentación de `node_modules/next/dist/docs/` antes de implementar los services |

**Validación:**
- [x] `npm run lint`: sin errores
- [x] `npm run build`: build exitoso
- [x] `git check-ignore` confirma que se ignora `.env.local` y se versiona `.env.example`
- [x] La estructura de carpetas coincide con `AGENTS.md` (1.1)

**Commit:**
```
cee082d chore: inicializar proyecto Next.js 16 con estructura por features
```

---

<!--
PLANTILLA PARA LOS SIGUIENTES PASOS (copiar y completar)

### Paso N — <nombre>

**Objetivo:**

**Prompt principal:**
> "..."

**Iteraciones:**

| # | Qué se pidió | Qué hizo la IA | Ajuste / revisión |
|---|---|---|---|
| 1 | | | |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| | |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| | |

**Validación:**
- [ ] npm run lint
- [ ] npm run build
- [ ] Estados de carga, error y vacío probados

**Commit:**
```
<hash> <mensaje>
```
-->

## 📚 Lecciones aprendidas

> Esta sección se completa al final del proyecto.
