import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types/catalog'
import { ProductCard } from './ProductCard'

/** Carrusel horizontal con scroll-snap, botones y soporte táctil nativo. */
export function ProductCarousel({ products, loading, label }: { products: Product[] | undefined; loading?: boolean; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update, products])

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: 'smooth' })
  }

  const arrow =
    'absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-navy-900 shadow-card transition-[opacity,background-color] hover:bg-brand-50 disabled:pointer-events-none disabled:opacity-0 md:grid'

  return (
    <div className="relative" role="region" aria-roledescription="carrusel" aria-label={label}>
      <button type="button" className={`${arrow} -left-4`} onClick={() => scroll(-1)} disabled={edges.start} aria-label="Ver anteriores">
        <ChevronLeft className="size-5" />
      </button>
      <div
        ref={trackRef}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {(loading && !products?.length ? Array.from({ length: 4 }, () => null) : (products ?? [])).map((product, index) => (
          <div key={product?.id ?? index} className="w-[70%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[calc(25%-15px)]">
            {product ? <ProductCard product={product} className="h-full" /> : <ProductCardSkeleton />}
          </div>
        ))}
      </div>
      <button type="button" className={`${arrow} -right-4`} onClick={() => scroll(1)} disabled={edges.end} aria-label="Ver siguientes">
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
