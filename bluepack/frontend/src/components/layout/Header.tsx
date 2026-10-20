import { Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { SearchBox } from '@/components/search/SearchBox'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { MAIN_NAV } from '@/content/site'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { CartButton } from './CartButton'
import { CategoriesMenu } from './CategoriesMenu'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { config } = useStoreConfig()
  const location = useLocation()

  useEffect(() => setSearchOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex h-12 items-center px-3 text-[15px] font-semibold transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-transform after:duration-300 ${
      isActive ? 'text-brand-600 after:scale-x-100 after:bg-brand-500' : 'text-navy-900 after:scale-x-0 after:bg-brand-500 hover:text-brand-600'
    }`

  return (
    <header className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-white/85 ${scrolled ? 'border-line shadow-card' : 'border-line/70'}`}>
      <Container className="flex h-16 items-center gap-3 lg:h-[76px] lg:gap-8">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 grid size-11 place-items-center rounded-xl text-navy-900 hover:bg-surface lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-6" />
        </button>
        <Logo />
        <SearchBox className="mx-auto hidden w-full max-w-xl md:block" />
        <div className="ml-auto flex items-center gap-1 md:ml-0 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-xl text-navy-900 hover:bg-surface md:hidden"
            aria-label={searchOpen ? 'Cerrar buscador' : 'Abrir buscador'}
            aria-expanded={searchOpen}
          >
            <Search className="size-[22px]" />
          </button>
          <WhatsAppButton href={config?.whatsapp.links.general} size="sm" className="h-10 max-sm:hidden">
            WhatsApp
          </WhatsAppButton>
          <CartButton />
        </div>
      </Container>

      {searchOpen && (
        <div className="animate-fade-in border-t border-line bg-white py-3 md:hidden">
          <Container>
            <SearchBox onNavigate={() => setSearchOpen(false)} />
          </Container>
        </div>
      )}

      <nav aria-label="Navegación principal" className="hidden border-t border-line/70 lg:block">
        <Container className="flex items-center gap-1">
          <NavLink to="/" end className={navLink}>
            Inicio
          </NavLink>
          <NavLink to="/productos" className={navLink}>
            Todos los productos
          </NavLink>
          <CategoriesMenu />
          {MAIN_NAV.slice(2).map((item) => (
            <NavLink key={item.to} to={item.to} className={navLink}>
              {item.label}
            </NavLink>
          ))}
        </Container>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
