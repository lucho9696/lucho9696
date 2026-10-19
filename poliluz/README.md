# Poliluz · Tienda online demostrativa

Demo navegable de e-commerce para **Poliluz**, distribuidora de descartables, envases y packaging gastronómico.
Catálogo con búsqueda y filtros, ficha de producto, carrito persistente, checkout por **WhatsApp** y consultas mayoristas.

> ⚠️ **Todo el contenido es de demostración.** Productos, precios, SKU, presentaciones e imágenes son ficticios
> e ilustrativos. No representan valores de mercado ni el catálogo real de Poliluz. La web **no cobra, no registra
> pedidos y no guarda datos en un servidor**: solo arma un mensaje de WhatsApp que el comprador envía.

---

## Stack y arquitectura

| Capa | Tecnología |
| --- | --- |
| Backend | PHP 8.3 sin framework ni dependencias (API JSON con router propio) |
| Frontend | React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + React Router 7 + lucide-react |
| Desarrollo | Docker Compose (`api` PHP + `web` Vite con recarga en caliente) |
| Producción | Vercel: frontend estático + función PHP (`vercel-php`) |

```
Navegador ──► React SPA (frontend/) ──► /api/* ──► PHP (backend/)
                                                    ├─ Catálogo (data/catalog.json)
                                                    ├─ Validación + recálculo de precios del pedido
                                                    └─ Armado del mensaje y enlace wa.me (número centralizado)
```

**Decisiones principales**

- **El backend es la fuente de verdad**: el pedido se valida en PHP y los precios se recalculan con el catálogo del
  servidor (nunca se confía en los precios del navegador). El número de WhatsApp vive solo en el backend.
- **Datos desacoplados**: el catálogo está en `backend/data/catalog.json` detrás de la interfaz `CatalogRepository`.
  Pasar a MySQL o a otra fuente es implementar esa interfaz, sin tocar controladores ni frontend.
- **Preparado para pagos online**: `OrderFactory` → `Order` ya modelan el pedido validado. Para sumar una pasarela
  (por ejemplo Mercado Pago) se agrega otro endpoint que reciba el mismo payload; el carrito no cambia.
- **Sin dependencias en PHP**: corre igual en Docker, con `php -S` y en el runtime de Vercel.
- **Imágenes locales**: ilustraciones SVG propias, livianas y con encuadre uniforme (`frontend/public/images/products`).
  Si una imagen falla, se muestra un recurso local de respaldo (`/images/placeholder.svg`).

## Estructura

```
poliluz/
├── api/index.php              # Entrada para Vercel (reutiliza backend/public/index.php)
├── backend/
│   ├── config/app.php         # Configuración central (lee variables de entorno)
│   ├── data/catalog.json      # Catálogo de DEMO (categorías y productos)
│   ├── public/index.php       # Front controller
│   ├── src/
│   │   ├── Catalog/           # Entidades, repositorio JSON, búsqueda/orden/paginación
│   │   ├── Orders/            # Cliente, líneas y pedido validado
│   │   ├── Wholesale/         # Consulta mayorista
│   │   ├── WhatsApp/          # Enlace wa.me y formato de mensajes
│   │   ├── Validation/        # Validaciones centralizadas
│   │   ├── Http/              # Request, Router, JsonResponse
│   │   └── Controllers/
│   └── tests/run.php          # Pruebas del backend (sin dependencias)
├── frontend/
│   ├── public/images/products # Ilustraciones de producto (SVG)
│   └── src/
│       ├── cart/              # Lógica pura del carrito (reducer, totales, persistencia)
│       ├── components/        # layout, ui, product, cart, home, catalog, search, whatsapp
│       ├── content/           # Textos institucionales, FAQ y beneficios (editables)
│       ├── context/           # Carrito, configuración, notificaciones, UI
│       ├── lib/               # Cliente de API, formatos, filtros de URL, validaciones
│       └── pages/             # Páginas de la tienda
├── docker-compose.yml
├── vercel.json
└── .env.example
```

## Cómo ejecutar

### Con Docker (recomendado)

```bash
cd poliluz
cp .env.example .env          # opcional: cargar WHATSAPP_NUMBER
docker compose up --build
```

- Tienda: http://localhost:5173
- API: http://localhost:8000/api/health

### Sin Docker

Requisitos: PHP 8.1+ (con `mbstring`) y Node 20+.

```bash
# Terminal 1 · API
cd poliluz/backend
cp .env.example .env          # opcional
php -S localhost:8000 -t public public/index.php

# Terminal 2 · Frontend
cd poliluz/frontend
npm install
npm run dev                   # http://localhost:5173 (proxy de /api → localhost:8000)
```

## Configurar el WhatsApp real de Poliluz

El número está centralizado en **una sola variable de entorno del backend**: `WHATSAPP_NUMBER`.

| Entorno | Dónde se configura |
| --- | --- |
| Docker | `poliluz/.env` → `WHATSAPP_NUMBER=...` |
| Local con `php -S` | `poliluz/backend/.env` → `WHATSAPP_NUMBER=...` |
| Vercel | Project Settings → Environment Variables → `WHATSAPP_NUMBER` |

**Formato**: internacional, solo dígitos, sin `+`, espacios ni guiones.
Para Argentina: `54` + `9` + código de área sin `0` + número sin `15`. Ejemplo (ficticio): `5493531234567`.

Mientras quede el placeholder `WHATSAPP_NUMBER_HERE` (o un valor inválido):

- la API responde `whatsapp.configured: false` y **no genera enlaces**;
- los botones de WhatsApp muestran el aviso *"WhatsApp pendiente de configuración"*;
- en el checkout se puede revisar y copiar el mensaje, pero no se abre ningún enlace.

El valor por defecto está documentado en `backend/config/app.php`.

## Publicar en Vercel

1. Importar el repositorio en Vercel.
2. **Root Directory**: `poliluz`.
3. Framework Preset: *Other* (la configuración ya está en `vercel.json`).
4. Variables de entorno: `WHATSAPP_NUMBER` (y opcionalmente `DEMO_MODE`).
5. Deploy.

`vercel.json` compila el frontend (`frontend/dist`), publica `api/index.php` con el runtime comunitario
[`vercel-php@0.7.4`](https://github.com/vercel-community/php) (PHP 8.3, requiere Node 22.x, fijado en `package.json`)
y redirige `/api/*` a la función PHP y el resto de las rutas a la SPA.

## Rutas de la tienda

| Ruta | Página |
| --- | --- |
| `/` | Inicio: hero, categorías, destacados, banner mayorista, beneficios, novedades, FAQ |
| `/productos` | Catálogo. Filtros en la URL: `q`, `categoria`, `orden`, `destacados=1`, `pagina` |
| `/producto/:slug` | Detalle de producto |
| `/carrito` | Carrito completo |
| `/checkout` | Confirmación del pedido y envío por WhatsApp |
| `/mayoristas` | Consultas por mayor (flujo separado del carrito) |
| `/nosotros` | Página institucional (texto provisional) |
| `/preguntas-frecuentes` | Preguntas frecuentes |
| `*` | Página 404 |

## API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio |
| GET | `/api/config` | Datos de la tienda, estado de WhatsApp y enlaces de contacto |
| GET | `/api/categories` | Categorías con cantidad de productos |
| GET | `/api/products` | Listado: `q`, `category`, `featured`, `new`, `available`, `sort` (`featured`, `relevance`, `price_asc`, `price_desc`, `name_asc`, `name_desc`), `page`, `perPage` |
| GET | `/api/products/{slug}` | Detalle, relacionados y enlace de consulta |
| POST | `/api/orders/whatsapp` | Valida el pedido, recalcula precios y devuelve el mensaje + enlace wa.me |
| POST | `/api/wholesale/whatsapp` | Valida la consulta mayorista y devuelve el mensaje + enlace wa.me |

Errores de validación: HTTP `422` con `{ "error": "...", "fields": { "campo": "mensaje" } }`.

## Pruebas y calidad

```bash
php backend/tests/run.php     # backend: catálogo, búsqueda, pedidos, validación, mensajes y API
cd frontend
npm test                      # unitarias: carrito, formatos, filtros de URL, validaciones
npm run lint
npm run typecheck
npm run build
```

## Reemplazar el contenido de demostración

- **Productos y categorías**: `backend/data/catalog.json`. Campos por producto: `id`, `sku`, `slug`, `name`,
  `description`, `price` (pesos, entero), `categoryId`, `presentation`, `saleUnit` (singular/plural), `image`,
  `gallery`, `featured`, `isNew`, `available`, `tags`. Quitar la clave `_notice` cuando los datos sean reales.
- **Imágenes**: `frontend/public/images/products/`. Recomendado: cuadradas (1:1), fondo blanco o transparente,
  mínimo 800×800 px. Actualizar la ruta en `image`/`gallery`.
- **Textos**: `frontend/src/content/site.ts` (datos comerciales, aviso de demo), `faq.ts`, `benefits.ts`,
  `frontend/src/pages/AboutPage.tsx` (historia y fotos reales).
- **Redes sociales y datos comerciales**: hoy figuran como "a confirmar" en el footer.

## Checklist antes de publicar para el cliente

- [ ] Configurar `WHATSAPP_NUMBER` con el número real.
- [ ] Reemplazar catálogo, precios e imágenes por los reales.
- [ ] Completar dirección, horarios, zona de entrega y redes (o quitarlos).
- [ ] Definir y redactar condiciones reales (entregas, retiros, medios de pago) en Preguntas frecuentes.
- [ ] Poner `DEMO_MODE=false` (oculta los avisos globales de demo en la barra superior, el menú móvil y el pie)
      y revisar los textos "demo"/"ficticio" de la ficha de producto, el carrito y el checkout.
- [ ] Quitar `<meta name="robots" content="noindex">` de `frontend/index.html` para que la tienda se indexe.
- [ ] Reemplazar el logotipo tipográfico provisional (`frontend/src/components/ui/Logo.tsx`) y el favicon.
