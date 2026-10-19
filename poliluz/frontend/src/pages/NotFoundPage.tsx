import { ArrowRight, Home } from 'lucide-react'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('Página no encontrada')

  return (
    <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
      <div className="order-2 text-center lg:order-1 lg:text-left">
        <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">Error 404</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">Esta página quedó vacía</h1>
        <p className="mt-4 text-lg text-muted">La dirección que buscás no existe o fue movida. Te ayudamos a volver a la tienda.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
          <ButtonLink to="/" size="lg">
            <Home className="size-5" aria-hidden />
            Ir al inicio
          </ButtonLink>
          <ButtonLink to="/productos" size="lg" variant="outline">
            Ver productos
            <ArrowRight className="size-5" aria-hidden />
          </ButtonLink>
        </div>
      </div>
      <div className="order-1 mx-auto w-full max-w-sm lg:order-2">
        <div className="product-stage relative aspect-square rounded-[2.5rem] border border-line">
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[7rem] leading-none font-black text-brand-100 select-none sm:text-[9rem]" aria-hidden>
            404
          </span>
          <ProductImage src="/images/products/caja-hamburguesa.svg" alt="" loading="eager" className="relative size-full p-12 pt-24" />
        </div>
      </div>
    </Container>
  )
}
