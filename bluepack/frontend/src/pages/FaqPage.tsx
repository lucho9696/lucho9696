import { MessageCircleQuestion } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Accordion } from '@/components/ui/Accordion'
import { Alert } from '@/components/ui/Alert'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { FAQ_GROUPS } from '@/content/faq'
import { CONTACT_PHONES, SITE, SOCIAL_LINKS } from '@/content/site'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useDemoMode } from '@/hooks/useDemoMode'
import { usePageMeta } from '@/hooks/usePageMeta'

// Líneas de contacto públicas (las mismas del pie de página).
const CONTACT_INFO = Object.values(CONTACT_PHONES)

export default function FaqPage() {
  usePageMeta('Preguntas frecuentes', 'Cómo hacer tu pedido en Blue Pack, venta mayorista y minorista, precios, horarios, repartos y contacto. Villa María, Córdoba.')
  const { config } = useStoreConfig()
  const demo = useDemoMode()

  return (
    <>
      <PageHeader
        eyebrow="Ayuda"
        title="Preguntas frecuentes"
        description="Cómo funciona la tienda online de Blue Pack, cómo comprar por mayor o por menor y cómo comunicarte con nosotros."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Preguntas frecuentes' }]}
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          {demo && (
            <Alert title="Sobre esta demostración">
              Esta tienda es una demo: los productos y precios publicados son ficticios. Las respuestas describen cómo funciona el sitio; los precios reales, horarios, repartos y medios de pago te los confirmamos por WhatsApp.
            </Alert>
          )}
          {FAQ_GROUPS.map((group, index) => (
            <section key={group.title} aria-labelledby={`faq-${index}`}>
              <h2 id={`faq-${index}`} className="mb-4 text-xl font-bold text-navy-900">
                {group.title}
              </h2>
              <Accordion items={group.items} defaultOpen={index === 0 ? 0 : null} />
            </section>
          ))}
        </div>
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-3xl bg-navy-900 p-6 text-white">
            <MessageCircleQuestion className="size-8 text-accent-300" aria-hidden />
            <h2 className="mt-4 text-lg font-bold">¿No encontraste tu respuesta?</h2>
            <p className="mt-2 text-sm text-white/75">Escribinos y te ayudamos con tu consulta o pedido.</p>
            <WhatsAppButton href={config?.whatsapp.links.general} className="mt-5 w-full">
              Consultar por WhatsApp
            </WhatsAppButton>
            <dl className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
              {CONTACT_INFO.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-white/65">{item.label}</dt>
                  <dd className="font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} en ${label}`}
                    className="grid size-10 place-items-center rounded-xl border border-white/20 bg-white/5 text-white/85 transition-colors hover:border-accent-300/60 hover:bg-white/10 hover:text-accent-200"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
    </>
  )
}
