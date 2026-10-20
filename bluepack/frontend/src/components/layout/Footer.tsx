import { Facebook, Instagram, Music2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { BUSINESS_INFO_PLACEHOLDER, MAIN_NAV, SITE } from '@/content/site'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useCategories } from '@/hooks/useCategories'
import { useDemoMode } from '@/hooks/useDemoMode'
import { catalogUrl } from '@/lib/catalogParams'

const SOCIAL_PLACEHOLDERS = [
  { label: 'Instagram', icon: Instagram },
  { label: 'Facebook', icon: Facebook },
  { label: 'TikTok', icon: Music2 },
]

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-wider text-white uppercase">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

const linkClass = 'text-white/70 transition-colors hover:text-white'

export function Footer() {
  const { config } = useStoreConfig()
  const { data: categories } = useCategories()
  const demo = useDemoMode()

  return (
    <footer className="mt-auto bg-navy-900 text-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{SITE.shortDescription} Armá tu pedido online y coordinalo por WhatsApp.</p>
          <WhatsAppButton href={config?.whatsapp.links.general} className="mt-6">
            Escribinos por WhatsApp
          </WhatsAppButton>
          <div className="mt-6">
            <p className="text-xs text-white/50">Redes sociales (a definir)</p>
            <ul className="mt-2 flex gap-2">
              {SOCIAL_PLACEHOLDERS.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <span
                    className="grid size-10 place-items-center rounded-xl border border-dashed border-white/25 text-white/50"
                    title={`${label}: perfil a confirmar`}
                    aria-label={`${label}: perfil a confirmar`}
                    role="img"
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterColumn title="Navegación">
          {MAIN_NAV.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/carrito" className={linkClass}>
              Mi carrito
            </Link>
          </li>
        </FooterColumn>

        <FooterColumn title="Categorías">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link to={catalogUrl({ category: category.slug })} className={linkClass}>
                {category.name}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <div className="col-span-2 lg:col-span-1">
          <FooterColumn title="Información comercial">
            {BUSINESS_INFO_PLACEHOLDER.map((item) => (
              <li key={item.label} className="text-white/70">
                <span className="block text-xs text-white/50">{item.label}</span>
                {item.value}
              </li>
            ))}
            <li>
              <Link to="/preguntas-frecuentes" className={linkClass}>
                Preguntas frecuentes
              </Link>
            </li>
          </FooterColumn>
          <p className="mt-5 rounded-xl border border-white/15 bg-white/5 p-3 text-xs leading-relaxed text-white/60">
            Datos de ejemplo. Dirección, horarios, redes y condiciones comerciales se completarán cuando Blue Pack los confirme.
          </p>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Blue Pack{demo && ' · Tienda demostrativa.'}
          </p>
          {demo && <p>Productos, precios e imágenes son ilustrativos y no constituyen una oferta comercial.</p>}
        </Container>
      </div>
    </footer>
  )
}
