import { ArrowRight, Check } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { useStoreConfig } from '@/context/StoreConfigContext'

const AUDIENCES = ['Comercios y almacenes', 'Gastronómicos y rotiserías', 'Revendedores y distribuidores', 'Eventos e instituciones']

export function WholesaleBanner() {
  const { config } = useStoreConfig()

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full border-[48px] border-white/5" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-sm font-semibold tracking-wide text-brand-200 uppercase">Compras mayoristas</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">¿Necesitás comprar por mayor?</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
                Si tenés un comercio, un local gastronómico o revendés, comunicate directamente con Poliluz para consultar precios mayoristas y condiciones comerciales.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton href={config?.whatsapp.links.wholesale} size="lg">
                  Consultar por WhatsApp
                </WhatsAppButton>
                <ButtonLink to="/mayoristas" size="lg" variant="inverse">
                  Más información
                  <ArrowRight className="size-5" aria-hidden />
                </ButtonLink>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {AUDIENCES.map((audience) => (
                <li key={audience} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500">
                    <Check className="size-4" aria-hidden />
                  </span>
                  <span className="font-medium">{audience}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
