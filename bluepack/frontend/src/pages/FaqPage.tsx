import { MessageCircleQuestion } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Accordion } from '@/components/ui/Accordion'
import { Alert } from '@/components/ui/Alert'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { FAQ_GROUPS } from '@/content/faq'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function FaqPage() {
  usePageMeta('Preguntas frecuentes', 'Cómo hacer un pedido, consultas mayoristas, precios, disponibilidad y entregas en Blue Pack.')
  const { config } = useStoreConfig()

  return (
    <>
      <PageHeader
        eyebrow="Ayuda"
        title="Preguntas frecuentes"
        description="Todo sobre cómo funciona la tienda online de Blue Pack."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Preguntas frecuentes' }]}
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <Alert title="Sobre esta demostración">
            Esta tienda es una demo. Las respuestas describen cómo funciona el sitio; las condiciones comerciales (precios, entregas, medios de pago) todavía deben ser confirmadas por Blue Pack.
          </Alert>
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
            <MessageCircleQuestion className="size-8 text-brand-200" aria-hidden />
            <h2 className="mt-4 text-lg font-bold">¿No encontraste tu respuesta?</h2>
            <p className="mt-2 text-sm text-white/75">Escribinos y te ayudamos con tu consulta o pedido.</p>
            <WhatsAppButton href={config?.whatsapp.links.general} className="mt-5 w-full">
              Consultar por WhatsApp
            </WhatsAppButton>
          </div>
        </aside>
      </Container>
    </>
  )
}
