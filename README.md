# Aventura: El Simulador del Ahorro Digital

Simulador de productos de ahorro digital. Monorepo con **frontend** (Next.js 16, App Router) y **backend** (NestJS 11) como microservicio independiente.

## Estructura del proyecto

```
├── frontend/    Next.js 16 — UI, ISR, on-demand revalidation
├── backend/     NestJS 11 — API REST, fuente de datos
└── README.md
```

## Requisitos

- Node.js >= 20
- npm

## Instalación

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## Variables de entorno

Cada carpeta incluye un `.env.example` con las variables necesarias. Copia el archivo y renómbralo a `.env` (backend) o `.env.local` (frontend):

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

**Backend** (`backend/.env`):

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3001` |
| `FRONTEND_URL` | URL del frontend (para CORS y revalidación) | `http://localhost:3000` |
| `REVALIDATION_SECRET` | Secreto compartido para on-demand revalidation | `dev-secret` |

**Frontend** (`frontend/.env.local`):

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `API_URL` | URL del backend | `http://localhost:3001/api` |
| `REVALIDATION_SECRET` | Secreto compartido (debe coincidir con el backend) | `dev-secret` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Clave pública de reCAPTCHA v3 (opcional) | — |
| `RECAPTCHA_SECRET_KEY` | Clave secreta de reCAPTCHA v3 (opcional) | — |

### reCAPTCHA v3

Las keys de reCAPTCHA son **opcionales**. Sin ellas, la app funciona en **modo simulado**: el formulario de onboarding muestra un badge de "modo simulado" y la verificación siempre pasa.

Las keys de prueba ya están incluidas en el `.env.example` por facilidad, ya que es una app de demostración. Al copiar el archivo a `.env.local`, reCAPTCHA queda activo automáticamente.

Para probar que la validación funciona de verdad, puedes borrar un carácter de alguna key, reiniciar el frontend, e intentar enviar el formulario de onboarding. Debería mostrar un error de verificación.

## Modo desarrollo

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Abre http://localhost:3000

---

## ¿Por qué ISR con On-Demand Revalidation?

### El problema

Los datos de productos cambian poco, pero cuando cambian necesitan verse rápido. Hay tres formas comunes de manejar esto:

| Estrategia | Ventaja | Desventaja |
|---|---|---|
| **SSR** | Datos siempre actualizados | Cada visita ejecuta código en el servidor. No escala bien con tráfico alto |
| **SSG** | Rendimiento máximo, cero carga al servidor | Necesita un rebuild completo para actualizar cualquier dato |
| **ISR con tiempo fijo** | Buen rendimiento + datos relativamente frescos | Hay una ventana de tiempo donde los datos pueden estar desactualizados |

### La solución: ISR + On-Demand Revalidation

Se toma lo mejor de cada enfoque:

1. **Las páginas se generan como estáticas** en build time, así se sirven muy rápido
2. **Se cachean por 5 minutos** como red de seguridad (`revalidate: 300`)
3. **Cuando el backend modifica datos**, le avisa al frontend al instante para que invalide el caché del servidor

```
Un usuario visita /products
  → Next.js sirve la página estática (rápido, sin ejecutar código en el servidor)

Un admin crea un producto vía API
  → El backend llama POST /api/revalidate al frontend
    → Next.js invalida el caché del servidor de "products" inmediatamente
      → El siguiente usuario que entre ya ve el producto nuevo
```

### Sobre el caché del navegador (Router Cache)

Next.js maneja **dos cachés** independientes:

1. **Caché del servidor (ISR)**: almacena las páginas estáticas generadas. Es lo que invalida el on-demand revalidation. Cuando un usuario nuevo entra o recarga la página, siempre recibe la versión más reciente.

2. **Caché del navegador (Router Cache)**: cuando un usuario ya está navegando dentro de la app, Next.js cachea las páginas visitadas en el navegador durante unos minutos para que la navegación se sienta instantánea. Esto significa que si un admin crea un producto mientras un usuario ya está navegando, ese usuario podría necesitar recargar (F5) para ver el cambio.

Esto es comportamiento estándar de Next.js y tiene sentido: el on-demand revalidation garantiza que **el servidor siempre tenga la versión actualizada**, y cada nueva visita o recarga la recibe. Para actualizaciones en tiempo real dentro de la misma sesión se usarían WebSockets o Server-Sent Events, que es otro patrón.

En la práctica, cambios como un producto nuevo o un ajuste de tasa se validan en el backend y se programan en horarios específicos, así que el caché del navegador no lo considero como un problema real.

### ¿Por qué no algo más simple?

Para 4 productos, un JSON local es suficiente. Esta arquitectura está pensada para escalar:

- **Si los productos crecen a cientos**, el backend se conecta a una base de datos sin tocar el frontend
- **Si hay un panel de administración**, los cambios se ven al instante sin rebuild
- **Si el tráfico es alto**, las páginas estáticas se sirven desde CDN sin carga al servidor
- **Si se agregan más microservicios**, la arquitectura de cache tags permite invalidar solo lo que cambió

El ejemplo es intencionalmente pequeño para demostrar el patrón sin complejidad innecesaria.

---

## Demo: ISR On-Demand en modo producción

Este paso a paso muestra cómo el frontend actualiza su caché al instante cuando el backend crea datos nuevos, **sin hacer rebuild**.

### Paso 1 — Levantar backend y frontend en modo producción

```bash
# Terminal 1: Backend
cd backend
npm run build && node dist/src/main.js
```

Espera a ver: `Backend running on http://localhost:3001/api`

```bash
# Terminal 2: Frontend (build + start en modo producción)
cd frontend
npm run build && npx next start
```

Espera a ver: `Ready in Xs`

### Paso 2 — Verificar el estado inicial

Abre http://localhost:3000/products en el navegador.

Se ven **4 productos** (generados estáticamente durante el build).

### Paso 3 — Crear una categoría nueva desde el backend

```bash
curl -X POST http://localhost:3001/api/product-types \
  -H "Content-Type: application/json" \
  -d '{
    "key": "investment",
    "label": "Inversión inteligente",
    "benefits": [
      {"title": "Alto rendimiento", "description": "Tasas superiores para maximizar ganancias."},
      {"title": "Diversificación", "description": "Estrategias de inversión diversificadas."},
      {"title": "Asesoría experta", "description": "Acompañamiento de especialistas en inversiones."},
      {"title": "Reportes mensuales", "description": "Seguimiento detallado del rendimiento."}
    ]
  }'
```

### Paso 4 — Crear un producto nuevo con esa categoría

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "6",
    "slug": "ahorro-inversor",
    "name": "Ahorro Inversor",
    "type": "investment",
    "description": "Maximiza tus ahorros con rendimientos superiores al mercado.",
    "targetAudience": "Personas que buscan hacer crecer su capital a mediano y largo plazo.",
    "annualRate": 12.0,
    "minOpeningAmount": 500000,
    "recommendedMonthlyContribution": 500000,
    "suggestedTermMonths": 36,
    "liquidity": "low",
    "tags": ["inversión", "alto rendimiento", "capital", "crecimiento"],
    "lastUpdated": "2026-02-08"
  }'
```

### Paso 5 — Verificar la actualización

La forma más clara de verlo es abrir http://localhost:3000/products en **otra pestaña o ventana de incógnito**. El nuevo producto aparece sin haber hecho rebuild del frontend.

Si quieres verificar desde la misma pestaña donde ya estabas, recarga la página (F5).

### ¿Qué pasó internamente?

1. El `POST /api/products` creó el producto en el backend
2. El backend llamó `POST http://localhost:3000/api/revalidate` con `{ tag: "products" }`
3. Next.js invalidó el caché del servidor para todas las páginas que usan el tag `products`
4. La siguiente visita o recarga generó la página con los datos actualizados

Sin on-demand revalidation, el usuario tendría que esperar hasta **5 minutos** (el `revalidate: 300`) para ver el cambio.

### Nota importante: los datos viven en memoria

Los archivos JSON del backend (`products.json`, `product-types.json`) **no se modifican** cuando haces un POST. El backend los carga en memoria al arrancar y los cambios solo existen ahí:

- Cuando el backend arranca, lee los JSON y los guarda en un array en memoria
- Cuando haces un `curl POST`, el producto nuevo se agrega a ese array, no al archivo
- Si reinicias el backend, se pierden los productos creados (vuelve a los 4 originales)

Para ver los datos que el backend tiene en memoria en cualquier momento:

```bash
# Ver todos los productos
curl http://localhost:3001/api/products | json_pp

# Ver los tipos de producto
curl http://localhost:3001/api/product-types | json_pp
```

Antes del POST verás 4 productos. Después del POST verás 5. Pero el archivo `products.json` sigue igual con 4.

En una aplicación real se usaría una base de datos (PostgreSQL, MongoDB, etc.). Los JSON solo están como datos iniciales para que la demo funcione sin necesidad de configurar una DB.

---

## Endpoints del backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/products` | Listar todos los productos |
| `GET` | `/api/products/:slug` | Obtener producto por slug |
| `POST` | `/api/products` | Crear producto (dispara revalidación) |
| `PATCH` | `/api/products/:slug` | Actualizar producto (dispara revalidación) |
| `GET` | `/api/product-types` | Listar tipos de producto |
| `POST` | `/api/product-types` | Crear tipo (dispara revalidación) |

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4 |
| Backend | NestJS 11, class-validator, ConfigModule |
| Caching | ISR con cache tags + on-demand revalidation vía webhook |
| Validación | reCAPTCHA v3 (real con keys, modo simulado sin ellas) |
