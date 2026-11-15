# 🤖 VIBE_CODING.md — Proceso de desarrollo de Vagando

**Vagando** es una app de turismo para Centroamérica: información de los 7 países, clima en tiempo real, lugares turísticos y favoritos. Se construyó con **Vibe Coding**: la IA trabajó como copiloto de desarrollo y el desarrollador conservó el control de las decisiones, la revisión y cada commit.

**Contenido**
1. [Herramienta de IA usada](#1-herramienta-de-ia-usada)
2. [Prompts principales (por paso)](#2-prompts-principales-por-paso)
3. [Iteraciones](#3-iteraciones)
4. [Decisiones técnicas](#4-decisiones-técnicas)
5. [Desafíos y soluciones con IA](#5-desafíos-y-soluciones-con-ia)
6. [Lecciones aprendidas](#6-lecciones-aprendidas)
- [Historial de commits](#-historial-de-commits)
- [Anexo A — Registro detallado por paso](#-anexo-a--registro-detallado-por-paso)

---

## 1. Herramienta de IA usada

| Herramienta | Modelo | Rol en el proyecto |
|---|---|---|
| **Claude Code** (CLI, en la terminal) | Claude Opus 5.5 | Copiloto: redactó las reglas del proyecto, generó y probó el código, consultó la documentación local de Next.js y las APIs reales, revisó el proyecto contra las reglas y propuso los commits |

**Stack:** Next.js 16.4 (App Router, `cacheComponents`), TypeScript en modo `strict`, Tailwind CSS 4 y zod 4.

### Metodología de trabajo

1. **Contexto antes que código.** El contexto se entregó por partes y se le pidió explícitamente a la IA *"aún no generes código"* hasta tenerlo completo.
2. **Reglas primero.** Antes de la primera línea de código se escribió `AGENTS.md` con las reglas que la IA debía seguir en todo el proyecto: arquitectura por features, manejo de errores, requisitos, convenciones y testing.
3. **Documentación antes que memoria.** Next.js 16 trae su propia documentación en `node_modules/next/dist/docs/`. La IA la consultó antes de cada paso, en lugar de confiar en lo que "sabía" de versiones anteriores.
4. **Pasos pequeños y verificables.** Cada paso terminó con `tsc`, `lint` y `build`, pruebas reales contra las APIs y un commit.
5. **Control humano.** La IA **no hizo ningún commit ni push sin autorización explícita**: preparaba los cambios, proponía el mensaje y esperaba.
6. **Revisar y corregir por separado.** En el Paso 11 primero se pidió una revisión *sin corregir nada*, y luego se decidió qué corregir.
7. **Registro continuo.** Este documento se actualizó en cada paso, no al final.

---

## 2. Prompts principales (por paso)

> Resumen de cada prompt. El texto completo de cada uno está en el [Anexo A](#-anexo-a--registro-detallado-por-paso).

| Paso | Prompt principal (resumido) | Resultado |
|---|---|---|
| 0 | *"¿Qué API me recomiendas que no sea algo trivial como Pokémon o Rick and Morty?"* | App de turismo en Centroamérica con REST Countries, Open-Meteo y una API de lugares |
| 1 | Contexto del stack y de las APIs + *"genera un AGENTS.md con las reglas"*, entregado en 5 partes: arquitectura por features, manejo de errores, requisitos de la actividad, convenciones y testing. Más una nota: *"no hacer commit ni push sin mi autorización"* | `AGENTS.md` |
| 2 | *"Dame los comandos para crear el proyecto Next.js 16 con TypeScript, Tailwind, ESLint, App Router, src/ y alias @/\*; crea la estructura de features y shared; instala zod y server-only; configura .gitignore"* | Proyecto inicializado |
| 3 | *"Implementa en shared/lib: errors.ts (AppError), http.ts (fetchJson con timeout y zod), env.ts, logger.ts y api-response.ts (handleRouteError); crea .env.example"* | Capa de manejo de errores |
| 4 | *"Crea Navbar con menú hamburguesa, Footer, Card, Skeleton, Spinner, ErrorState y EmptyState; actualiza el layout con metadata y next/font; paleta temática de viajes; mobile-first"* | UI compartida |
| 5 | *"Crea error.tsx, global-error.tsx, not-found.tsx y loading.tsx; explica la diferencia entre error.tsx y global-error.tsx"* | Pantallas de error y carga |
| 6 | *"Implementa el feature countries: schema zod, service con caché, CountryCard, CountryGrid, /api/countries?q= y la página de inicio con hero"* | Primer feature con datos reales |
| 7 | *"Crea useCountrySearch (useState, useEffect, debounce de 400 ms, AbortController), CountrySearch con filtro por población y la página /explore"* | Buscador |
| 8 | *"Implementa el feature weather (Open-Meteo, revalidate 1800, códigos WMO en español) y /country/[code] con el clima en Suspense; si el clima falla, la página no debe romperse"* | Ficha del país + clima |
| 9 | *"Implementa el feature places con Geoapify: schema tolerante, enum de categorías, 401/403 y 429 mapeados, PlaceCard con imagen de respaldo, KindFilter y /country/[code]/places"* | Lugares turísticos |
| 10 | *"Implementa el feature favorites: useFavorites con localStorage, try/catch, validación zod y sin errores de hidratación; FavoriteButton y /favorites"* | Favoritos |
| 11.1 | *"Revisa todo el proyecto contra AGENTS.md. Lista SIN corregir… Ordénalos por severidad"* | 17 hallazgos |
| 11.2 | *"Validemos que las coordenadas pertenezcan a los 7 países; corrijamos los 4 puntos de severidad media; confirma y documenta"* | 5 correcciones verificadas |
| 11.3 | *"Revisa rendimiento: caché/revalidate por API, next/image, tamaño de los Client Components y metadata para SEO"* | Informe de rendimiento (pendiente de aplicar) |
| 12 | *"Con base en este historial, ayúdame a redactar VIBE_CODING.md con las secciones…"* | Este documento |

**Prompts de control usados durante todo el proyecto:**
- *"Aún no generes código, te daré más contexto."* Así el contexto se completaba antes de empezar.
- *"No hagas nada, luego te daré otro resumen para que pueda tomar captura."* Separaba la captura de pantalla del trabajo.
- *"He revisado, haz el commit y push."* Era la autorización explícita para cada commit.
- *"Siempre actualiza el VIBE_CODING."* Mantenía el registro al día.

---

## 3. Iteraciones

Qué generó la IA, qué estaba mal y cómo se corrigió. Solo están las más importantes; el detalle completo está en el [Anexo A](#-anexo-a--registro-detallado-por-paso).

| Paso | Qué generó la IA | Qué estaba mal | Cómo se corrigió |
|---|---|---|---|
| 1 | Regla 1: cada feature se importa solo por `index.ts`. Regla 3: los services usan `server-only` | **Las dos reglas chocaban.** Si `index.ts` exportaba los services, cualquier Client Component que importara del feature rompería el build | Dos puntos de entrada por feature: `index.ts` (cliente) y `server.ts` (servidor) |
| 2 | Proyecto creado con `create-next-app` | Next 16.4 generó **su propio `AGENTS.md`**, y el `.gitignore` (`.env*`) **ignoraba `.env.example`**, que es un entregable | Se combinaron los dos `AGENTS.md`, y se agregó la excepción `!.env.example` |
| 3 | `fetchJson` con `next: { revalidate }` | Con `cacheComponents`, la caché ya no se configura así | La IA leyó la documentación local: la caché se declara con `'use cache'` + `cacheLife()` |
| 3 | Prueba con REST Countries | **La API v3.1 estaba dada de baja** (ver Desafíos) | Migración a la v5 |
| 4 | Navbar con el link activo (`usePathname`) | **Rompía el build** en rutas dinámicas con `cacheComponents` | `<Suspense>` alrededor del link activo; se comprobó quitándolo a propósito |
| 5 | `error.tsx` con `reset()` (como pedía el prompt) | Desde Next 16.3 lo recomendado es **`retry()`**, que vuelve a pedir los datos | Se usó `retry()` y se actualizó `AGENTS.md` |
| 5 | `<a href="/">` + `eslint-disable` en `global-error.tsx` | Nuestras propias reglas prohíben `eslint-disable` | Se quitó y se usó `<Link>` |
| 6 | Imports `../schemas/...` | Violaban la regla 1.7 (alias `@/` obligatorio) | Se cambiaron por `@/features/...` |
| 6 | `handleRouteError` | **Capturaba señales internas de Next.js** y las registraba como "Error no controlado" | `unstable_rethrow(error)` al inicio |
| 7 | El ejemplo de hook en `AGENTS.md` (`setIsLoading(true)` dentro del efecto) | **No pasaba el lint** de React 19 (`react-hooks/set-state-in-effect`) | `isLoading` derivado; se corrigió la regla |
| 7 | El barrel `index.ts` exportaba el hook | El build falló: *"importing a module that depends on useState into a Server Component"* | `'use client'` en los archivos de hooks |
| 7 | Hook con `fetch` directo | Sin conexión, el usuario habría visto **"Failed to fetch"** (en inglés) | `fetchApi` + `ApiRequestError` con mensajes en español |
| 8 | Página del país en desarrollo | El servidor de desarrollo tenía un módulo viejo en caché (*"is not a function"*) | Se reinició el servidor; el build de producción ya estaba bien |
| 9 | Prueba con una **key falsa de Geoapify** | Respondía **500** en lugar del 502 esperado (ver Desafíos) | Patrón `CachedResult`, aplicado a los 3 services |
| 10 | Corazón de favoritos en la tarjeta | La tarjeta completa es un `<a>`; un `<button>` dentro de un enlace es HTML inválido | Botón fuera del enlace, posicionado encima |
| 11 | Revisión del proyecto | Las APIs aceptaban coordenadas de cualquier parte del mundo (Tokio → 200) | Validación por rectángulos de los 7 países → 400 |
| 11 | Ajustes visuales pedidos por el desarrollador: *"card al 90%"*, *"redúcelo al 80%"*, *"hover en verde más oscuro"* | El 80% quedaba angosto en móvil | `page-container` mobile-first: ancho completo / 90% / 80% |

---

## 4. Decisiones técnicas

### ¿Por qué arquitectura basada en features?
- **Cohesión:** todo lo de "clima" está en `features/weather`: componentes, hook, service, schema, tipos y utilidades. Para cambiar el clima se toca una sola carpeta.
- **Aislamiento:** un feature solo se usa a través de su `index.ts` (cliente) o `server.ts` (servidor). La dirección de dependencias es única y está documentada (`countries → favorites`; `weather` y `places` no dependen de nadie), así se evitan los ciclos.
- **`app/` solo compone.** Las páginas importan componentes y services; no tienen `fetch` ni lógica de negocio.
- **`shared/` es genérico.** Errores, HTTP, logger y UI base, sin conocer el dominio.

### ¿Por qué zod?
- **Las APIs externas cambian sin avisar.** Gracias a zod se detectó la baja de REST Countries v3.1: sin validación, la app habría intentado mostrar un mensaje de error como si fuera un país.
- **Una sola fuente de verdad:** los tipos se derivan de los schemas (`z.infer`), y los schemas además **transforman** la respuesta al modelo propio. Por ejemplo, los nombres en español de REST Countries y los arreglos paralelos de Open-Meteo convertidos en lista de días.
- **Se valida en las 4 entradas de datos:** respuestas externas, query params, variables de entorno y `localStorage`.
- **Schemas tolerantes:** los datos de OpenStreetMap llegan incompletos, así que se descarta solo el elemento inválido, no la respuesta entera.

### ¿Por qué Route Handlers como proxy?
- **Las keys nunca llegan al navegador.** Los Client Components solo llaman a `/api/*`; las keys viven en el servidor (`server-only`, `getServerEnv()`). Se verificó en cada paso que no aparecieran en el HTML, las respuestas ni los logs.
- **Formato de error uniforme:** `{ error: { code, message } }` con el status correcto, y mensajes en español que no revelan detalles internos.
- **Los Server Components no llaman a su propio `/api/*`:** usan el mismo service directamente, sin un salto HTTP innecesario.
- **El proxy no es abierto:** solo acepta coordenadas dentro de los 7 países, así nadie puede agotar la cuota de las keys.

### Estrategia de caché
| Fuente | Caché | Motivo |
|---|---|---|
| REST Countries | 1 día (`cacheLife('days')`) | Cuota de **1000 peticiones/mes**. Una sola petición trae los 7 países, y buscar o abrir un país reutiliza esa lista |
| Open-Meteo | 30 min (`cacheLife({ revalidate: 1800 })`) | El clima cambia, pero no a cada minuto |
| Geoapify | 1 día por coordenada y categoría | Los lugares casi no cambian; cuota de 3000/día |
| Fallas | Unos segundos (`cacheLife('seconds')`) | Un error no debe quedar guardado un día entero |

- Con `cacheComponents`, la caché se declara con **`'use cache'` + `cacheLife()`** en los services, no en `fetch`.
- Las páginas de los 7 países se **prerenderizan** en el build (`generateStaticParams`).
- **Pendiente para producción (Paso 11.3):** en Vercel, la caché en memoria no persiste entre peticiones; la propuesta es `'use cache: remote'` para los países.

### Otras decisiones
- **Degradación elegante:** si falla el clima o los lugares, la ficha del país sigue funcionando; el error queda solo en esa sección.
- **`isLoading` derivado** en los hooks: nunca queda "pegado" y cumple el lint de React 19.
- **Favoritos:** se guardan solo los códigos; si `localStorage` falla, se usa una copia en memoria.
- **Accesibilidad:** HTML semántico, `aria-pressed`, `aria-live`, link "saltar al contenido", foco visible en tarjetas y contraste AA.

---

## 5. Desafíos y soluciones con IA

### 5.1 APIs dadas de baja, que ya no funcionaban o que respondían con error 500

Fue el desafío más frecuente del proyecto: **lo que dicen los tutoriales y la documentación antigua ya no coincidía con lo que las APIs responden hoy.**

| API | Qué pasó | Cómo se detectó | Solución con la IA |
|---|---|---|---|
| **OpenTripMap** (API de lugares elegida al inicio) | El registro para obtener la key **respondía error 500** y nunca llegaba el correo de confirmación. Sin key no se podía usar | Al intentar registrarse en el sitio | La IA propuso **Geoapify Places** (gratuita, 3000 peticiones/día, registro con Google o GitHub). Se actualizó toda la guía del proyecto |
| **REST Countries v3.1** (y v1, v2, v4) | La versión que usan casi todos los tutoriales (`restcountries.com/v3.1/...`) **fue dada de baja**. Ya no devuelve países: redirige (301) a un aviso de deprecación. Nuestra API terminaba respondiendo **502 "respuesta inesperada"** en lugar de datos | En el Paso 3, una prueba real de `fetchJson`: la validación con zod rechazó la respuesta | La IA investigó la documentación oficial y planteó dos opciones; se eligió **migrar a la v5**, que **ahora exige API key** (1000 peticiones/mes). Se probó la forma real de la respuesta con la key pública de demo, sin gastar cuota |
| **REST Countries v5** (la nueva) | No es un reemplazo directo: **cambió la base URL** (`api.restcountries.com/countries/v5`), los **nombres de los campos** (`name` → `names`, `cca3` → `codes.alpha_3`...), el parámetro de filtro (`?fields=` → `?response_fields=`), el formato (`{ data: { objects } }`) y, al buscar un código inexistente, devuelve una **lista vacía en lugar de 404** | Al adaptar el prompt del Paso 6, que estaba escrito para la v3.1 | Schema nuevo que transforma la v5 al modelo propio (con nombres en español), y el service lanza `NOT_FOUND` por su cuenta |
| **Nuestra propia API respondiendo 500** con una key inválida | Con una key falsa de Geoapify, `/api/places` respondía **500 "error inesperado"** en lugar de 502. Un `AppError` lanzado dentro de `'use cache'` **pierde su tipo en producción**. Afectaba sin que se notara a los 3 services | En el Paso 9, probando un build de producción con una key falsa | Patrón **`CachedResult`** (de la documentación de Next): la falla se devuelve y se vuelve a lanzar fuera de la caché |

### 5.2 APIs del propio framework que cambiaron (Next.js 16)

| Lo que pedían los prompts o "sabía" la IA | Lo que exige Next 16.4 | Cómo se descubrió |
|---|---|---|
| `fetch(url, { next: { revalidate } })` | `'use cache'` + `cacheLife()` con `cacheComponents` | Documentación local, antes de programar el Paso 3 |
| `reset()` en `error.tsx` | **`retry()`** (desde 16.3) | Documentación local, Paso 5 |
| `priority` en `next/image` | **`preload`** (`priority` está deprecado) | Documentación local, Paso 6 |
| `dynamicParams = false` para un 404 real | **No existe** con `cacheComponents` | Documentación local, Paso 8 |
| `usePathname()` libre en el layout | Requiere **`<Suspense>`** en rutas dinámicas o el build falla | Documentación + prueba provocando el error, Paso 4 |
| `await params` en la página | También requiere un límite de `<Suspense>` (`loading.tsx`) | Prueba de build, Paso 4 |

> **Clave:** el `AGENTS.md` que genera Next 16 dice *"This is NOT the Next.js you know"*. La IA leyó la documentación incluida en `node_modules/next/dist/docs/` antes de cada paso, y eso evitó muchos errores.

### 5.3 Otros desafíos

| Desafío | Solución con apoyo de la IA |
|---|---|
| Errores de hidratación con `localStorage` | Estado inicial vacío (igual al del servidor), lectura en `useEffect` y bandera `isReady` |
| Dependencia circular entre `countries` y `favorites` | Tipo estructural propio en `favorites` y dirección única de dependencias |
| Geoapify no trae fotos (0 de ~90 lugares) | Imagen de respaldo temática por categoría |
| La key de Geoapify solo se acepta en la URL | `fetchJson` y el logger nunca registran la URL completa; se verificó en las respuestas, el HTML y los logs |
| Probar errores sin romper las APIs reales | Rutas temporales de prueba y fallas simuladas (URL inválida o key falsa), que se eliminaban antes de cada commit |

---

## 6. Lecciones aprendidas

1. **Las reglas escritas guían mejor a la IA que las instrucciones sueltas.** `AGENTS.md` se convirtió en el contrato: la IA lo consultaba, lo citaba y lo actualizaba cuando aprendía algo nuevo (`retry()`, `'use cache'`, `CachedResult`).
2. **La IA también se equivoca, y nuestras reglas también.** Un ejemplo de `AGENTS.md` no pasaba el lint, y dos reglas chocaban entre sí. Revisar el resultado, y no solo aceptarlo, fue lo que más valor aportó.
3. **No confiar en tutoriales ni en la memoria del modelo.** REST Countries v3.1, OpenTripMap y varias APIs de Next.js habían cambiado. Probar contra la API real y leer la documentación de la versión instalada evitó horas de depuración.
4. **Validar datos externos no es opcional.** zod convirtió un cambio silencioso de la API en un error claro y controlado.
5. **Probar los caminos de error, no solo el camino feliz.** Los bugs más importantes aparecieron con fallas simuladas: la key falsa, el clima caído, la falta de conexión y coordenadas de otros países.
6. **Separar "revisar" de "corregir".** Pedir primero la lista de problemas, sin cambios, permitió decidir con criterio qué corregir y en qué orden.
7. **Pasos pequeños + commits autorizados = historial claro.** Cada commit cuenta una parte de la historia, y este documento la explica.
8. **Pensar en producción desde el principio.** La cuota de las APIs y el comportamiento de la caché en serverless cambian la estrategia; no basta con que funcione en local.

---

## 📜 Historial de commits

| # | Paso | Commit | Mensaje | Descripción |
|---|---|---|---|---|
| 1 | Paso 1 | `21d812a` | `docs: agregar AGENTS.md con reglas del proyecto` | Commit inicial: reglas de arquitectura, manejo de errores, requisitos, convenciones y testing |
| 2 | Paso 2 | `cee082d` | `chore: inicializar proyecto Next.js 16 con estructura por features` | Proyecto Next.js 16.4, estructura de features y shared, zod, server-only, `.gitignore` y `AGENTS.md` combinado |
| 3 | Pasos 0–2 | `ba71e58` | `docs: agregar VIBE_CODING.md con registro del proceso` | Este documento con el registro de los pasos 0, 1 y 2 |
| 4 | Paso 3 | `f37ccc6` | `feat(shared): agregar manejo de errores, cliente HTTP y validación de entorno` | `AppError`, `fetchJson`, `getServerEnv`, logger, `handleRouteError`, `.env.example` y migración documentada a REST Countries v5 |
| 5 | Paso 4 | `9baea80` | `feat(ui): agregar componentes compartidos, layout y paleta de viajes` | Navbar, Footer, Card, Skeleton, Spinner, ErrorState, EmptyState, paleta, fuentes y layout |
| 6 | Paso 5 | `24a1e9f` | `feat(errors): agregar páginas de error, 404 y loading globales` | `error.tsx` con `retry()`, `global-error.tsx`, `not-found.tsx`, `loading.tsx` y `reportClientError` |
| 7 | Paso 6 | `eae45a7` | `feat(countries): agregar feature de países, /api/countries y página de inicio` | Feature `countries` con REST Countries v5 cacheada, `/api/countries`, inicio real, `unstable_rethrow`, contenedor al 80% y hover verde oscuro |
| 8 | Paso 7 | `c017873` | `feat(countries): agregar página /explore con búsqueda y filtro por población` | `useCountrySearch` (debounce, AbortController, `isLoading` derivado), `CountrySearch`, `/explore`, `fetchApi` |
| 9 | Paso 8 | `5d8b438` | `feat(weather): agregar clima, /api/weather y detalle de país con degradación elegante` | Feature `weather`, `/api/weather`, `/country/[code]` con clima en `<Suspense>` y degradación elegante |
| 10 | Paso 9 | `6798508` | `feat(places): agregar lugares turísticos con Geoapify y /country/[code]/places` | Feature `places`, `/api/places`, página de lugares y fix de errores dentro de `'use cache'` (`CachedResult`) |
| 11 | Paso 10 | `b9e8a6b` | `feat(favorites): agregar favoritos con localStorage y página /favorites` | `useFavorites` con `localStorage`, `FavoriteButton`, `FavoritesList` y `/favorites` |
| 12 | Paso 11 | `c3b89ac` | `fix: corregir hallazgos de severidad alta y media de la revisión` | Validación regional de coordenadas, foco en tarjetas, contraste, `page-container` responsive y `RouteErrorView` |
| 13 | Paso 12 | `51a9cd7` | `docs(vibe): reorganizar VIBE_CODING.md y documentar APIs deprecadas` | Este documento en 6 secciones, con los desafíos de APIs dadas de baja o con error 500 y el registro por paso en el Anexo A |

> Esta tabla se actualiza con cada commit nuevo. Como un commit no puede contener su propio hash, después de cada commit de funcionalidad se hace un commit `docs(vibe): ...` que registra el hash. Esos commits de registro no se listan en esta tabla.

---

## 📎 Anexo A — Registro detallado por paso

Texto completo de cada prompt, iteraciones, decisiones, desafíos, validación y commit de cada paso.

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
| [REST Countries](https://restcountries.com) | Datos del país: bandera, capital, moneda, idiomas, coordenadas | No *(en el Paso 3 se descubrió que la v5 sí la requiere)* |
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

### Paso 3 — Capa compartida: errores, HTTP, entorno y logger

**Objetivo:** construir en `src/shared/lib` la base del manejo de errores que usarán todos los features.

**Prompt principal:**
> "Siguiendo AGENTS.md, implementa en src/shared/lib: errors.ts (clase AppError + type guard isAppError); http.ts (función fetchJson&lt;T&gt;(url, schema, options) que use AbortSignal.timeout(10000), valide res.ok, mapee 400/404/429/5xx a AppError y valide la respuesta con el schema zod); env.ts (validación con zod de GEOAPIFY_API_KEY, solo servidor, con 'server-only'); logger.ts (logger simple con error, warn e info que solo registre en servidor); api-response.ts (helper handleRouteError(error) que devuelva NextResponse.json con el formato { error: { code, message } } y el status correcto, sin exponer detalles internos). Crea también .env.example documentado. Explícame brevemente cada archivo."

**Archivos creados:**

| Archivo | Responsabilidad |
|---|---|
| `src/shared/lib/errors.ts` | `AppError` con código y status (el status sale por defecto del código) e `isAppError` |
| `src/shared/lib/http.ts` | `fetchJson`: timeout, `res.ok`, conversión de errores HTTP, validación con zod. Es `server-only` |
| `src/shared/lib/env.ts` | `getServerEnv()`: valida `REST_COUNTRIES_API_KEY` y `GEOAPIFY_API_KEY` con zod la primera vez que se usa. Es `server-only` |
| `src/shared/lib/logger.ts` | Logger JSON que solo escribe en el servidor y oculta keys y tokens de URLs y mensajes |
| `src/shared/lib/api-response.ts` | `handleRouteError`: respuesta uniforme `{ error: { code, message } }` |
| `src/shared/types/api.types.ts` | Tipo `ApiErrorBody`, que compartirán los Route Handlers y los hooks de cliente |
| `.env.example` | Documentación de `REST_COUNTRIES_API_KEY` y `GEOAPIFY_API_KEY` |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | Antes de escribir código, la IA leyó la documentación incluida en `node_modules/next/dist/docs/` (lo exige el bloque de Next.js en `AGENTS.md`) | Descubrió que con `cacheComponents: true` la caché se configura con `'use cache'` y `cacheLife()`, no con `next: { revalidate }` | `fetchJson` no recibe opciones de caché. Se actualizó `AGENTS.md` 2.3 |
| 2 | Se generaron los 6 archivos y el `.env.example` | `tsc`, `lint` y `build` sin errores | — |
| 3 | Se creó una **ruta temporal de prueba** (`/api/dev-test`) para provocar cada tipo de error y verlo funcionando | 6 de 8 casos respondieron como se esperaba | Los casos `ok` y `notfound` contra REST Countries fallaron (ver desafíos) |
| 4 | Se eliminó la ruta de prueba y se limpió `.next` | Build limpio | Los tipos que Next genera para las rutas quedaron obsoletos tras borrar la ruta, y se resolvió borrando `.next` |

**Pruebas del manejo de errores (ruta temporal):**

| Caso | Cómo se provocó | Respuesta al cliente | ¿Correcto? |
|---|---|---|---|
| Timeout | `timeoutMs: 1` | `502 UPSTREAM_ERROR` "tardó demasiado en responder" | ✅ |
| Red caída | Dominio inexistente | `502 UPSTREAM_ERROR` "No pudimos conectar" | ✅ |
| Key inválida | Geoapify con key falsa (HTTP 401) | `502 UPSTREAM_ERROR` "rechazó la solicitud", **sin mencionar la key** | ✅ |
| Respuesta inesperada | Schema que no coincide con la respuesta | `502 UPSTREAM_ERROR` "respuesta inesperada" | ✅ |
| Variable de entorno faltante | Sin `.env.local` | `500 INTERNAL` mensaje genérico; el log del servidor dice qué variable falta | ✅ |
| Error no controlado | `throw new Error('...detalle secreto')` | `500 INTERNAL` mensaje genérico; el detalle secreto **no** llega al cliente | ✅ |
| Seguridad en logs | Revisión del log de Geoapify | El log registra `https://api.geoapify.com/v2/places`, sin la key | ✅ |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| El `status` de `AppError` tiene un valor por defecto según el código | Evita inconsistencias (por ejemplo, `NOT_FOUND` con status 500) |
| Si la API externa responde 401/403, se convierte en `UPSTREAM_ERROR` (502) y no en 401 | El problema es de nuestra credencial, no del usuario. Responder 401 lo confundiría |
| Las URLs se guardan sin query params en `cause` y en los logs, y además el logger aplica `redact()` | Doble protección para que la key nunca termine en un log |
| `fetchJson` respeta un `signal` externo y no lo convierte en error | Si quien llama cancela la petición, no es una falla y no debe aparecer como error |
| `env.ts` valida de forma **perezosa** (`getServerEnv()`) | Si validara al importarse, el build fallaría en Vercel antes de configurar la key |
| `env.ts` rechaza el valor de ejemplo `your_geoapify_api_key_here` | Detecta cuando se copió `.env.example` sin reemplazar el valor |
| `http.ts`, `env.ts` y `api-response.ts` usan `server-only`; `logger.ts` y `errors.ts` no | `errors.ts` y `logger.ts` se pueden usar en cliente sin riesgo (el logger no escribe nada en el navegador) |
| `ApiErrorBody` vive en `shared/types` | Así los hooks de cliente pueden leer el error sin importar código de servidor |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| **`cacheComponents` cambia el modelo de caché de Next.js 16.** Nuestro `AGENTS.md` asumía `fetch(..., { next: { revalidate } })` | La IA leyó la documentación local de Next antes de programar y ajustó tanto la firma de `fetchJson` como la regla en `AGENTS.md` |
| **REST Countries v3.1 está deprecada.** La API ahora redirige (301) a una respuesta `200` con `{ "success": false, "errors": [...] }` en lugar de datos. La v5 está en `api.restcountries.com` y **requiere API key** (plan gratuito de 1000 peticiones al mes) | La prueba lo detectó gracias a la validación con zod: sin el schema, la app habría intentado usar un objeto de error como si fuera un país. La IA investigó la documentación oficial de la v5 y planteó dos opciones: **(A)** obtener una key gratuita de la v5 o **(B)** guardar los datos de los 7 países en un JSON local. **Se eligió la opción A** para mantener una API real (ver la decisión abajo) |

**Decisión: migrar a REST Countries v5 (opción A)**

| Aspecto | Detalle |
|---|---|
| Base URL | `https://api.restcountries.com/countries/v5` |
| Autenticación | Header `Authorization: Bearer <key>`. La documentación oficial lo recomienda sobre el query param `api-key`, porque así la key no queda en logs ni en el historial |
| Límites del plan gratuito | 1000 peticiones/mes y 20 peticiones cada 10 s (si se excede, responde 429). Al agotar la cuota mensual, y tras un periodo de gracia, responde 403 |
| Formato de respuesta | `{ data: { objects: [...] } }`, con campos renombrados (`names.common`, `codes.alpha_3`...). Se verificó con la key pública de demo `rc_live_demo`, que no consume cuota |
| Impacto en el código | `env.ts` ahora valida dos variables (`REST_COUNTRIES_API_KEY` y `GEOAPIFY_API_KEY`) y rechaza cualquier valor que empiece con `your_` (valores de ejemplo) |
| Impacto en la caché | Como la cuota es mensual y los países casi no cambian, el service de `countries` deberá cachear por largo tiempo con `'use cache'` + `cacheLife` |
| Documentación actualizada | `AGENTS.md` (tabla de APIs, 2.3 y 3.8), `.env.example` y este documento |

**Validación:**
- [x] `npx tsc --noEmit`: sin errores
- [x] `npm run lint`: sin errores
- [x] `npm run build`: build exitoso
- [x] Los casos de error probados en tiempo de ejecución se comportan como se esperaba
- [x] Se eliminó la ruta temporal de prueba

**Commit:**
```
f37ccc6 feat(shared): agregar manejo de errores, cliente HTTP y validación de entorno
```

---

### Paso 4 — UI compartida y layout

**Objetivo:** crear los componentes de interfaz reutilizables, la paleta de colores y el layout global de la app.

**Prompt principal:**
> "Siguiendo AGENTS.md, crea en src/shared/components/ui componentes reutilizables y responsive: Navbar (con menú hamburguesa en mobile, links a /, /explore, /favorites), Footer, Card, Skeleton, Spinner, ErrorState (mensaje + botón reintentar opcional) y EmptyState. Actualiza app/layout.tsx con Navbar, Footer, metadata y una fuente de next/font. Paleta de colores temática de viajes. Mobile-first."

**Archivos creados / modificados:**

| Archivo | Tipo | Descripción |
|---|---|---|
| `shared/components/ui/Navbar.tsx` | Server | Header sticky con logo, navegación de escritorio y menú móvil |
| `shared/components/ui/ActiveNavLinks.tsx` | Client | Marca el link activo con `usePathname()` |
| `shared/components/ui/NavLinkList.tsx` | Presentacional | Lista de links (`aria-current="page"` en el activo) |
| `shared/components/ui/MobileMenu.tsx` | Client | Menú hamburguesa con `useState`/`useEffect`: se cierra con Escape o al tocar un link |
| `shared/components/ui/Footer.tsx` | Server | Descripción y créditos de las fuentes de datos |
| `shared/components/ui/Logo.tsx` | Server | Logo SVG (pin de mapa con ola) |
| `shared/components/ui/Card.tsx` | Server | Tarjeta con etiqueta semántica configurable (`article`, `li`...) |
| `shared/components/ui/Skeleton.tsx` | Server | Bloque de carga, que respeta `prefers-reduced-motion` |
| `shared/components/ui/Spinner.tsx` | Server | Indicador de carga con `role="status"` |
| `shared/components/ui/ErrorState.tsx` | Server/Client | Error con botón "Reintentar" opcional y variantes `page`/`section` |
| `shared/components/ui/EmptyState.tsx` | Server | Estado vacío con acción opcional (link) |
| `shared/components/ui/Button.tsx` | Server | Botón con variantes, y `buttonClassName()` para links con estilo de botón *(extra)* |
| `shared/lib/cn.ts` | — | Une clases condicionales *(extra)* |
| `shared/lib/site-config.ts` | — | Nombre, navegación y créditos del sitio *(extra)* |
| `app/globals.css` | — | Paleta de viajes con tokens semánticos y modo oscuro |
| `app/layout.tsx` | Server | Fuentes, metadata, `viewport`, Navbar, Footer y link "Saltar al contenido" |
| `app/page.tsx` | Server | **Temporal:** vista previa de los componentes (se reemplaza en el Paso 6) |
| `app/icon.svg` | — | Favicon de Vagando (reemplaza el de Next.js) |

**Paleta "Centroamérica":**

| Token | Claro | Inspiración |
|---|---|---|
| `primary` (laguna) | `#0f766e` | Turquesa del Caribe y de los lagos volcánicos |
| `accent` (atardecer) | `#e8613c` | Puestas de sol en el Pacífico |
| `background` (arena) | `#fbf8f3` | Playas |
| `success` (selva) | `#15803d` | Bosque tropical |
| `danger` (volcán) | `#b91c1c` | Volcanes activos |

**Fuentes (`next/font/google`):** *Plus Jakarta Sans* para el texto (legible en móvil) y *Fraunces* para los títulos (estilo de revista de viajes). Ambas son variables, así que no hace falta declarar pesos.

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | Antes de programar, la IA leyó la documentación local de `usePathname` y `next/font` | Descubrió que con `cacheComponents`, **`usePathname` se suspende en rutas dinámicas** y el build falla si no está dentro de `<Suspense>` | El Navbar se dividió: el shell es de servidor y solo `ActiveNavLinks` es de cliente, envuelto en `<Suspense>` con un fallback que muestra los mismos links sin marcar el activo |
| 2 | Se generaron los componentes, el layout y la paleta | `tsc`, `lint` y `build` sin errores | — |
| 3 | **Prueba del Suspense:** se creó una ruta dinámica temporal (`/country/[code]`) y se quitó el `<Suspense>` del Navbar | El build falló con `usePathname() in a Client Component outside of <Suspense>`, lo que confirma que la protección es necesaria | Se restauró el Navbar y se borró la ruta temporal |
| 4 | La misma prueba reveló que **`await params` en una página también necesita `<Suspense>`** | El build falló con `blocking-prerender-dynamic` | Se documentó en `AGENTS.md` (3.9): cada ruta dinámica necesita su `loading.tsx` |
| 5 | Se sirvió el build de producción y se revisó el HTML generado | Presentes: `lang="es"`, link "Saltar al contenido", ambas navegaciones, `aria-current`, créditos, título y favicon | — |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| **Tokens semánticos** (`bg-surface`, `text-muted`, `bg-primary`) en lugar de colores fijos | El modo oscuro funciona automáticamente con `prefers-color-scheme`, sin repetir clases `dark:` en cada componente |
| Navbar de servidor con "islas" de cliente (`ActiveNavLinks`, `MobileMenu`) | Regla 3.4: el Client Component es pequeño y va en las hojas del árbol |
| Los links del menú móvil se renderizan en el servidor y llegan a `MobileMenu` como `children` | El componente de cliente solo maneja abrir y cerrar, sin duplicar la lista de links |
| `ErrorState` **no** lleva `'use client'` | Si se usa sin `onRetry` en un Server Component (degradación elegante), no agrega JavaScript al navegador |
| El Footer **no muestra el año** | Con `cacheComponents`, `new Date()` en un Server Component vuelve dinámica la ruta, y no vale la pena por un dato decorativo |
| Créditos de las APIs en el Footer | Open-Meteo (CC BY 4.0) y los datos de OpenStreetMap que usa Geoapify (ODbL) **exigen atribución** |
| `site-config.ts` como fuente única de nombre, navegación y créditos | Evita repetir textos entre Navbar, Footer y metadata |
| Accesibilidad: "Saltar al contenido", `aria-expanded`/`aria-controls`, botones de 44px, foco visible, `motion-safe`/`motion-reduce` | Reglas 3.6 y 4.5–4.6 de `AGENTS.md` |
| Se eliminaron los SVG y el favicon de la plantilla de Next.js | No se usaban y mostraban la marca de Next/Vercel |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| `usePathname()` rompe el build en rutas dinámicas con `cacheComponents` | Se envolvió en `<Suspense>` con un fallback equivalente, y se comprobó provocando el error a propósito |
| Las páginas con `await params` también necesitan `<Suspense>` | Se anticipó el problema del Paso 8 y se documentó en `AGENTS.md` 3.9, antes de que apareciera |
| `ErrorState` con `onRetry` no puede recibir funciones desde un Server Component | Se documentó en el propio componente: `onRetry` solo se pasa desde Client Components (por ejemplo, `reset` en `error.tsx`) |

**Validación:**
- [x] `npx tsc --noEmit`: sin errores
- [x] `npm run lint`: sin errores
- [x] `npm run build`: build exitoso (también con una ruta dinámica de prueba)
- [x] HTML de producción revisado (`lang`, accesibilidad, metadata y créditos)
- [x] Revisión visual en 320px, 768px y 1280px (realizada por el desarrollador con `npm run dev`)

**Commit:**
```
9baea80 feat(ui): agregar componentes compartidos, layout y paleta de viajes
```

---

### Paso 5 — Error UI global, 404 y loading

**Objetivo:** crear las pantallas globales de error, página no encontrada y carga del App Router.

**Prompt principal:**
> "Siguiendo AGENTS.md (manejo de errores), crea: app/error.tsx (Client Component, usa ErrorState, botón Reintentar con reset(), log del error); app/global-error.tsx (incluye &lt;html&gt; y &lt;body&gt;); app/not-found.tsx con diseño temático y link al inicio; app/loading.tsx con skeleton genérico. Explica la diferencia entre error.tsx y global-error.tsx."

**Archivos creados / modificados:**

| Archivo | Descripción |
|---|---|
| `app/error.tsx` | Límite de error de las páginas: `ErrorState` + "Reintentar" (`retry()`) + "Volver al inicio" + código de referencia (`digest`) |
| `app/global-error.tsx` | Último recurso si falla el layout raíz: documento propio (`<html>`, `<body>`, estilos, fuentes y `<title>`) |
| `app/not-found.tsx` | 404 temática ("Este destino no está en el mapa") con ilustración SVG, metadata y links a Inicio y Explorar |
| `app/loading.tsx` | Skeleton genérico (encabezado + grilla de 6 tarjetas) con `role="status"` |
| `shared/lib/report-client-error.ts` | Registro de errores del navegador: completo en desarrollo, solo el `digest` en producción *(extra)* |
| `shared/lib/fonts.ts` | Fuentes compartidas entre `layout.tsx` y `global-error.tsx` *(extra)* |

**Diferencia entre `error.tsx` y `global-error.tsx`:**

| | `error.tsx` | `global-error.tsx` |
|---|---|---|
| ¿Qué captura? | Errores de las páginas y layouts **anidados** de su segmento | Errores del **layout raíz** (`app/layout.tsx`), que `error.tsx` no alcanza a capturar |
| ¿Qué se ve? | Se renderiza **dentro** del layout: Navbar y Footer siguen visibles | **Reemplaza todo el documento**: no hay Navbar ni Footer |
| `<html>` y `<body>` | No los lleva (los pone el layout) | **Obligatorios**, porque es un documento completo |
| Estilos y fuentes | Los hereda del layout | Debe importarlos por su cuenta |
| Metadata | Hereda la del layout | No admite `export const metadata`; usa `<title>` de React |
| ¿Cuándo aparece? | Es el caso común: falló una página o una API | Rara vez: es el último recurso cuando falla la base de la app |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | La IA leyó la documentación local de `error.js`, `not-found.js` y `loading.js` antes de programar | Descubrió que **desde Next 16.3 existe `retry()`** y es la opción recomendada sobre `reset()`, y que `error` ahora es de tipo `unknown` | Se usó `retry()` en lugar del `reset()` pedido en el prompt (ver decisiones) y se actualizó `AGENTS.md` 2.7 |
| 2 | Se generaron los 4 archivos | `tsc` OK, pero **lint falló**: `no-html-link-for-pages` por usar `<a href="/">` en `global-error.tsx` | La IA había puesto un `eslint-disable`, pero lo quitó porque `AGENTS.md` 5.1 lo prohíbe. Se cambió por `<Link>` |
| 3 | Se creó una ruta temporal `/dev-error` que lanza un error del servidor con un "secreto" (`apiKey=ABC123`) y se probó con un build de producción | Al navegador solo llegó el `digest` (`3359488600`); el secreto **no** se envió | — |
| 4 | Se probó una URL inexistente (`/no-existe`) | HTTP **404**, página temática, título "Página no encontrada · Vagando" y `noindex` | — |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| **`retry()` en lugar de `reset()`** (cambio respecto al prompt) | `reset()` re-renderiza sin volver a pedir datos, así que si falló una API, falla igual. `retry()` vuelve a consultar al servidor, que es lo que corrige un error temporal |
| `error` tipado como `unknown` | Así lo define la documentación de Next 16; un Client Component puede lanzar valores que no son `Error` |
| Se muestra el `digest` como "Código de referencia" | Permite relacionar lo que ve el usuario con el log del servidor, sin exponer detalles |
| `reportClientError` en lugar de `logger` | `logger` solo escribe en el servidor por diseño. En el navegador, en producción solo se registra el `digest` |
| `global-error.tsx` sin Navbar ni Footer | Si falló el layout, esos componentes podrían ser la causa |
| Fuentes extraídas a `shared/lib/fonts.ts` | `global-error.tsx` reemplaza al layout y necesita las mismas fuentes, así se evita duplicar la configuración |
| `loading.tsx` en la raíz | Además del skeleton, crea el límite de `<Suspense>` que `cacheComponents` exige para los datos dinámicos (`AGENTS.md` 3.9) |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| El prompt pedía `reset()`, pero la versión instalada de Next recomienda `retry()` | La IA leyó la documentación incluida en `node_modules` (como indica `AGENTS.md`), explicó la diferencia y usó `retry()` |
| Lint rechazó `<a href="/">` en `global-error.tsx` | En lugar de desactivar la regla, se corrigió el código con `<Link>`, respetando `AGENTS.md` 5.1 |
| Con `curl` no se ve la UI de `error.tsx`, porque se renderiza en el navegador | Se verificó en el HTML que solo viaja el `digest` (sin el secreto), y la vista final se revisa en el navegador |
| El log del servidor de Next.js muestra el mensaje original del error | Es el comportamiento esperado: el detalle queda **solo en el servidor**. Los errores reales de la app nunca incluyen keys, porque `fetchJson` quita los query params (Paso 3) |

**Validación:**
- [x] `npx tsc --noEmit`: sin errores
- [x] `npm run lint`: sin errores (sin `eslint-disable`)
- [x] `npm run build`: build exitoso
- [x] Error del servidor: el secreto no llega al navegador, solo el `digest`
- [x] 404: HTTP 404, página temática y `noindex`
- [x] Ruta temporal `/dev-error` eliminada antes del commit
- [x] Capturas de pantalla tomadas por el desarrollador (error, 404 y loading)

**Commit:**
```
24a1e9f feat(errors): agregar páginas de error, 404 y loading globales
```

---

### Paso 6 — Feature `countries`, `/api/countries` y página de inicio

**Objetivo:** implementar el primer feature con datos reales: schema, service, componentes, Route Handler y la página de inicio.

**Prompt principal:**
> "Siguiendo AGENTS.md, implementa el feature countries: schemas/country.schema.ts (schema zod con solo los campos que usamos: name, cca3, flags, capital, capitalInfo.latlng, population, region, subregion, currencies, languages, latlng); types derivados con z.infer; services/countries.service.ts ('server-only'): getCentralAmericaCountries() y getCountryByCode(code), usando fetchJson y el parámetro ?fields= de REST Countries. Si no existe el país, lanzar AppError NOT_FOUND. Usa caché de Next (revalidate: 86400) porque estos datos casi no cambian; components: CountryCard, CountryGrid; Route Handler app/api/countries/route.ts con query param opcional ?q= para filtrar por nombre, validado con zod, usando handleRouteError. Exporta lo público en features/countries/index.ts. Luego crea la página app/page.tsx (Server Component) con un hero y la grilla de países destacados."

> **Nota de proceso:** primero se envió por error el prompt del Paso 7 (`/explore`). La IA detectó que dependía de `/api/countries`, que todavía no existía, y se retomó el orden correcto de la guía.

**Adaptaciones al prompt (el prompt se escribió para REST Countries v3.1):**

| El prompt pedía | Se implementó | Motivo |
|---|---|---|
| Campos `name`, `cca3`, `flags`, `capital`, `capitalInfo.latlng`, `latlng` | `names`, `codes.alpha_3`, `flag`, `capitals[].coordinates`, `coordinates` | Son los nombres de la **v5** (la v3.1 está dada de baja). Se verificaron con la key de demo `rc_live_demo` |
| Parámetro `?fields=` | `?response_fields=` | Así se llama en la v5 |
| `revalidate: 86400` | `'use cache'` + `cacheLife('days')` | Con `cacheComponents` la caché se declara en la función. `days` revalida cada 1 día, el equivalente a 86400 s |
| `getCountryByCode(code)` con su propia petición | Busca dentro de la lista cacheada | Ahorra cuota: el plan gratuito tiene **1000 peticiones/mes** |

**Archivos creados:**

| Archivo | Descripción |
|---|---|
| `features/countries/schemas/country.schema.ts` | `restCountrySchema` (formato v5) → `countrySchema` (transforma al modelo de la app, con **nombres en español**); envoltorio de respuesta; `countriesQuerySchema`; `countryCodeSchema` |
| `features/countries/types/country.types.ts` | `Country`, `CountriesQuery` y `CountriesResponse`, derivados con `z.infer` |
| `features/countries/services/countries.service.ts` | `getCentralAmericaCountries` (cacheada), `searchCountries` y `getCountryByCode` |
| `features/countries/utils/constants.ts` | `CENTRAL_AMERICA_CODES` (lista blanca de los 7 países) |
| `features/countries/utils/filterCountries.ts` | Búsqueda sin tildes ni mayúsculas por nombre (ES/EN), capital o código |
| `features/countries/utils/formatPopulation.ts` | `6029976` → `"6 M"` y `"6.029.976"` |
| `features/countries/components/CountryCard.tsx` | Tarjeta con bandera (`next/image`), capital, población e idioma |
| `features/countries/components/CountryGrid.tsx` | Grilla responsive con `EmptyState` si no hay países |
| `features/countries/components/CountriesHero.tsx` | Portada con banderas, datos reales (7 países, población total) y CTAs *(extra)* |
| `app/api/countries/route.ts` | `GET /api/countries?q=` |
| `app/page.tsx` | Inicio real: hero + grilla (reemplaza la vista previa del Paso 4) |
| `next.config.ts` | `remotePatterns` para `flags.restcountries.com` |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | La IA consultó la forma real de la v5 con la key de demo (sin gastar cuota) y la documentación de endpoints y errores | Los campos cambiaron de nombre, la búsqueda por código **no devuelve 404** sino una lista vacía, y existen traducciones al español | El service detecta la lista vacía y lanza `NOT_FOUND` por su cuenta |
| 2 | Se generó el código | `tsc` y `lint` OK, pero la IA había usado imports `../schemas/...` | Corregido a `@/features/countries/...` por la regla 1.7 de `AGENTS.md` |
| 3 | Prueba con la **key real** a través de `/api/countries` | 7 países con nombres en español (Belice, Panamá...) | — |
| 4 | Pruebas de búsqueda | Funcionan `salv`, `PANAMA` sin tilde, la capital `managua`, el nombre en inglés `belize` y el vacío `zzzz`, y un texto de 51 caracteres → **400** | — |
| 5 | Verificación de seguridad | La key **no aparece** ni en el HTML ni en la respuesta de la API | — |
| 6 | Build de producción | **Bug encontrado:** `handleRouteError` capturaba una **señal interna de Next.js** ("bail out of prerendering") y la registraba como "Error no controlado" | Se agregó `unstable_rethrow(error)` en `handleRouteError` (documentación oficial) y se documentó en `AGENTS.md` 2.5 |
| 7 | Build con una **key inválida** (simulando Vercel sin variables) | El build falla al prerenderizar `/` | Es el comportamiento deseado: se documentó en `AGENTS.md` 3.8 que las keys deben configurarse antes del deploy |
| 8 | **Ajuste visual pedido por el desarrollador** tras revisar la página: *"que la card tenga el 90% del ancho de la página y los mouse over de los botones en un verde más oscuro"* | Se creó la utilidad `page-container` (`width: 80%`; primero se probó con 90% y el desarrollador pidió reducirlo a 80%), usada por `<main>`, Navbar y Footer para que todo quede alineado. El token `--primary-hover` pasó a `#134e4a`, y **todos** los botones (primary, secondary, ghost y el botón del menú móvil) usan ese verde con texto blanco en hover | Se reemplazó `max-w-6xl` en los 3 contenedores; el gradiente del hero también se oscurece, porque usa el mismo token |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| **Una sola petición** a `/subregion/Central America`, cacheada 1 día | Con 1000 peticiones/mes, buscar y abrir países no debe consumir cuota. La página de inicio queda **prerenderizada** (`Revalidate 1d`) |
| Lista blanca `CENTRAL_AMERICA_CODES` | La subregión de la ONU también incluye a México; Vagando cubre solo los 7 países del istmo |
| Validar cada país por separado (`safeParse`) | Si un país viene con formato inesperado, se omite solo ese (con `logger.warn`) en lugar de romper toda la lista |
| `countrySchema` transforma al modelo propio | Los componentes no dependen del formato de la API; si la API vuelve a cambiar, solo se toca el schema |
| Nombres en español desde `names.translations.spa` | La interfaz es en español; el nombre en inglés se conserva para la búsqueda |
| Código inválido (`X1`) → `NOT_FOUND` y no `BAD_REQUEST` | Para el usuario es un destino que no existe, así que debe ver la página 404 |
| `next/image` sin `preload` en la grilla | En Next 16 `priority` está deprecado y `preload` no se recomienda cuando varias imágenes compiten por el LCP |
| `server.ts` importa `server-only` | Doble protección para que los services nunca lleguen al navegador |
| Ancho de página como **utilidad única** (`@utility page-container` en `globals.css`) | Cambiar el ancho en un solo lugar mantiene alineados el Navbar, el contenido y el Footer |
| Hover de botones con el **token** `--primary-hover` y no con un color fijo | El cambio se aplica a todos los botones a la vez y funciona en modo oscuro (`#0d9488`) |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| El prompt usaba campos y parámetros de la v3.1, que ya no existe | Se investigó la v5 con la key de demo y su documentación, y se adaptó todo el schema |
| `handleRouteError` "se tragaba" señales internas de Next.js | `unstable_rethrow(error)` como primera línea; ahora todos los Route Handlers quedan protegidos |
| Las capitales vienen en inglés ("Guatemala City", "Panama City") | La v5 no traduce las capitales. Se muestran tal como vienen (es una limitación conocida) |

**Validación:**
- [x] `npx tsc --noEmit`: sin errores
- [x] `npm run lint`: sin errores
- [x] `npm run build`: exitoso; `/` estática con revalidación de 1 día y `/api/countries` dinámica
- [x] `/api/countries`: búsqueda, vacío y error 400 probados
- [x] La key no se expone en HTML ni en las respuestas
- [x] Build con key inválida → falla de forma controlada
- [x] Revisión visual del desarrollador (ajustes de ancho y hover aplicados)

**Commit:**
```
eae45a7 feat(countries): agregar feature de países, /api/countries y página de inicio
```

---

### Paso 7 — Página `/explore` con buscador (Client Component)

**Objetivo:** crear la página de exploración con búsqueda en tiempo real, usando `useState` y `useEffect` en un hook propio.

**Prompt principal:**
> "Siguiendo AGENTS.md, crea en el feature countries: hooks/useCountrySearch.ts (hook con useState y useEffect que consulte /api/countries?q=, con debounce de 400 ms, AbortController en el cleanup y retorno { data, error, isLoading }); components/CountrySearch.tsx ('use client'): input de búsqueda + filtro por población + grilla, mostrando Skeleton mientras carga, ErrorState si falla y EmptyState si no hay resultados; app/explore/page.tsx (Server Component) que renderice CountrySearch; app/explore/loading.tsx."

**Archivos creados / modificados:**

| Archivo | Tipo | Descripción |
|---|---|---|
| `features/countries/hooks/useCountrySearch.ts` | Hook (`'use client'`) | `useState` + `useEffect`, debounce de 400 ms, `AbortController`, `isLoading` derivado y `retry` |
| `features/countries/components/CountrySearch.tsx` | Client | Formulario `role="search"`, input con `<label>`, `<select>` de población, resumen con `aria-live` y los 4 estados |
| `features/countries/components/CountryGridSkeleton.tsx` | Server | Skeleton con la forma exacta de la grilla (reutilizado en `loading.tsx`) |
| `features/countries/utils/populationFilters.ts` | — | Rangos de población (<5 M, 5–10 M, >10 M) y su filtro |
| `app/explore/page.tsx` | Server | Encabezado + metadata ("Explorar destinos · Vagando") + `CountrySearch` |
| `app/explore/loading.tsx` | Server | Skeleton del encabezado, el formulario y la grilla |
| `shared/lib/fetch-api.ts` | — | `fetchApi` + `ApiRequestError`: errores de red o de la API → mensaje en español *(extra)* |
| `shared/lib/read-api-error.ts` | — | Lee `{ error: { code, message } }` *(extra)* |
| `shared/components/ui/EmptyState.tsx` | — | Ahora acepta `children` para acciones personalizadas ("Limpiar filtros") |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 0 | Se envió primero este prompt, antes del Paso 6 | La IA detectó que `/api/countries` no existía todavía | Se hizo primero el Paso 6 y luego se retomó este |
| 1 | Antes de programar, la IA revisó las reglas de lint activas | **`react-hooks/set-state-in-effect` está activa como error**, y el ejemplo de `AGENTS.md` 2.8 (`setIsLoading(true)` dentro del efecto) **la violaba** | El hook se diseñó con `isLoading` **derivado**, y se corrigió el ejemplo en `AGENTS.md` |
| 2 | Primer build | **Falló:** *"You're importing a module that depends on `useState` into a React Server Component"*. El barrel `index.ts` reexporta el hook, y `page.tsx` y `route.ts` importan de ese mismo barrel | Se agregó `'use client'` al archivo del hook y se documentó como regla en `AGENTS.md` 2.8 |
| 3 | Revisión del manejo de errores del hook | Sin conexión, el navegador lanza `"Failed to fetch"` (en inglés) y el usuario lo habría visto | Se creó `fetchApi` + `ApiRequestError`: el usuario solo ve mensajes preparados en español |
| 4 | Build final y revisión del HTML de `/explore` | `/explore` es **estática** (○); el HTML trae título, formulario, labels, skeleton inicial y el link activo en el Navbar | — |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| **`isLoading` derivado** (`resultado.query !== query`) en lugar de `useState` | Cumple `react-hooks/set-state-in-effect` y evita estados inconsistentes: es imposible que `isLoading` quede "pegado" en `true` |
| La primera carga sin debounce (0 ms), las búsquedas con 400 ms | Al entrar, el usuario ve resultados de inmediato; mientras escribe, no se dispara una petición por tecla |
| Skeleton solo en la **primera** carga; en búsquedas siguientes, spinner + grilla semitransparente | Mostrar el skeleton en cada tecla haría parpadear la página |
| Búsqueda de texto en el servidor (`/api/countries?q=`) y filtro de población en el cliente | Cumple el requisito de consumir el Route Handler, y filtrar 7 países en el cliente es instantáneo |
| `retry` en el hook, conectado a "Reintentar" de `ErrorState` | Un error temporal se recupera sin recargar la página |
| `'use client'` en el archivo del hook | Permite reexportarlo en el barrel sin romper a los Server Components que importan del mismo `index.ts` |
| Accesibilidad: `role="search"`, `<label>` en cada campo, `aria-live` con el conteo de resultados, `maxLength` igual al límite del servidor | Reglas 3.6 y 4.6 de `AGENTS.md` |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| El ejemplo de hook en nuestras propias reglas no pasaba el lint de React 19 | Se rediseñó el patrón (estado derivado) y se corrigió la regla en `AGENTS.md` |
| Barrel `index.ts` compartido entre Server y Client Components | `'use client'` en los archivos de hooks, documentado para los próximos features |
| Mensajes técnicos del navegador ("Failed to fetch") | `fetchApi` en `shared/lib`, reutilizable por el hook de `places` del Paso 9 |

**Validación:**
- [x] `npx tsc --noEmit`: sin errores
- [x] `npm run lint`: sin errores (incluida `react-hooks/set-state-in-effect`)
- [x] `npm run build`: exitoso, `/explore` estática
- [x] HTML del servidor de `/explore` revisado (título, formulario, labels, skeleton)
- [x] Prueba en el navegador: debounce (una sola petición en Network), Offline → error con "Reintentar", `zzzz` → vacío con "Limpiar filtros", Slow 4G → skeleton *(revisada por el desarrollador antes de aprobar el commit)*

**Commit:**
```
c017873 feat(countries): agregar página /explore con búsqueda y filtro por población
```

---

### Paso 8 — Feature `weather` y detalle del país `/country/[code]`

**Objetivo:** mostrar la ficha de cada país con clima en tiempo real, sin que una falla del clima rompa la página.

**Prompt principal:**
> "Siguiendo AGENTS.md, implementa el feature weather: schema zod para la respuesta de Open-Meteo, services/weather.service.ts ('server-only'): getWeather(lat, lon), revalidate 1800, utils/weatherCode.ts: mapear weather_code de WMO a descripción en español + emoji. Components: CurrentWeather, ForecastList (responsive: scroll horizontal en mobile, grid en desktop). Route Handler app/api/weather/route.ts con ?lat=&lon= validados con zod (rangos válidos). Luego crea app/country/[code]/page.tsx (Server Component, recuerda await params): datos del país (bandera, capital, moneda, idiomas, población); sección de clima envuelta en &lt;Suspense&gt; con su propio fallback; si el clima falla, la página NO debe romperse: mostrar ErrorState solo en esa sección; si el código de país no existe, llamar a notFound(); generateMetadata dinámico con el nombre del país. Agrega loading.tsx y error.tsx para ese segmento."

**Archivos creados / modificados:**

| Archivo | Descripción |
|---|---|
| `features/weather/schemas/weather.schema.ts` | Respuesta de Open-Meteo → modelo propio (los arreglos paralelos de `daily` pasan a una lista de días) y `weatherQuerySchema` con rangos de lat/lon |
| `features/weather/services/weather.service.ts` | `getWeather(lat, lon)`: valida, redondea las coordenadas y cachea 30 min con `'use cache'` + `cacheLife({ revalidate: 1800 })` |
| `features/weather/utils/weatherCode.ts` | Los 28 códigos WMO → descripción en español + emoji (luna de noche) |
| `features/weather/utils/formatForecastDay.ts` | "Hoy", "Mañana", "mar 17", y fecha larga para lectores de pantalla |
| `features/weather/components/CurrentWeather.tsx` | Temperatura, condición, sensación térmica, humedad y viento |
| `features/weather/components/ForecastList.tsx` | 7 días: scroll horizontal con *snap* en móvil y grilla de 7 columnas desde `md` |
| `features/weather/components/WeatherSection.tsx` | Sección asíncrona con **degradación elegante** |
| `features/weather/components/WeatherSkeleton.tsx` | Skeleton del clima |
| `app/api/weather/route.ts` | `GET /api/weather?lat=&lon=` |
| `features/countries/components/CountryDetail.tsx` | Bandera (`preload`), nombre, nombre oficial y 6 datos clave |
| `features/countries/components/CountryDetailSkeleton.tsx` | Skeleton de la ficha |
| `features/countries/utils/getCountryLocation.ts` | Coordenadas de la capital (o del país, si no hay capital) |
| `features/countries/services/countries.service.ts` | Nuevo `findCountryByCode` (devuelve `null`), pensado para páginas que llaman a `notFound()` |
| `shared/components/ui/RefreshButton.tsx` | "Reintentar" con `router.refresh()` para secciones del servidor *(extra)* |
| `app/country/[code]/page.tsx` | `generateStaticParams`, `generateMetadata`, `notFound()`, URL canónica y clima en `<Suspense>` |
| `app/country/[code]/loading.tsx` y `error.tsx` | Skeleton completo, y error con `retry()` |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | La IA consultó la respuesta real de Open-Meteo y la documentación de `cacheLife`, `generateStaticParams` y `dynamicParams` | `precipitation_probability_max` puede ser `null`; **`dynamicParams` no existe con `cacheComponents`**; `cacheLife` acepta un objeto (`{ revalidate: 1800 }`) | Schema con `.nullable()`; los códigos desconocidos se resuelven con `notFound()` al momento de la petición |
| 2 | Primer `tsc` | Falló: `PageProps<'/country/[code]'>` no existía | Los tipos de rutas los genera Next en el build: se ejecuta `build` antes que `tsc` |
| 3 | Build | `/country/BLZ` y `/country/CRI` **estáticas con el clima incluido** (revalidación de 30 min); el resto, con prerenderizado parcial (◐) | Es el fallback de `connection()`: si el clima falla en el build, se pospone a la petición en lugar de congelar el error |
| 4 | Prueba en dev | `/country/SLV` mostraba solo el skeleton: *"findCountryByCode is not a function"* | El servidor de desarrollo tenía el módulo en caché, así que se reinició. El build de producción ya compilaba bien |
| 5 | Pruebas funcionales | `/country/SLV`: ficha, clima actual y 7 días. `/country/XXX`: 404 temática con "Destino no encontrado" y `noindex`. `/api/weather`: 200 y errores 400 (lat fuera de rango, faltante o no numérica) | — |
| 6 | **Prueba de degradación elegante:** se cambió temporalmente la URL de Open-Meteo por un dominio inválido | `/country/GTM` mostró la ficha completa y **solo** la sección del clima con "No pudimos obtener el clima" + "Reintentar". `error.tsx` no se activó | Se restauró la URL y el clima volvió a mostrarse |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| `generateStaticParams` con los 7 países | Las fichas se prerenderizan en el build reutilizando la lista cacheada: **0 peticiones extra** a REST Countries |
| `WeatherSection` hace el `catch` y no lo propaga | Degradación elegante (`AGENTS.md` 2.10): el clima es una fuente secundaria |
| `unstable_rethrow` + `await connection()` en el `catch` | No captura señales internas de Next, y evita que un fallo durante el build deje el error fijo en la página estática |
| `RefreshButton` con `router.refresh()` | Un Server Component no puede pasar `onRetry` (una función) a un Client Component |
| Coordenadas redondeadas a 2 decimales antes de cachear | Coordenadas casi iguales comparten la misma entrada de caché |
| `findCountryByCode` (`null`) y `getCountryByCode` (`AppError`) | Las páginas necesitan `notFound()`; los Route Handlers, un `AppError` con status 404 |
| `/country/slv` → `permanentRedirect('/country/SLV')` | Una sola URL canónica por país |
| Clima de la **capital** (o del centro del país si no hay capital) | Es la referencia más útil para un viajero |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| `notFound()` en `/country/XXX` responde HTTP 200 (con `noindex`) en lugar de 404 | Es el comportamiento documentado con `cacheComponents`: el status se envía con el shell, antes de que la página decida. Como `dynamicParams` no existe en este modo, se acepta y queda documentado. Google respeta el `noindex` |
| Igual con la redirección de minúsculas: llega como 200 y redirige en el navegador | Mismo motivo; el usuario termina igualmente en `/country/SLV` |
| Probar la degradación sin una API caída de verdad | Se simuló la caída cambiando la URL temporalmente y se verificó el HTML; luego se restauró el código |
| Monedas y capitales en inglés ("United States dollar", "Guatemala City") | La v5 de REST Countries no las traduce; es una limitación conocida |

**Validación:**
- [x] `npm run build`: exitoso (fichas de países estáticas o con prerenderizado parcial; `/api/weather` dinámica)
- [x] `npx tsc --noEmit` y `npm run lint`: sin errores
- [x] Ficha del país, clima actual y pronóstico verificados
- [x] `notFound()` para códigos inexistentes
- [x] `/api/weather`: respuesta válida y errores 400
- [x] Degradación elegante: falla del clima → error solo en su sección
- [x] Revisión visual en móvil (scroll horizontal del pronóstico) *(revisada por el desarrollador)*

**Commit:**
```
5d8b438 feat(weather): agregar clima, /api/weather y detalle de país con degradación elegante
```

---

### Paso 9 — Feature `places` (Geoapify) y página `/country/[code]/places`

**Objetivo:** mostrar lugares turísticos cerca de la capital de cada país, con filtro por categoría.

**Prompt principal:**
> "Implementa el feature places con Geoapify Places API: schema zod tolerante (muchos lugares vienen sin nombre o sin datos; filtra los que no tengan nombre); services/places.service.ts ('server-only'): getPlacesNear(lat, lon, kind) usando la key desde env.ts. Mapea 401/403 a AppError (key inválida, sin exponer la key) y 429 a RATE_LIMITED. Route Handler app/api/places/route.ts con ?lat=&lon=&kind= validados (kind restringido a un enum: sights, museums, nature, beaches, food; mapea cada uno a categorías de Geoapify: tourism.sights, entertainment.museum, natural, beach, catering.restaurant). Components: PlaceCard (con imagen de respaldo si no hay foto), PlacesList, KindFilter ('use client'). app/country/[code]/places/page.tsx: lugares cerca de la capital, con filtro por categoría. loading.tsx, error.tsx y EmptyState cuando no hay lugares. No olvides agregar un link desde el detalle del país hacia /places."

> **Nota de proceso:** el prompt se envió primero con la indicación de *no hacer nada todavía*, para que el desarrollador tomara capturas; la IA solo confirmó lo recibido y adelantó consideraciones. Luego llegó el prompt definitivo.

**Archivos creados / modificados:**

| Archivo | Descripción |
|---|---|
| `features/places/utils/placeKinds.ts` | Las 5 categorías: etiqueta, emoji, categoría de Geoapify y **radio por categoría** |
| `features/places/schemas/place.schema.ts` | Schema **tolerante** del GeoJSON; descarta los lugares sin nombre; solo acepta fotos de Wikimedia y sitios web `http(s)`; `placesQuerySchema` con el enum de `kind` |
| `features/places/services/places.service.ts` | `getPlacesNear(lat, lon, kind)`: ordena por distancia, cachea 1 día y usa mensajes de error específicos |
| `features/places/hooks/usePlaces.ts` | `useState` + `useEffect` con `AbortController`, `isLoading` derivado, `retry` y `dataKind` |
| `features/places/components/PlaceCard.tsx` | Tarjeta con categoría, dirección, distancia a la capital, "Ver en el mapa" (OpenStreetMap) y sitio web |
| `features/places/components/PlaceImage.tsx` | Foto o **imagen de respaldo temática** (degradado + paisaje + emoji por categoría) |
| `features/places/components/PlacesList.tsx` | Grilla con `EmptyState` que ofrece cambiar de categoría |
| `features/places/components/KindFilter.tsx` | Botones con `aria-pressed`; en móvil se desplazan en horizontal |
| `features/places/components/PlacesExplorer.tsx` | Filtro + estados de carga, error, vacío y resultados |
| `features/places/components/PlacesSkeleton.tsx` | Skeleton de la grilla |
| `app/api/places/route.ts` | `GET /api/places?lat=&lon=&kind=` |
| `app/country/[code]/places/` | `page.tsx` (con `generateStaticParams` y metadata), `loading.tsx` y `error.tsx` |
| `shared/lib/coordinates.ts` | `coordinatesSchema` y `roundCoordinate`, movidos desde `weather` para compartirlos *(refactor)* |
| `shared/lib/cached-result.ts` | Patrón para errores dentro de `'use cache'` *(corrección, ver iteración 4)* |
| `next.config.ts` | `remotePatterns` para `upload.wikimedia.org` |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | La IA consultó Geoapify con la key real (sin mostrarla) en las 5 categorías | **Ninguno de ~90 lugares trae foto**; en `natural` solo 5 de 20 tienen nombre; las playas están a más de 10 km de San Salvador; key inválida → 401; categoría inválida → 400 | La imagen de respaldo será el caso normal; se usa un radio distinto por categoría (10 a 120 km) |
| 2 | Se generó el feature; durante la revisión se detectó un caso borde | Mientras carga otra categoría, las tarjetas viejas habrían mostrado la etiqueta de la categoría nueva | `usePlaces` devuelve también `dataKind` |
| 3 | Pruebas con la key real | Las 5 categorías responden ordenadas por distancia; en Guatemala, el radio de 120 km encuentra playas; errores 400 en español; **la key no aparece** en la API, el HTML ni el log | — |
| 4 | Prueba con **key inválida** en un build de producción | **Bug:** respondía `500 INTERNAL` en lugar de `502 UPSTREAM_ERROR`. El log mostró que un `AppError` lanzado dentro de `'use cache'` sale como un `Error` genérico | Se aplicó el patrón de la documentación de Next (*conditional cache lifetimes*): la falla se **devuelve** con `cacheLife('seconds')` y se vuelve a lanzar fuera de la caché. Se aplicó a **los 3 services** (countries, weather y places) |
| 5 | Nueva prueba con key inválida | `502 UPSTREAM_ERROR` "No pudimos obtener los lugares turísticos en este momento", la URL en el log **sin key**, y clima y países siguen funcionando | — |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| El listado se carga en el **cliente** (`usePlaces` → `/api/places`) | El filtro es interactivo; cumple `AGENTS.md` 3.3 (el cliente solo consume Route Handlers) y 3.5 (`usePlaces` con `useState`/`useEffect`) |
| Radio por categoría (10–120 km) | Museos y restaurantes están en la ciudad; playas y naturaleza, lejos de la capital |
| Se piden 48 lugares y se muestran hasta 24 | Compensa los que se descartan por no tener nombre |
| Fotos solo de `upload.wikimedia.org` | `next/image` exige dominios declarados; aceptar cualquier URL externa sería inseguro |
| Imagen de respaldo con el estilo de cada categoría | Geoapify casi nunca trae fotos; un recuadro gris haría ver la página rota |
| "Ver en el mapa" con OpenStreetMap | No requiere API key (los mapas estáticos de Geoapify expondrían la key en el `src` de la imagen) |
| `coordinatesSchema` en `shared/lib` | Clima y lugares validan lo mismo; `AGENTS.md` 1.4: lo compartido va a `shared` |
| Mensajes de error específicos de lugares en el service | El usuario ve "lugares turísticos" y no un genérico "servicio externo" |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| **Los errores dentro de `'use cache'` pierden su tipo en producción** (también afectaba, sin que se hubiera notado, a `/api/countries` y `/api/weather`) | Patrón `CachedResult` con lifetimes condicionales, tomado de la documentación local de Next; documentado como regla en `AGENTS.md` 2.3 |
| La key de Geoapify solo se acepta en la URL | `fetchJson` registra la URL sin query params y `logger.redact()` oculta `apiKey`; verificado en las respuestas, el HTML y los logs |
| Datos incompletos de OpenStreetMap (sin nombre, sin foto) | Schema tolerante + filtro + imagen de respaldo |
| Resultados de cadenas en "Gastronomía" (por ejemplo, Pizza Hut) | Son datos reales de OpenStreetMap. Mejora posible: priorizar los restaurantes sin `brand` |

**Validación:**
- [x] `npm run build`: exitoso (24 páginas; `/api/places` dinámica; páginas de lugares estáticas o con prerenderizado parcial)
- [x] `npx tsc --noEmit` y `npm run lint`: sin errores
- [x] `/api/places`: las 5 categorías, categoría por defecto y errores 400 (categoría inválida, lat fuera de rango o faltante)
- [x] Key inválida → 502 con mensaje amigable, sin exponer la key
- [x] Link "Ver lugares turísticos" desde el detalle del país
- [x] Prueba en el navegador: filtro de categorías, estado vacío, imagen de respaldo y Offline → error con "Reintentar" *(revisada por el desarrollador)*

**Commit:**
```
6798508 feat(places): agregar lugares turísticos con Geoapify y /country/[code]/places
```

---

### Paso 10 — Feature `favorites` y página `/favorites`

**Objetivo:** permitir guardar destinos favoritos en el navegador y verlos en su propia página.

**Prompt principal:**
> "Implementa el feature favorites: hooks/useFavorites.ts ('use client'): useState + useEffect para leer y escribir en localStorage, con try/catch (localStorage puede fallar en modo incógnito) y validación zod de lo leído. Evita errores de hidratación (solo leer localStorage dentro de useEffect). Components: FavoriteButton (corazón en CountryCard y en el detalle), FavoritesList. app/favorites/page.tsx con EmptyState si no hay favoritos."

**Archivos creados / modificados:**

| Archivo | Descripción |
|---|---|
| `features/favorites/schemas/favorites.schema.ts` | Valida lo leído de `localStorage`: arreglo de códigos ISO de 3 letras, máximo 50 y sin duplicados |
| `features/favorites/utils/favoritesStorage.ts` | `readFavorites`/`writeFavorites` con `try/catch`, **copia en memoria** de respaldo y evento de sincronización |
| `features/favorites/hooks/useFavorites.ts` | `useState` + `useEffect`: lee después del montaje, se suscribe a cambios (esta pestaña y otras) y expone `isReady` |
| `features/favorites/components/FavoriteButton.tsx` | Corazón (`icon`) para tarjetas y botón con texto (`full`) para el detalle, con `aria-pressed` |
| `features/favorites/components/FavoriteCard.tsx` | Tarjeta del favorito con su botón para quitarlo |
| `features/favorites/components/FavoritesList.tsx` | Skeleton hasta leer `localStorage`, estado vacío y lista |
| `features/favorites/types/favorites.types.ts` | `FavoriteCountry`: tipo estructural para no depender de `countries` |
| `features/countries/components/CountryCard.tsx` | Corazón en la esquina de la tarjeta (**fuera** del `<Link>`) |
| `features/countries/components/CountryDetail.tsx` | Botón "Guardar en favoritos" junto a "Ver lugares turísticos" |
| `app/favorites/page.tsx` y `loading.tsx` | Página de favoritos (Server Component) y su skeleton |

**Iteraciones:**

| # | Qué se hizo | Resultado | Ajuste / revisión |
|---|---|---|---|
| 1 | Antes de programar, la IA probó con archivos temporales si `react-hooks/set-state-in-effect` permitía la lectura inicial de `localStorage` dentro de `useEffect` | Lint aceptó el patrón (la lectura se hace dentro de una función que también se usa como listener de eventos) | Se usó `useState` + `useEffect`, tal como pedía el prompt |
| 2 | Diseño de la dependencia entre features | `CountryCard` (countries) necesita `FavoriteButton` (favorites), y `FavoritesList` (favorites) necesita datos de países: riesgo de **dependencia circular** | `favorites` define su propio tipo estructural `FavoriteCountry` y recibe los países por props; solo `countries` importa `favorites` |
| 3 | Colocación del corazón en `CountryCard` | Toda la tarjeta es un `<Link>`, y un `<button>` dentro de un `<a>` es HTML inválido | El botón va **fuera** del enlace, posicionado en la esquina con `absolute` |
| 4 | Build y revisión del HTML del servidor | Las 5 rutas existen; `/favorites` es estática; el servidor envía el **skeleton** (no el estado vacío); 7 corazones con `aria-pressed="false"` y ninguno dentro de un `<a>` | — |

**Decisiones técnicas:**

| Decisión | Motivo |
|---|---|
| Se guardan **solo los códigos** (`["SLV","PAN"]`) | Los datos del país siempre vienen frescos de REST Countries; no se duplica información en el navegador |
| Validación con zod de lo leído | `localStorage` puede tener datos corruptos o manipulados; si no son válidos, se reinicia sin romper la app |
| `isReady` + skeleton | El servidor no conoce `localStorage`: sin esto, se vería "Aún no tienes favoritos" por un instante antes de mostrar la lista |
| Botón deshabilitado hasta `isReady` | El primer clic nunca usa un estado incorrecto |
| Sincronización con un evento propio + evento `storage` | Al quitar un favorito, se actualizan todos los corazones y la lista, incluso en otras pestañas |
| Escritura que lee el valor actual antes de modificarlo | Dos componentes no se pisan los cambios |
| **Copia en memoria** si `localStorage` falla | En modo incógnito estricto o con el almacenamiento lleno, los favoritos siguen funcionando durante la sesión |
| La página obtiene los países en el servidor (lista cacheada) | 0 peticiones extra a REST Countries; el cliente solo filtra por los códigos guardados |

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| Hidratación: el servidor no puede leer `localStorage` | Estado inicial vacío (igual al del servidor) + lectura en `useEffect` + `isReady` |
| Dependencia circular entre `countries` y `favorites` | Tipo estructural en `favorites` y dirección única de dependencias, documentada en `AGENTS.md` 1.4 |
| Botón dentro de un enlace | Botón fuera del `<Link>` y posicionado encima de la tarjeta |

**Validación:**
- [x] `npm run build`: exitoso; **las 5 rutas** (`/`, `/explore`, `/country/[code]`, `/country/[code]/places`, `/favorites`)
- [x] `npx tsc --noEmit` y `npm run lint`: sin errores
- [x] `favorites` no importa de `countries` (verificado con `grep`)
- [x] HTML del servidor: skeleton en `/favorites`, corazones accesibles y fuera de los enlaces
- [x] Prueba en el navegador: guardar y quitar, persistencia al recargar, sincronización entre tarjeta, detalle y lista, sin aviso de hidratación en la consola *(revisada por el desarrollador)*

**Commit:**
```
b9e8a6b feat(favorites): agregar favoritos con localStorage y página /favorites
```

---

### Paso 11 — Revisión del proyecto contra `AGENTS.md` y correcciones

**Objetivo:** validar el código generado por la IA antes de darlo por bueno, separando la **revisión** (sin cambios) de la **corrección**.

#### 11.1 Revisión (sin corregir)

**Prompt principal:**
> "Revisa todo el proyecto contra AGENTS.md. Lista SIN corregir: 1. Violaciones de la arquitectura por features (imports cruzados, lógica en app/). 2. Errores no manejados, catch vacíos, posibles fugas de la API key. 3. Uso de any o tipos débiles. 4. Client Components que podrían ser Server Components. 5. Problemas de responsive o accesibilidad. Ordénalos por severidad."

**Cómo revisó la IA:** con búsquedas automáticas en todo `src/` (imports entre features, imports `../`, `fetch` directo, `process.env`, `NEXT_PUBLIC_`, `server-only`, `any`/`@ts-ignore`/casts, `catch`, `console`, `'use client'`, `<img>`, encabezados) y pruebas contra el servidor (por ejemplo, `/api/places` con coordenadas de Tokio respondió 200). **No modificó ningún archivo.**

**Hallazgos (17):**

| # | Severidad | Cat. | Hallazgo | Estado |
|---|---|---|---|---|
| 1 | 🔴 Alta | 2 | `/api/places` y `/api/weather` aceptaban coordenadas de **cualquier parte del mundo** (Tokio → 200): cualquiera podía agotar la cuota de Geoapify | ✅ Corregido |
| 2 | 🟠 Media | 5 | Foco invisible en las tarjetas: `overflow-hidden` de `Card` recortaba el contorno del enlace | ✅ Corregido |
| 3 | 🟠 Media | 5 | Placeholder del buscador con contraste ~3:1 (`text-muted/70`), por debajo de 4.5:1 | ✅ Corregido |
| 4 | 🟠 Media | 5 | Contenedor al 80% también en móvil: ~256px útiles en una pantalla de 320px | ✅ Corregido |
| 5 | 🟠 Media | 2 | `/explore` y `/favorites` sin `error.tsx` propio | ✅ Corregido |
| 6 | 🟡 Baja | 2 | `/country/XXX` responde HTTP 200 con `noindex` (limitación documentada de `cacheComponents`) | Pendiente |
| 7 | 🟡 Baja | 2 | `catch` que devuelve `null` sin registrar (`place.schema.ts`) | Pendiente |
| 8 | 🟡 Baja | 2 | Los errores de `localStorage` se registran con `logger`, que no escribe en el navegador | Pendiente |
| 9 | 🟡 Baja | 2 | `reportClientError` usa `console` y `process.env` sin figurar como excepción documentada | Pendiente |
| 10 | 🟡 Baja | 3 | Validaciones de respuestas propias en el cliente que solo revisan que haya un arreglo | Pendiente |
| 11 | 🟡 Baja | 1 | Lógica menor en `app/` (URL canónica y descripción de metadata) | Pendiente |
| 12 | 🟡 Baja | 4 | `/explore` y lugares cargan los datos iniciales en el cliente aunque el servidor los tiene | Pendiente |
| 13 | 🟡 Baja | 5 | Salto de encabezados `h1` → `h3` en la página de lugares | Pendiente |
| 14 | 🟡 Baja | 5 | `Spinner` (`role="status"`) dentro de una región `aria-live`: doble anuncio | Pendiente |
| 15 | 🟡 Baja | 5 | Links externos del Footer sin aviso de "pestaña nueva" | Pendiente |
| 16 | 🟡 Baja | 5 | El menú móvil no mueve el foco al abrirse | Pendiente |
| 17 | 🟡 Baja | 5 | Capitales y monedas en inglés sin `lang="en"` | Pendiente |

**Sin hallazgos:** no hay imports internos entre features (solo `countries → favorites` por su barrel), `shared` no importa de `features`, no hay `../`, ningún `index.ts` exporta services, no hay `fetch` directo, no hay `NEXT_PUBLIC_`, todos los services usan `server-only`, hay cero `any`/`@ts-ignore` y ninguna etiqueta `<img>`.

#### 11.2 Corrección

**Prompt principal:**
> "De las observaciones con severidad alta validemos que las coordenadas pertenezcan a los 7 países de Centroamérica; luego con los 4 puntos de severidad media corrijamos de acuerdo a tu análisis, coincido con él. Confirma que todas estén solventadas y recuerda documentar esto."

**Decisión previa:** el commit del Paso 10 se hizo **antes** de corregir, para que el historial separe la funcionalidad de las correcciones de la revisión.

**Correcciones aplicadas:**

| # | Corrección | Archivos |
|---|---|---|
| 1 | Rectángulo geográfico por país, con islas incluidas (Cayos de Belice, Islas del Cisne, Corn Islands, Isla del Coco). Los Route Handlers validan con `.refine(isInCentralAmerica)` **antes** de llamar al service: fuera de la región → **400** sin consumir cuota | `features/countries/utils/centralAmericaBounds.ts` (nuevo), `app/api/places/route.ts`, `app/api/weather/route.ts` |
| 2 | Las tarjetas `interactive` dibujan un anillo en la tarjeta completa (`has-[a:focus-visible]:ring-2`) y el enlace interno usa `focus-visible:outline-none` | `shared/components/ui/Card.tsx`, `CountryCard.tsx`, `FavoriteCard.tsx` |
| 3 | El placeholder pasa de `text-muted/70` (~3:1) a `text-muted` (~5.5:1) | `CountrySearch.tsx` |
| 4 | `page-container` mobile-first: `100% - 2rem` en móvil, 90% desde 640px y **80% desde 1024px** (el ancho elegido por el desarrollador) | `app/globals.css` |
| 5 | Nuevo `RouteErrorView` compartido y `error.tsx` en `/explore` y `/favorites`; los `error.tsx` de país y lugares ahora también lo usan (se eliminó código duplicado) | `shared/components/ui/RouteErrorView.tsx` (nuevo), 4 archivos `error.tsx` |

**Verificación de cada corrección:**

| # | Prueba | Resultado |
|---|---|---|
| 1 | `/api/weather` con las 7 capitales y los 7 centros geográficos (datos de REST Countries) | **14/14 → 200** ✅ |
| 1 | `/api/places` y `/api/weather` con Tokio, París, Ciudad de México, Bogotá, La Habana y Caracas | **12/12 → 400** "Las coordenadas deben estar dentro de uno de los países de Centroamérica." ✅ |
| 2 | CSS final y HTML de `/` | Existen las reglas `ring-2:has(:is(a:focus-visible))` y `focus-visible:outline-none`; las 7 tarjetas las tienen ✅ |
| 3 | HTML de `/explore` | Ya no queda `text-muted/70` ✅ |
| 4 | CSS final | `.page-container{width:calc(100% - 2rem)}`, `@media (min-width:40rem){width:90%}` y `@media (min-width:64rem){width:80%}` ✅ |
| 5 | Archivos y build | `explore/error.tsx` y `favorites/error.tsx` existen y compilan ✅ |
| — | `npm run build`, `tsc` y `lint`; las 5 rutas responden 200 | ✅ |

**Documentación actualizada en `AGENTS.md`:** 2.7 (`RouteErrorView` y cobertura de `error.tsx`), 3.3 (los Route Handlers no son proxies abiertos), 3.6 (`page-container` responsive, foco en tarjetas enlazadas y contraste mínimo).

**Desafíos y soluciones:**

| Desafío | Solución con apoyo de la IA |
|---|---|
| Validar "pertenece a un país" sin un servicio de geocodificación | Rectángulos por país con margen; es una aproximación documentada (puede incluir una franja de un país vecino o de mar), suficiente para impedir el abuso global |
| ¿Dónde validar sin acoplar features? | La validación vive en `countries` (dueño del dato geográfico) y la aplican los Route Handlers en `app/`, que componen features; `weather` y `places` siguen sin importar `countries` |
| El anillo de foco no podía ir en el enlace (recortado) | Variante `has-[a:focus-visible]` de Tailwind v4: el anillo lo dibuja la tarjeta, que no se recorta a sí misma |

**Pendiente:** los 12 hallazgos de severidad baja (6 a 17) quedan registrados para una iteración posterior.

**Commit:**
```
c3b89ac fix: corregir hallazgos de severidad alta y media de la revisión
```

> El mensaje propuesto originalmente superaba los 72 caracteres que permite la regla 4.3 de `AGENTS.md`, así que se acortó antes de hacer el commit.

---

### Paso 11.3 — Revisión de rendimiento (pendiente de aplicar)

**Prompt principal:**
> "Revisa rendimiento: estrategia de caché/revalidate por API, next/image (sizes, priority en hero, remotePatterns en next.config), tamaño de los Client Components y metadata para SEO."

**Cómo revisó la IA:** leyó la documentación local de `'use cache'`, `'use cache: remote'` y `next/image`; midió los chunks de JavaScript del build (con gzip) y buscó qué librerías incluían; inspeccionó el `<head>` del HTML prerenderizado de las 5 páginas. **No modificó código.**

**Hallazgos:**

| # | Prioridad | Hallazgo | Propuesta |
|---|---|---|---|
| 1 | 🔴 | Según la documentación, **en serverless (Vercel) la caché en memoria de `'use cache'` no persiste entre peticiones**. Cada visita a `/explore` y cada regeneración de las fichas (cada 30 min, por el clima) podrían consultar REST Countries: en el peor caso, ~336 peticiones/día frente a una cuota de 1000/mes | `'use cache: remote'` para los países, sacar el clima del shell estático de la ficha, y que `/explore` reciba los países desde el servidor |
| 2 | 🟠 | **zod viaja al navegador (105 KB, 30 KB gzip) en 5 páginas** por la validación de favoritos (`FavoriteButton` → `useFavorites` → `favoritesStorage`) | Usar `zod/mini` en ese schema |
| 3 | 🟡 | `next/image`: `sizes` ✅, `remotePatterns` ✅ y `preload` en la bandera del detalle ✅ (`priority` está deprecado). `minimumCacheTTL` usa el valor por defecto de 4 h | Subirlo a 30 días (las banderas no cambian) |
| 4 | 🟡 | SEO: hay títulos, descripciones y `twitter:card` ✅. Faltan `metadataBase`, canonical, `og:url`, `og:image` por defecto, `sitemap.ts` y `robots.ts`, y `noindex` en `/favorites` | Agregarlos usando `NEXT_PUBLIC_SITE_URL` (no es secreta) |
| 5 | 🟢 | Los Client Components ya son pequeños y están en las hojas; el único peso notable es zod | — |

**Estado:** el desarrollador decidió documentar el proceso (Paso 12) antes de aplicar estas optimizaciones.

---

### Paso 12 — Documentación del proceso (`VIBE_CODING.md`)

**Prompt principal:**
> "Con base en este historial, ayúdame a redactar VIBE_CODING.md con las secciones: 1. Herramienta de IA usada. 2. Prompts principales (por paso). 3. Iteraciones (qué generó la IA, qué estaba mal, cómo se corrigió). 4. Decisiones técnicas (por qué features, por qué zod, por qué Route Handlers como proxy, caché). 5. Desafíos y soluciones con IA. 6. Lecciones aprendidas."
>
> Pedido adicional del desarrollador: *"Ayúdame a documentar que parte de los desafíos que tuvimos también es la integración con las APIs que están deprecadas o que ya no están en uso y me arrojaban un 500."*

**Qué hizo la IA:**
- Reorganizó el documento en las 6 secciones pedidas, como resumen al inicio.
- Conservó el registro detallado de cada paso como **Anexo A**, porque es la evidencia del proceso.
- Agregó la sección **5.1 "APIs dadas de baja, que ya no funcionaban o que respondían con error 500"**: OpenTripMap (error 500 en el registro), REST Countries v3.1 dada de baja, los cambios de la v5 y el 500 propio dentro de `'use cache'`.
- Agregó la sección **5.2** con las APIs de Next.js 16 que cambiaron respecto de lo que pedían los prompts.

**Commit:**
```
51a9cd7 docs(vibe): reorganizar VIBE_CODING.md y documentar APIs deprecadas
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
