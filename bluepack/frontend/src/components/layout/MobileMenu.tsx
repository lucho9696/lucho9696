import { ChevronRight, MapPin } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ProductImage } from '@/components/product/ProductImage'
import { Drawer } from '@/components/ui/Drawer'
import { Logo } from '@/components/ui/Logo'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { MAIN_NAV, SITE, SOCIAL_LINKS } from '@/content/site'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useCategories } from '@/hooks/useCategories'
import { useDemoMode } from '@/hooks/useDemoMode'
import { catalogUrl } from '@/lib/catalogParams'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: categories } = useCategories()
  const { config } = useStoreConfig()
  const demo = useDemoMode()

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title="Menú"
      hideTitle
      headerExtra={<Logo onClick={onClose} />}
      footer={
        <div className="space-y-3">
          <WhatsAppButton href={config?.whatsapp.links.general} className="w-full">
            Escribinos por WhatsApp
          </WhatsAppButton>
          {demo && <p className="text-center text-xs text-muted">{SITE.demoNotice}</p>}
        </div>
      }
    >
      <nav aria-label="Navegación principal" className="px-3 py-3">
        <ul className="space-y-0.5">
          {MAIN_NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-navy-900 hover:bg-surface'}`
                }
              >
                {item.label}
                <ChevronRight className="size-4 text-slate-400" aria-hidden />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-line px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold tracking-wider text-muted uppercase">Categorías</p>
        <ul className="grid grid-cols-2 gap-2">
          {categories?.map((category) => (
            <li key={category.id}>
              <NavLink to={catalogUrl({ category: category.slug })} onClick={onClose} className="flex h-full flex-col items-center gap-1.5 rounded-xl border border-line p-2.5 text-center hover:border-brand-200 hover:bg-brand-50/50">
                <span className="product-stage block size-14 overflow-hidden rounded-lg">
                  <ProductImage src={category.image} alt="" className="size-full p-1.5" />
                </span>
                <span className="text-xs leading-tight font-semibold text-navy-900">{category.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line px-6 py-5">
        <p className="font-semibold text-navy-900">{SITE.fullName}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-4 shrink-0 text-accent-600" aria-hidden />
          Venta mayorista y minorista · {SITE.location}
        </p>
        <ul className="mt-3 flex gap-2">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE.name} en ${label}`}
                className="grid size-10 place-items-center rounded-xl border border-line text-navy-900 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  )
}
