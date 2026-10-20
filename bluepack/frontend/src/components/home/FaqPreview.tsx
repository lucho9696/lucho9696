import { ArrowRight } from 'lucide-react'
import { Accordion } from '@/components/ui/Accordion'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { FAQ_PREVIEW } from '@/content/faq'
import { useStoreConfig } from '@/context/StoreConfigContext'

export function FaqPreview() {
  const { config } = useStoreConfig()

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">Preguntas frecuentes</p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">¿Tenés dudas sobre cómo comprar?</h2>
          <p className="mt-3 text-muted">Te contamos cómo funciona el pedido online. Si no encontrás tu respuesta, escribinos.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/preguntas-frecuentes" variant="outline">
              Ver todas las preguntas
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <WhatsAppButton href={config?.whatsapp.links.general} variant="secondary">
              Consultar
            </WhatsAppButton>
          </div>
        </div>
        <Accordion items={FAQ_PREVIEW} />
      </Container>
    </section>
  )
}
