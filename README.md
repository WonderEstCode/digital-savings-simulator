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

## Modo desarrollo

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Abrir http://localhost:3000

---

## ¿Por qué ISR con On-Demand Revalidation?

### El problema

Los datos de productos cambian poco, pero cuando cambian necesitan verse de inmediato. Hay tres formas de manejar esto:

| Estrategia | Ventaja | Desventaja |
|---|---|---|
| **SSR** | Datos siempre actualizados | Cada visita le pega al servidor. No escala con tráfico alto |
| **SSG** | Rendimiento máximo, cero carga al servidor | Hay que hacer rebuild completo para actualizar cualquier dato |
| **ISR con tiempo fijo** | Buen rendimiento + datos relativamente frescos | Hay una ventana (ej. 60s) donde los datos pueden estar viejos |

### La solución: ISR + On-Demand Revalidation

Se toma lo mejor de cada enfoque:

1. **Las páginas se generan como estáticas** en build time → se sirven rapidísimo
2. **Se cachean por 1 hora** como red de seguridad (`revalidate: 3600`)
3. **Cuando el backend modifica datos**, le avisa al frontend al instante para que invalide el caché

```
Un usuario visita /products
  → Next.js le sirve la página estática (rápido, sin tocar el servidor)

Un admin crea un producto vía API
  → El backend llama POST /api/revalidate al frontend
    → Next.js invalida el caché de "products" inmediatamente
      → El siguiente usuario ya ve el producto nuevo
```

### ¿Por qué no algo más simple?

Para 4 productos, un JSON local alcanza y sobra. Esta arquitectura está pensada para escalar:

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

Esperar a ver: `Backend running on http://localhost:3001/api`

```bash
# Terminal 2: Frontend (build + start en modo producción)
cd frontend
npm run build && npx next start
```

Esperar a ver: `Ready in Xs`

### Paso 2 — Verificar el estado inicial

Abrir http://localhost:3000/products en el navegador.

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

Recargar http://localhost:3000/products en el navegador.

Se ven **5 productos**. El "Ahorro Inversor" aparece al instante, sin haber hecho rebuild del frontend.

### ¿Qué pasó internamente?

1. El `POST /api/products` creó el producto en el backend
2. El backend llamó `POST http://localhost:3000/api/revalidate` con `{ tag: "products" }`
3. Next.js invalidó todas las páginas que usan el tag `products`
4. La siguiente visita regeneró la página con los datos actualizados

Sin on-demand revalidation, el usuario tendría que esperar hasta **1 hora** (el `revalidate: 3600`) para ver el cambio.

### Nota importante: los datos viven en memoria

Los archivos JSON del backend (`products.json`, `product-types.json`) **no se modifican** cuando haces un POST. El backend los carga en memoria al arrancar y los cambios solo existen ahí:

- Cuando el backend arranca, lee los JSON y los guarda en un array en memoria
- Cuando haces un `curl POST`, el producto nuevo se agrega a ese array, no al archivo
- Si reiniciás el backend, se pierden los productos creados (vuelve a los 4 originales)

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
| Validación | reCAPTCHA v3 (modo simulación sin keys) |
