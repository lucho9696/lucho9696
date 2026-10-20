import { Eye, ShoppingCart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/catalog'
import { ProductBadges } from './ProductBadges'
import { ProductImage } from './ProductImage'
import { useAddToCart } from './useAddToCart'

export function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  const addToCart = useAddToCart()
  const location = useLocation()
  const to = `/producto/${product.slug}`
  // Guarda desde dónde se abrió el producto para volver con los mismos filtros.
  const state = { from: `${location.pathname}${location.search}` }

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-lift ${className}`}>
      <Link to={to} state={state} className="product-stage relative block aspect-square overflow-hidden" tabIndex={-1} aria-hidden>
        <ProductImage
          src={product.image}
          alt=""
          className={`size-full p-5 transition-transform duration-500 group-hover:scale-[1.05] sm:p-6 ${product.available ? '' : 'opacity-60 grayscale-[30%]'}`}
        />
        <ProductBadges product={product} className="absolute top-3 left-3" />
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {product.category && <p className="truncate text-[11px] font-semibold tracking-wider text-brand-500 uppercase">{product.category.name}</p>}
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 font-semibold text-navy-900 sm:text-[15px]">
          <Link to={to} state={state} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 truncate text-xs text-muted sm:text-[13px]">{product.presentation}</p>

        <div className="mt-auto pt-3">
          <p className="text-lg font-extrabold tracking-tight text-navy-900 tabular-nums sm:text-xl">{formatPrice(product.price)}</p>
          <div className="relative z-10 mt-3">
            {product.available ? (
              <Button size="sm" className="w-full" onClick={() => addToCart(product)} aria-label={`Agregar ${product.name} al carrito`}>
                <ShoppingCart className="size-4" aria-hidden />
                Agregar
              </Button>
            ) : (
              <ButtonLink to={to} state={state} size="sm" variant="outline" className="w-full">
                <Eye className="size-4" aria-hidden />
                Ver producto
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
