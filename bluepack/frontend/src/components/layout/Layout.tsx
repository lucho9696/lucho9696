import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageLoader } from './PageLoader'
import { TopBar } from './TopBar'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenido" className="sr-only z-[80] rounded-lg bg-white px-4 py-2 font-semibold text-brand-600 shadow-lift focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Saltar al contenido
      </a>
      <ScrollToTop />
      <TopBar />
      <Header />
      <main id="contenido" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
