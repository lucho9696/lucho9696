import { ArrowLeft, CheckCircle2, CircleSlash, Info, MessageCircleMore, Package, ShoppingCart, Store, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ProductBadges } from '@/components/product/ProductBadges'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductImage } from '@/components/product/ProductImage'
import { useAddToCart } from '@/components/product/useAddToCart'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { useCart } from '@/context/CartContext'
import { useApi } from '@/hooks/useApi'
import { usePageMeta } from '@/hooks/usePageMeta'
import { api } from '@/lib/api'
import { LAST_CATALOG_KEY, catalogUrl } from '@/lib/catalogParams'
import { formatPrice, formatUnits } from '@/lib/format'
import { readStorage } from '@/lib/storage'
import type { Product, WhatsAppLinkInfo } from '@/types/catalog'

function Gallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0)
  const images = product.gallery.length ? product.gallery : [product.image]

  return (
    <div className="lg:sticky lg:top-36">
      <div className="product-stage relative aspect-square overflow-hidden rounded-3xl border border-line">
        <ProductImage key={images[selected]} src={images[selected]} alt={product.name} loading="eager" className="size-full animate-fade-in p-8 sm:p-12" />
        <ProductBadges product={product} className="absolute top-4 left-4" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3" role="tablist" aria-label="Imágenes del producto">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-label={`Ver imagen ${index + 1}`}
              onClick={() => setSelected(index)}
              className={`product-stage size-20 overflow-hidden rounded-2xl border-2 transition-colors sm:size-24 ${selected === index ? 'border-brand-500' : 'border-line hover:border-brand-200'}`}
            >
              <ProductImage src={image} alt="" className="size-full p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PurchasePanel({ product, inquiry }: { product: Product; inquiry: WhatsAppLinkInfo }) {
  const [quantity, setQuantity] = useState(1)
  const addToCart = useAddToCart()
  const { quantityOf } = useCart()
  const inCart = quantityOf(product.id)

  return (
    <div>
      {product.category && (
        <Link to={catalogUrl({ category: product.category.slug })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <Tag className="size-4" aria-hidden />
          {product.category.name}
        </Link>
      )}
      <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-navy-900 sm:text-4xl">{product.name}</h1>
      <p className="mt-2 text-sm text-muted">SKU: {product.sku} · código de demostración</p>

      <div className="mt-6 rounded-2xl border border-line bg-surface/70 p-5">
        <p className="text-4xl font-extrabold tracking-tight text-navy-900 tabular-nums">{formatPrice(product.price)}</p>
        <p className="mt-1 text-sm text-muted">Precio de referencia por {product.saleUnit.singular} · valor ficticio de la demo</p>
        <dl className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Package className="size-4 shrink-0 text-brand-500" aria-hidden />
            <dt className="text-muted">Presentación:</dt>
            <dd className="font-semibold text-navy-900">{product.presentation}</dd>
          </div>
          <div className="flex items-center gap-2">
            {product.available ? <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden /> : <CircleSlash className="size-4 shrink-0 text-slate-400" aria-hidden />}
            <dt className="sr-only">Disponibilidad:</dt>
            <dd className={`font-semibold ${product.available ? 'text-emerald-700' : 'text-slate-500'}`}>{product.available ? 'Disponible en catálogo' : 'Sin stock por el momento'}</dd>
          </div>
        </dl>
      </div>

      {product.available ? (
        <div className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} className="self-start sm:self-auto" />
            <Button size="md" className="w-full sm:w-auto sm:flex-1" onClick={() => addToCart(product, quantity)}>
              <ShoppingCart className="size-5" aria-hidden />
              Agregar al carrito
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted">
            Subtotal: <span className="font-semibold text-navy-900 tabular-nums">{formatPrice(product.price * quantity)}</span> por {formatUnits(quantity, product.saleUnit)}
            {inCart > 0 && <span className="text-brand-600"> · Ya tenés {formatUnits(inCart, product.saleUnit)} en el carrito</span>}
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
          Este producto no está disponible por el momento. Consultá por WhatsApp si podemos conseguirlo o buscá una alternativa en la misma categoría.
        </div>
      )}

      <WhatsAppButton href={inquiry.url} variant="outline" className="mt-3 w-full">
        Consultar por este producto
      </WhatsAppButton>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: MessageCircleMore, title: 'Pedido por WhatsApp', text: 'Confirmás todo conversando.' },
          { icon: Store, title: 'Compras por mayor', text: 'Consultá condiciones.' },
          { icon: Info, title: 'Precios estimativos', text: 'Se confirman con Blue Pack.' },
        ].map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl border border-line p-3.5">
            <Icon className="size-5 text-brand-500" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-navy-900">{title}</p>
            <p className="text-xs text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2" aria-hidden>
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const location = useLocation()
  const { data, error, loading, isStale } = useApi(`product:${slug}`, () => api.product(slug))
  const product = isStale ? undefined : data?.data
  usePageMeta(product?.name ?? (error ? 'Producto no encontrado' : 'Producto'), product?.description)

  const from = (location.state as { from?: string } | null)?.from
  const lastCatalog = readStorage(LAST_CATALOG_KEY, 'session')
  const backTo = from?.startsWith('/productos') ? from : (lastCatalog ?? (product?.category ? catalogUrl({ category: product.category.slug }) : '/productos'))

  if (error && !loading) {
    return (
      <Container className="py-16">
        <EmptyState icon={Package} title={error.status === 404 ? 'Producto no encontrado' : 'No pudimos cargar el producto'} description={error.message}>
          <ButtonLink to="/productos">Ver todos los productos</ButtonLink>
        </EmptyState>
      </Container>
    )
  }

  return (
    <>
      <Container className="pt-6 pb-14 sm:pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: 'Inicio', to: '/' },
              { label: 'Productos', to: '/productos' },
              ...(product?.category ? [{ label: product.category.name, to: catalogUrl({ category: product.category.slug }) }] : []),
              ...(product ? [{ label: product.name }] : []),
            ]}
          />
          <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            <ArrowLeft className="size-4" aria-hidden />
            Volver al catálogo
          </Link>
        </div>

        {!product || !data ? (
          <ProductSkeleton />
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              <Gallery key={`gallery-${product.id}`} product={product} />
              <PurchasePanel key={`purchase-${product.id}`} product={product} inquiry={data.inquiry} />
            </div>

            <section className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]" aria-labelledby="product-description">
              <div>
                <h2 id="product-description" className="text-xl font-bold text-navy-900">
                  Descripción
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">{product.description}</p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 text-sm leading-relaxed text-navy-900">
                <p className="font-semibold">Información importante</p>
                <p className="mt-2 text-muted">
                  Producto, imagen y precio son ilustrativos (demo). Valores finales, disponibilidad, entrega y condiciones comerciales se confirman con Blue Pack por WhatsApp.
                </p>
              </div>
            </section>
          </>
        )}
      </Container>

      {product && data && data.related.length > 0 && (
        <section className="border-t border-line bg-surface py-14">
          <Container>
            <SectionHeader title="Productos relacionados" link={product.category ? { to: catalogUrl({ category: product.category.slug }), label: `Ver más de ${product.category.name}` } : undefined} />
            <ProductGrid products={data.related} />
          </Container>
        </section>
      )}
    </>
  )
}
