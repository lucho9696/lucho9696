import { ArrowRight, CheckCircle2, Store } from 'lucide-react'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

const TRUST_POINTS = ['Catálogo organizado por rubro', 'Pedido simple por WhatsApp', 'Atención personalizada']

function Tile({ src, label, className = '' }: { src: string; label: string; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-white bg-white/80 shadow-card backdrop-blur ${className}`}>
      <div className="product-stage absolute inset-0" />
      <ProductImage src={src} alt={label} loading="eager" className="relative size-full p-3 transition-transform duration-500 group-hover:scale-105 sm:p-4" />
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
      <svg className="pointer-events-none absolute -top-10 right-0 h-[520px] w-[620px] text-brand-200/60" aria-hidden>
        <defs>
          <pattern id="hero-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>
      <div className="pointer-events-none absolute top-1/3 -left-40 size-[420px] rounded-full bg-brand-100/50 blur-3xl" aria-hidden />

      <Container className="relative grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm sm:text-sm">
            <Store className="size-4" aria-hidden />
            Distribuidora de descartables y packaging
          </span>
          <h1 className="mt-5 text-[2.35rem] leading-[1.08] font-extrabold tracking-tight text-balance text-navy-900 sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
            Todo lo que tu negocio necesita, <span className="text-brand-500">en un solo lugar</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Descartables, envases, bolsas y packaging para comercios, gastronomía y hogares. Elegí tus productos, armá el pedido y envialo a Poliluz por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/productos" size="lg">
              Explorar productos
              <ArrowRight className="size-5" aria-hidden />
            </ButtonLink>
            <ButtonLink to="/mayoristas" size="lg" variant="outline">
              Consultas por mayor
            </ButtonLink>
          </div>
          <ul className="mt-8 grid gap-2.5 text-sm text-ink sm:grid-cols-3 sm:gap-4">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <CheckCircle2 className="size-5 shrink-0 text-brand-500" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl animate-fade-up [animation-delay:120ms] lg:max-w-none">
          <div className="rounded-[2rem] border border-white bg-gradient-to-br from-brand-100/70 via-brand-50 to-white p-3 shadow-lift sm:p-4">
            <div className="grid aspect-square grid-cols-3 grid-rows-3 gap-3 sm:gap-4">
              <Tile src="/images/products/caja-hamburguesa-abierta.svg" label="Caja kraft para hamburguesas" className="col-span-2 row-span-2" />
              <Tile src="/images/products/vaso-cristal-500.svg" label="Vaso plástico transparente" />
              <Tile src="/images/products/envase-vianda.svg" label="Envases para viandas" />
              <Tile src="/images/products/bandeja-aluminio.svg" label="Bandejas de aluminio" />
              <Tile src="/images/products/cono-papas.svg" label="Cono para papas fritas" />
              <Tile src="/images/products/bolsa-kraft.svg" label="Bolsa de papel kraft" />
            </div>
          </div>

          <div className="absolute top-6 -left-3 hidden animate-float items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-float sm:flex lg:-left-8">
            <span className="grid size-10 place-items-center rounded-xl bg-whatsapp text-white">
              <WhatsAppIcon />
            </span>
            <span>
              <span className="block text-sm font-bold text-navy-900">Pedido por WhatsApp</span>
              <span className="block text-xs text-muted">Armá el carrito y envialo</span>
            </span>
          </div>

          <div className="absolute right-6 -bottom-6 hidden animate-float items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-4 shadow-float [animation-delay:-3s] sm:flex">
            <span className="product-stage size-12 overflow-hidden rounded-xl">
              <ProductImage src="/images/products/potes-salsa.svg" alt="" className="size-full p-1" />
            </span>
            <span>
              <span className="block text-xs text-muted">Envases para alimentos</span>
              <span className="block text-sm font-bold text-navy-900">Delivery y take away</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
