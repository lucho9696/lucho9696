import { ArrowRight, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ProductImage } from '@/components/product/ProductImage'
import { useCategories } from '@/hooks/useCategories'
import { catalogUrl } from '@/lib/catalogParams'
import { pluralize } from '@/lib/format'

/** Menú desplegable de categorías para escritorio. */
export function CategoriesMenu() {
  const { data: categories } = useCategories()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const openRef = useRef(false)
  // Momento en que se abrió con hover: un clic inmediato posterior no debe cerrarlo.
  const hoverOpenedAt = useRef(0)

  const setMenu = useCallback((value: boolean) => {
    openRef.current = value
    setOpen(value)
  }, [])

  useEffect(() => setMenu(false), [location, setMenu])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenu(false)
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setMenu(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, setMenu])

  const show = () => {
    window.clearTimeout(closeTimer.current)
    if (!openRef.current) {
      hoverOpenedAt.current = Date.now()
      setMenu(true)
    }
  }
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setMenu(false), 150)
  }
  const toggle = () => {
    if (openRef.current && Date.now() - hoverOpenedAt.current < 600) return
    hoverOpenedAt.current = 0
    setMenu(!openRef.current)
  }

  return (
    <div ref={wrapperRef} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={toggle}
        className={`inline-flex h-12 items-center gap-1.5 px-3 text-[15px] font-semibold transition-colors ${open ? 'text-brand-600' : 'text-navy-900 hover:text-brand-600'}`}
      >
        Categorías
        <ChevronDown className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 w-[min(860px,calc(100vw-4rem))] animate-fade-up rounded-3xl border border-line bg-white p-4 shadow-lift">
          <div className="grid grid-cols-4 gap-2">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={catalogUrl({ category: category.slug })}
                className="group flex flex-col rounded-2xl p-3 transition-colors hover:bg-surface"
              >
                <span className="product-stage block aspect-[4/3] overflow-hidden rounded-xl">
                  <ProductImage src={category.image} alt="" className="size-full p-3 transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="mt-2.5 text-sm font-semibold text-navy-900 group-hover:text-brand-600">{category.name}</span>
                <span className="text-xs text-muted">{pluralize(category.productCount, 'producto', 'productos')}</span>
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3">
            <p className="text-sm text-navy-900">¿No encontrás lo que buscás? Consultanos por productos fuera del catálogo.</p>
            <Link to="/productos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Ver todo el catálogo <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
