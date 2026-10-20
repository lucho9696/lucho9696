import { ArrowRight, Boxes, Home, MapPin, MessageCircleMore, PackageOpen, ShoppingBag, Store, UtensilsCrossed } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { SITE, SOCIAL_LINKS } from '@/content/site'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { usePageMeta } from '@/hooks/usePageMeta'

const VALUES = [
  { icon: ShoppingBag, title: 'Por mayor y por menor', text: 'Comprás en cantidad para stockear tu negocio o llevás solo lo que necesitás.' },
  { icon: Boxes, title: 'Todo en un mismo lugar', text: 'Vasos, servilletas, bolsas, cajas, envases y más, para resolver tu compra de una vez.' },
  { icon: MessageCircleMore, title: 'Atención por WhatsApp', text: 'Te atendemos por WhatsApp para armar tu pedido y responder tus consultas.' },
]

const SEGMENTS = [
  { icon: Store, title: 'Comercios', text: 'Bolsas, envases y artículos de uso diario para el mostrador.' },
  { icon: UtensilsCrossed, title: 'Gastronomía', text: 'Vasos, cajas, envases y servilletas para salón, delivery y take away.' },
  { icon: Home, title: 'Consumidores', text: 'También vendemos por menor: llevá lo que necesites.' },
]

// Mismo estilo de ícono que los beneficios de la home, para que el turquesa de la marca recorra todo el sitio
const ICON_TILE = 'grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100'

export default function AboutPage() {
  usePageMeta('Nosotros', 'Conocé a Blue Pack: venta mayorista y minorista de descartables en Villa María, Córdoba. Tenemos todo lo que tu negocio necesita.')
  const { config } = useStoreConfig()

  return (
    <>
      <PageHeader
        eyebrow="Nosotros"
        title="Tenemos todo lo que tu negocio necesita"
        description="En Blue Pack vendemos descartables por mayor y por menor en Villa María, Córdoba: vasos, servilletas, bolsas, cajas, envases y más."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Nosotros' }]}
      />

      <Container className="py-14 sm:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent-700 uppercase">Quiénes somos</p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-navy-900">Descartables para tu negocio, en Villa María</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink">
              <p>
                En {SITE.name} reunimos los descartables que un negocio usa todos los días: vasos, servilletas, bolsas, cajas, envases, rollos de papel y mucho más.
              </p>
              <p>
                Vendemos por mayor y por menor, así que podés stockear tu comercio o llevar solo lo que te hace falta. ¿Ya stockeaste tu negocio? Escribinos por WhatsApp y armamos tu pedido.
              </p>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold text-navy-900">Seguinos en redes</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SOCIAL_LINKS.filter((social) => social.label !== 'Linktree').map(({ label, handle, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-navy-900 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700"
                    >
                      <Icon className="size-4" aria-hidden />
                      {label}
                      <span className="hidden font-normal text-muted sm:inline">{handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-3xl bg-navy-900 p-5 sm:p-6">
              <div className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full border-[36px] border-accent-400/10" aria-hidden />
              <div className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-accent-400/15 blur-3xl" aria-hidden />
              <img
                src="/brand/bluepack-logo-512.png"
                alt="Logo de Blue Pack Descartables"
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
                className="relative h-full max-h-64 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col rounded-3xl bg-accent-400 p-5 text-navy-950 sm:p-6">
              <PackageOpen className="size-7" aria-hidden />
              <p className="mt-auto pt-6 text-lg leading-tight font-extrabold sm:text-2xl">Tomá lo que necesites</p>
              <p className="mt-2 text-sm font-medium">Por caja cerrada o por unidad.</p>
            </div>
            <div className="flex flex-col rounded-3xl border border-line bg-surface p-5 sm:p-6">
              <MapPin className="size-7 text-accent-700" aria-hidden />
              <p className="mt-auto pt-6 text-lg leading-tight font-extrabold text-navy-900 sm:text-2xl">{SITE.location}</p>
              <p className="mt-2 text-sm text-muted">Horarios y repartos: consultalos por WhatsApp.</p>
            </div>
          </div>
        </section>

        <section className="mt-20" aria-labelledby="values">
          <h2 id="values" className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            Nuestra propuesta
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-3xl border border-line bg-white p-6">
                <span className={ICON_TILE}>
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
                <span className={ICON_TILE}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold text-navy-900">{title}</span>
                  <span className="mt-1 block text-sm text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 flex flex-col items-center rounded-[2rem] bg-navy-900 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">¿Ya stockeaste tu negocio?</h2>
          <p className="mt-3 max-w-xl text-white/75">Aprovechá y estockeate: explorá el catálogo o escribinos para contarnos qué necesitás.</p>
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
