import { ArrowRight, Camera, HeartHandshake, Home, LayoutGrid, Sparkles, Store, UtensilsCrossed } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { usePageMeta } from '@/hooks/usePageMeta'

const VALUES = [
  { icon: LayoutGrid, title: 'Orden y variedad', text: 'Un catálogo claro, organizado por rubro, para encontrar rápido lo que necesitás.' },
  { icon: Sparkles, title: 'Practicidad', text: 'Productos pensados para el trabajo diario: servir, envasar, transportar y conservar.' },
  { icon: HeartHandshake, title: 'Atención cercana', text: 'Cada pedido se confirma conversando, para ajustar cantidades y alternativas.' },
]

const SEGMENTS = [
  { icon: Store, title: 'Comercios', text: 'Bolsas, envases y artículos de uso diario para el mostrador.' },
  { icon: UtensilsCrossed, title: 'Gastronomía', text: 'Packaging, vasos y envases para salón, delivery y take away.' },
  { icon: Home, title: 'Consumidores', text: 'Descartables para eventos, cumpleaños y el hogar.' },
]

function PhotoPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6 text-center text-brand-700 ${className}`}>
      <Camera className="size-7" aria-hidden />
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted">Espacio reservado para fotografía real</p>
    </div>
  )
}

export default function AboutPage() {
  usePageMeta('Nosotros', 'Conocé a Blue Pack, distribuidora de descartables, envases y packaging para comercios, gastronomía y consumidores.')
  const { config } = useStoreConfig()

  return (
    <>
      <PageHeader
        eyebrow="Nosotros"
        title="Soluciones descartables para cada negocio"
        description="Blue Pack es una distribuidora de productos descartables, envases y packaging. Acompañamos a comercios, gastronómicos y consumidores con un catálogo práctico y atención personalizada."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Nosotros' }]}
      />

      <Container className="py-14 sm:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">Quiénes somos</p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-navy-900">Una distribuidora pensada para facilitar tu trabajo</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink">
              <p>
                En Blue Pack reunimos en un mismo lugar los artículos que un negocio usa todos los días: vasos, platos, bandejas, envases para alimentos, bolsas, cubiertos, papel y packaging gastronómico.
              </p>
              <p>Queremos que comprar sea simple: elegís los productos, armás tu pedido y lo coordinamos con vos de forma directa.</p>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-4 text-sm text-muted">
              <p className="font-semibold text-navy-900">Historia de la empresa</p>
              <p className="mt-1">Texto provisional. Este espacio se completará con la historia, la trayectoria y los datos comerciales que Blue Pack proporcione.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PhotoPlaceholder label="Foto del local o depósito" className="col-span-2 aspect-[16/9]" />
            <div className="product-stage aspect-square overflow-hidden rounded-3xl border border-line">
              <ProductImage src="/images/products/envase-delivery-redondo.svg" alt="Envases para delivery" className="size-full p-6" />
            </div>
            <PhotoPlaceholder label="Foto del equipo" className="aspect-square" />
          </div>
        </section>

        <section className="mt-20" aria-labelledby="values">
          <h2 id="values" className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            Nuestra propuesta
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-3xl border border-line bg-white p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-sm shadow-brand-500/30">
                  <Icon className="size-6" aria-hidden />
                </span>
                <p className="mt-5 text-lg font-bold text-navy-900">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 rounded-[2rem] bg-surface p-6 sm:p-10" aria-labelledby="segments">
          <h2 id="segments" className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            A quiénes acompañamos
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {SEGMENTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-card">
                <Icon className="size-7 shrink-0 text-brand-500" aria-hidden />
                <span>
                  <span className="block font-bold text-navy-900">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 flex flex-col items-center rounded-[2rem] bg-navy-900 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">¿Listo para armar tu pedido?</h2>
          <p className="mt-3 max-w-xl text-white/75">Explorá el catálogo o escribinos para contarnos qué necesita tu negocio.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/productos" size="lg" variant="light">
              Explorar catálogo
              <ArrowRight className="size-5" aria-hidden />
            </ButtonLink>
            <WhatsAppButton href={config?.whatsapp.links.general} size="lg">
              Escribinos por WhatsApp
            </WhatsAppButton>
          </div>
        </section>
      </Container>
    </>
  )
}
