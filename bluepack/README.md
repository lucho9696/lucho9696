# Blue Pack · Tienda online demostrativa

Demo navegable de e-commerce para **Blue Pack Descartables**, venta mayorista y minorista de descartables en
Villa María, Córdoba. Catálogo con búsqueda y filtros, ficha de producto, carrito persistente,
checkout por **WhatsApp** y consultas mayoristas.

> ⚠️ **Los productos y precios son de demostración.** Productos, precios, SKU, presentaciones e imágenes de producto
> son ficticios e ilustrativos. No representan valores de mercado ni el catálogo real de Blue Pack. La web **no cobra,
> no registra pedidos y no guarda datos en un servidor**: solo arma un mensaje de WhatsApp que el comprador envía.
> Los datos institucionales (nombre, logo, colores, ubicación, teléfonos y redes) sí son los públicos de Blue Pack:
> ver [Datos de Blue Pack usados](#datos-de-blue-pack-usados).

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
  servidor (nunca se confía en los precios del navegador). El número de WhatsApp de los botones vive solo en el backend.
- **Datos desacoplados**: el catálogo está en `backend/data/catalog.json` detrás de la interfaz `CatalogRepository`.
  Pasar a MySQL o a otra fuente es implementar esa interfaz, sin tocar controladores ni frontend.
- **Preparado para pagos online**: `OrderFactory` → `Order` ya modelan el pedido validado. Para sumar una pasarela
  (por ejemplo Mercado Pago) se agrega otro endpoint que reciba el mismo payload; el carrito no cambia.
- **Sin dependencias en PHP**: corre igual en Docker, con `php -S` y en el runtime de Vercel.
- **Imágenes locales**: ilustraciones SVG propias, livianas y con encuadre uniforme (`frontend/public/images/products`).
  Si una imagen falla, se muestra un recurso local de respaldo (`/images/placeholder.svg`).
- **Marca centralizada**: los colores de Blue Pack son tokens de Tailwind (`@theme` en `frontend/src/index.css`:
  `brand`, `navy`, `accent`) y los datos del negocio están en `frontend/src/content/site.ts` (`SITE`,
  `BUSINESS_INFO`, `SOCIAL_LINKS`).

## Estructura

```
bluepack/
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
│   ├── public/
│   │   ├── brand/             # Logo circular completo (PNG) e isotipo sin texto (SVG, cabecera y pie)
│   │   ├── images/products/   # Ilustraciones de producto (SVG)
│   │   └── favicon.ico, favicon-64.png, apple-touch-icon.png, og-image.png
│   └── src/
│       ├── cart/              # Lógica pura del carrito (reducer, totales, persistencia)
│       ├── components/        # layout, ui, product, cart, home, catalog, search, whatsapp
│       ├── content/           # Datos del negocio, textos institucionales, FAQ y beneficios (editables)
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
cd bluepack
cp .env.example .env          # opcional: cargar WHATSAPP_NUMBER
docker compose up --build
```

- Tienda: http://localhost:5173
- API: http://localhost:8000/api/health

### Sin Docker

Requisitos: PHP 8.1+ (con `mbstring`) y Node 20+.

```bash
# Terminal 1 · API
cd bluepack/backend
cp .env.example .env          # opcional
php -S localhost:8000 -t public public/index.php

# Terminal 2 · Frontend
cd bluepack/frontend
npm install
npm run dev                   # http://localhost:5173 (proxy de /api → localhost:8000)
```

## Datos de Blue Pack usados

Todo lo institucional sale de los perfiles públicos de Blue Pack (consultados el 20/10/2026). No se agregaron
datos que no estén publicados.

| Dato | Valor en la web | Fuente |
| --- | --- | --- |
| Nombre | Blue Pack · Blue Pack Descartables ("BLUE PACK \| DESCARTABLES") | Perfil de Instagram |
| Propuesta | "Venta mayorista y minorista" · "Tenemos todo lo que tu negocio necesita" | Bio de Instagram |
| Ubicación | Villa María, Córdoba (sin dirección exacta) | Bio de Instagram y de Linktree |
| WhatsApp de ventas | 353 412-2227 (`543534122227`) | Linktree: "Whatsapp de ventas" |
| WhatsApp de consultas | 353 566-9848 (`543535669848`) | Linktree: "Quiero hacer una consulta" |
| Redes | [Instagram](https://www.instagram.com/bluepack.descartables/) · [Facebook](https://www.facebook.com/bluepack.descartables) · [Linktree](https://linktr.ee/bluepack.descartables) | Linktree |
| Logo | Logo circular azul marino con bolsas y texto "BLUE PACK / DESCARTABLES" (Nosotros, `og-image.png`, `apple-touch-icon.png`). Para tamaños chicos (favicon, cabecera, pie, menú móvil) se usa un isotipo sin texto redibujado en SVG a partir de ese logo: círculo, anillos y bolsas | Foto de perfil de Instagram |
| Colores | Azul marino `#20376B` y turquesa `#59ABBF` (más blanco) | Medidos sobre el logo y las historias destacadas |
| Tono | "¿Ya stockeaste tu negocio?", "Aprovechá y estockeate" | Publicaciones de Instagram |

**No son públicos** (y por eso la web no los inventa): dirección exacta, horarios, zonas y días de reparto, medios
de pago, condiciones mayoristas, email y CUIT. Las historias destacadas "REPARTOS" y "HORARIOS" existen en Instagram,
pero su contenido no es visible sin iniciar sesión. En el sitio figuran como *"Consultalos por WhatsApp"*.

Dónde se editan: `frontend/src/content/site.ts` (`SITE`, `BUSINESS_INFO`, `SOCIAL_LINKS`), `faq.ts`, `benefits.ts`
y `frontend/src/pages/AboutPage.tsx`.

## Configurar el WhatsApp

El número de los botones y del checkout está centralizado en **una sola variable de entorno del backend**:
`WHATSAPP_NUMBER`. Los teléfonos del pie de página y de Preguntas frecuentes (`CONTACT_PHONES` en `site.ts`, que
también usa `faq.ts`) son texto informativo, sin enlaces: no generan llamadas (`tel:`) ni enlaces de WhatsApp.

**Valor recomendado**: `WHATSAPP_NUMBER=543534122227` (WhatsApp de ventas del Linktree de Blue Pack).

> ⚠️ Activarlo **solo con el OK del cliente**: mientras el catálogo sea de demostración, los pedidos que arma la web
> llevan productos y precios ficticios y llegarían a su WhatsApp real. Con `DEMO_MODE=true` el mensaje del pedido
> lo aclara antes del total (*"Pedido armado en la tienda de demostración: productos y precios de referencia, a confirmar"*),
> pero igual conviene avisarle a Blue Pack.

| Entorno | Dónde se configura |
| --- | --- |
| Docker | `bluepack/.env` → `WHATSAPP_NUMBER=...` |
| Local con `php -S` | `bluepack/backend/.env` → `WHATSAPP_NUMBER=...` |
| Vercel | Project Settings → Environment Variables → `WHATSAPP_NUMBER` |

**Formato**: internacional, solo dígitos, sin `+`, espacios ni guiones.
Para Argentina: `54` + código de área sin `0` + número sin `15`. Formato elegido: `543534122227`, el mismo que usa
el enlace del Linktree de Blue Pack. WhatsApp también acepta la forma con el `9` de celular (`5493534122227`);
si el cliente prefiere esa, usarla en todos lados (variable, `.env.example` y esta guía).

Mientras quede el placeholder `WHATSAPP_NUMBER_HERE` (o un valor inválido):

- la API responde `whatsapp.configured: false` y **no genera enlaces**;
- los botones de WhatsApp muestran el aviso *"WhatsApp pendiente de configuración"*;
- en el checkout se puede revisar y copiar el mensaje, pero no se abre ningún enlace.

El valor por defecto está documentado en `backend/config/app.php`. Los saludos de los mensajes predefinidos
("Hola, Blue Pack. Quisiera hacer una consulta.") están en `backend/src/WhatsApp/`.

## Publicar en Vercel

1. Importar el repositorio en Vercel. Nombre de proyecto sugerido: **`bluepack-demo`**
   (las metaetiquetas `og:image` de `frontend/index.html` apuntan a `https://bluepack-demo.vercel.app/og-image.png`).
2. **Root Directory**: `bluepack`.
3. Framework Preset: *Other* (la configuración ya está en `vercel.json`).
4. Variables de entorno: `WHATSAPP_NUMBER` (con el OK del cliente) y opcionalmente `DEMO_MODE`.
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
| `/nosotros` | Página institucional (logo y frases de su Instagram; sin fotos reales todavía) |
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
- **Datos del negocio**: `frontend/src/content/site.ts`. Si Blue Pack confirma dirección, horarios o zonas de
  reparto, se agregan a `BUSINESS_INFO` y se muestran solos en el pie de página.
- **Textos**: `faq.ts`, `benefits.ts` y `frontend/src/pages/AboutPage.tsx` (si Blue Pack comparte su historia o fotos
  reales del local y del equipo, se suman ahí; hoy la página usa el logo y frases de su Instagram).

## Checklist antes de publicar para el cliente

- [ ] Obtener el OK de Blue Pack y configurar `WHATSAPP_NUMBER=543534122227` (o el número que indiquen). Sin esa
      variable, el checkout muestra "configuración pendiente": para mostrarle la demo al cliente, cargar al menos un
      número de prueba propio.
- [ ] Reemplazar catálogo, precios e imágenes de producto por los reales.
- [ ] Confirmar con Blue Pack los datos públicos usados (teléfonos, redes, formato del número) y, si quieren, sumar
      dirección, horarios y zonas de reparto en `site.ts` y en Preguntas frecuentes.
- [ ] Redactar condiciones reales (repartos, retiros, medios de pago, mínimos mayoristas) en Preguntas frecuentes.
- [ ] Si Blue Pack comparte su historia o fotos reales (local o depósito, equipo), sumarlas en `/nosotros`.
- [ ] Poner `DEMO_MODE=false`: oculta los avisos de demo de la barra superior, el menú móvil, el pie y Preguntas
      frecuentes, y quita el aviso de precios de referencia del mensaje del pedido. Además, reescribir a mano las
      respuestas de `faq.ts` que hablan de la demostración y revisar los textos "demo"/"ficticio" de la ficha de
      producto, el carrito y el checkout.
- [ ] Quitar `<meta name="robots" content="noindex">` de `frontend/index.html` para que la tienda se indexe.
- [ ] Si el dominio final no es `bluepack-demo.vercel.app`, actualizar las URL de `og:image` y `twitter:image`
      en `frontend/index.html`.
- [ ] Pedirle a Blue Pack el logo en alta calidad (idealmente vectorial) para reemplazar el extraído de Instagram
      (`frontend/public/brand/`, favicons y `og-image.png`) y validar con ellos el isotipo sin texto.
