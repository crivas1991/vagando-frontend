# 🌎 Vagando — Turismo en Centroamérica

**Vagando** es una aplicación web para descubrir los 7 países de Centroamérica: información esencial de cada país, el clima en tiempo real, los lugares turísticos cercanos a su capital y una lista de destinos favoritos.

### 🔗 Demo en producción: **[https://vagando-frontend.vercel.app](https://vagando-frontend.vercel.app/)**

Proyecto desarrollado con **Vibe Coding**: la IA trabajó como copiloto y el desarrollador conservó el control de las decisiones y del código. El proceso completo está documentado en [`VIBE_CODING.md`](./VIBE_CODING.md). Las evidencias visuales del proceso (capturas) se comparten por separado.

---

## 📑 Contenido

- [Funcionalidades](#-funcionalidades)
- [Rutas](#-rutas)
- [Stack tecnológico](#-stack-tecnológico)
- [APIs utilizadas](#-apis-utilizadas)
- [Instalación y uso local](#-instalación-y-uso-local)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Manejo de errores](#-manejo-de-errores)
- [Despliegue en Vercel](#-despliegue-en-vercel)
- [Limitaciones conocidas](#-limitaciones-conocidas)
- [Documentación del proyecto](#-documentación-del-proyecto)
- [Créditos](#-créditos)

---

## ✨ Funcionalidades

- **Destinos de Centroamérica:** Belice, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua y Panamá, con nombres en español.
- **Buscador con filtros:** busca por nombre (en español o inglés), capital o código ISO, sin importar tildes ni mayúsculas, y filtra por población.
- **Ficha de cada país:** bandera, capital, población, moneda, idiomas, superficie y código ISO.
- **Clima en tiempo real:** temperatura actual, sensación térmica, humedad, viento y pronóstico de 7 días en la capital.
- **Lugares turísticos:** atractivos, museos, naturaleza, playas y gastronomía, ordenados por distancia, con enlace a OpenStreetMap.
- **Favoritos:** guarda destinos con ❤️; se conservan en el navegador (`localStorage`) y se sincronizan entre pestañas.
- **Diseño responsive** (mobile-first), **modo oscuro automático** y **accesibilidad**: navegación con teclado, foco visible, textos alternativos y contraste AA.
- **Estados de carga, error y vacío** en todas las páginas. Si falla una fuente secundaria (por ejemplo, el clima), el resto de la página sigue funcionando.

---

## 🧭 Rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Server Component | Portada con datos reales de la región y destinos destacados |
| `/explore` | Server + Client | Buscador con filtro de población |
| `/country/[code]` | Server Component | Ficha del país + clima en su propia sección (`<Suspense>`) |
| `/country/[code]/places` | Server + Client | Lugares turísticos con filtro por categoría |
| `/favorites` | Server + Client | Destinos guardados |

**Route Handlers (API interna):**

| Endpoint | Descripción |
|---|---|
| `GET /api/countries?q=` | Países de Centroamérica, filtrados opcionalmente por texto |
| `GET /api/weather?lat=&lon=` | Clima actual y pronóstico (solo coordenadas dentro de Centroamérica) |
| `GET /api/places?lat=&lon=&kind=` | Lugares turísticos. `kind`: `sights`, `museums`, `nature`, `beaches` o `food` |

Los errores siempre responden con el mismo formato: `{ "error": { "code": "BAD_REQUEST", "message": "…" } }`.

---

## 🧱 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) (App Router) | 16.4 | Framework, Server/Client Components, Route Handlers, `cacheComponents` |
| [React](https://react.dev) | 19.3 | Interfaz |
| [TypeScript](https://www.typescriptlang.org) | 5 (modo `strict`) | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com) | 4.3 | Estilos y diseño responsive |
| [zod](https://zod.dev) | 4 | Validación de APIs externas, parámetros, variables de entorno y `localStorage` |
| [Vercel](https://vercel.com) | — | Despliegue |

---

## 🔌 APIs utilizadas

| API | Uso | ¿Requiere key? | Plan gratuito |
|---|---|---|---|
| [REST Countries v5](https://restcountries.com/docs/countries) | Datos de los países | Sí (`REST_COUNTRIES_API_KEY`) | 1000 peticiones/mes |
| [Open-Meteo](https://open-meteo.com) | Clima actual y pronóstico | No | Uso no comercial |
| [Geoapify Places](https://www.geoapify.com/places-api) | Lugares turísticos | Sí (`GEOAPIFY_API_KEY`) | 3000 peticiones/día |

> Las keys **solo se usan en el servidor**. El navegador consulta los Route Handlers (`/api/*`) y nunca recibe las keys.

---

## 🚀 Instalación y uso local

### Requisitos previos

- [Node.js](https://nodejs.org) **20.9 o superior** (recomendado: 22 LTS)
- npm (incluido con Node.js)
- Una cuenta gratuita en [REST Countries](https://restcountries.com/sign-up) y otra en [Geoapify](https://myprojects.geoapify.com) para obtener las keys

### Pasos

**1. Clona el repositorio**

```bash
git clone https://github.com/crivas1991/vagando-frontend.git
cd vagando-frontend
```

**2. Instala las dependencias**

```bash
npm install
```

**3. Configura las variables de entorno**

```bash
cp .env.example .env.local
```

Abre `.env.local` y reemplaza los valores de ejemplo por tus keys (ver [Variables de entorno](#-variables-de-entorno)).

**4. Inicia el servidor de desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

**5. (Opcional) Prueba el build de producción**

```bash
npm run build
npm run start
```

### Uso

1. En la **portada** elige uno de los 7 destinos destacados, o usa **Explorar** para buscar por nombre, capital o código (por ejemplo `panama`, `Managua` o `CRI`).
2. En la **ficha del país** consulta sus datos y el clima de la capital. Toca **"Guardar en favoritos"** para guardarlo.
3. Toca **"Ver lugares turísticos"** y cambia de categoría para descubrir atractivos, museos, naturaleza, playas y dónde comer.
4. En **Favoritos** encontrarás los destinos que guardaste. Se conservan aunque cierres el navegador.

---

## 🔐 Variables de entorno

Se documentan en [`.env.example`](./.env.example). El archivo `.env.local` **nunca se sube al repositorio** (está en `.gitignore`).

| Variable | Obligatoria | Descripción | Dónde obtenerla |
|---|---|---|---|
| `REST_COUNTRIES_API_KEY` | Sí | Key de REST Countries v5. Se envía en el header `Authorization: Bearer` | [restcountries.com/sign-up](https://restcountries.com/sign-up) → API Keys |
| `GEOAPIFY_API_KEY` | Sí | Key de Geoapify Places | [myprojects.geoapify.com](https://myprojects.geoapify.com) → tu proyecto → API keys |

> ⚠️ **No uses el prefijo `NEXT_PUBLIC_`** en estas variables: expondría las keys en el navegador.
>
> ⚠️ **Las keys deben existir también durante el build.** La portada y las fichas de los países se generan con datos de REST Countries, así que sin la key el build falla. Es intencional: evita publicar un sitio roto.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Build de producción (también valida los tipos de TypeScript) |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Revisión de código con ESLint |

---

## 🏗️ Arquitectura del proyecto

El proyecto sigue una **arquitectura basada en features**: el código se agrupa por dominio (países, clima, lugares, favoritos) y no por tipo de archivo. Las reglas completas están en [`AGENTS.md`](./AGENTS.md).

```
src/
├── app/                      # Solo rutas: páginas, layouts, loading, error y Route Handlers
│   ├── api/                  # /api/countries, /api/weather, /api/places
│   ├── country/[code]/       # Ficha del país (+ /places)
│   ├── explore/
│   └── favorites/
├── features/
│   ├── countries/            # REST Countries: buscador, ficha, tarjetas
│   ├── weather/              # Open-Meteo: clima actual y pronóstico
│   ├── places/               # Geoapify: lugares turísticos
│   └── favorites/            # localStorage: destinos guardados
│       ├── components/
│       ├── hooks/
│       ├── services/         # Acceso a APIs (solo servidor)
│       ├── schemas/          # Validación con zod
│       ├── types/
│       ├── utils/
│       ├── index.ts          # API pública segura para el cliente
│       └── server.ts         # API pública solo para el servidor
└── shared/                   # Código genérico: UI base, cliente HTTP, errores, logger
```

**Principios clave:**
- `app/` solo **compone** componentes y services; no hace `fetch` directo.
- Un feature se usa solo a través de su `index.ts` (cliente) o `server.ts` (servidor).
- Los Client Components consultan únicamente `/api/*`; los Server Components usan los services directamente.
- Caché con `'use cache'` + `cacheLife()`: países 1 día, clima 30 minutos, lugares 1 día.

---

## 🛡️ Manejo de errores

- **`AppError` tipado** con código y status HTTP (`BAD_REQUEST`, `NOT_FOUND`, `RATE_LIMITED`, `UPSTREAM_ERROR`, `INTERNAL`).
- **Cliente HTTP único** (`fetchJson`) con timeout, validación de la respuesta con zod y traducción de los errores HTTP.
- **Mensajes seguros:** el usuario nunca ve stack traces, keys ni mensajes internos; el detalle queda en el log del servidor.
- **`error.tsx`** por segmento con botón **"Reintentar"**, más `global-error.tsx` y una página 404 temática.
- **Degradación elegante:** si falla el clima o los lugares, la ficha del país sigue funcionando y el error aparece solo en esa sección.
- **Protección de cuota:** `/api/weather` y `/api/places` solo aceptan coordenadas dentro de los 7 países de Centroamérica.

---

## ☁️ Despliegue en Vercel

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new). Vercel detecta Next.js automáticamente.
2. **Antes de desplegar**, agrega en *Environment Variables* las dos keys: `REST_COUNTRIES_API_KEY` y `GEOAPIFY_API_KEY`. Se recomienda marcarlas como *Sensitive*.
3. Haz clic en **Deploy**.
4. Cada `git push` a `main` vuelve a desplegar automáticamente.

**Producción:** [https://vagando-frontend.vercel.app](https://vagando-frontend.vercel.app/)

---

## ⚠️ Limitaciones conocidas

- **Capitales y monedas en inglés** ("Guatemala City", "United States dollar"): REST Countries v5 no las traduce.
- **Código de país inexistente** (`/country/XXX`): muestra la página 404 con `noindex`, pero con HTTP 200. Es un comportamiento documentado de Next.js 16 con `cacheComponents`.
- **Lugares sin foto:** Geoapify casi nunca trae imágenes; se muestra una ilustración por categoría.
- **Favoritos por navegador:** se guardan en `localStorage`, así que no se comparten entre dispositivos.
- **Caché en serverless:** en Vercel la caché en memoria no se comparte entre instancias. Hay una optimización propuesta (`'use cache: remote'`) registrada en `VIBE_CODING.md` (Paso 11.3).

---

## 📚 Documentación del proyecto

| Documento | Contenido |
|---|---|
| [`VIBE_CODING.md`](./VIBE_CODING.md) | Proceso de Vibe Coding: herramienta de IA, prompts, iteraciones, decisiones técnicas, desafíos y lecciones aprendidas |
| Evidencias visuales | Las capturas del proceso (prompts, respuestas de la IA, desarrollo y despliegue) **se comparten por separado** y no forman parte del repositorio |
| [`AGENTS.md`](./AGENTS.md) | Reglas del proyecto: arquitectura por features, manejo de errores, requisitos, convenciones y testing |
| [`.env.example`](./.env.example) | Variables de entorno documentadas |

---

## 🙏 Créditos

- Datos de países: [REST Countries](https://restcountries.com)
- Clima: [Open-Meteo](https://open-meteo.com) (CC BY 4.0)
- Lugares: [Geoapify](https://www.geoapify.com) y colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL)
- Banderas: [Flag CDN de REST Countries](https://restcountries.com)

Proyecto académico desarrollado por [crivas1991](https://github.com/crivas1991) con **Vibe Coding**, usando Claude Code como copiloto de IA.
