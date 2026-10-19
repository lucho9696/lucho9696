import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CartItem } from '@/cart/cartStore'
import { ProductImage } from '@/components/product/ProductImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/format'

export function CartLineItem({ item, compact = false, onNavigate }: { item: CartItem; compact?: boolean; onNavigate?: () => void }) {
  const { setQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-3 sm:gap-4">
      <Link to={`/producto/${item.slug}`} onClick={onNavigate} className={`product-stage shrink-0 overflow-hidden rounded-xl border border-line ${compact ? 'size-20' : 'size-24 sm:size-28'}`}>
        <ProductImage src={item.image} alt={item.name} className="size-full p-2" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/producto/${item.slug}`} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold text-navy-900 hover:text-brand-600 sm:text-[15px]">
              {item.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted sm:text-sm">{item.presentation}</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="-mt-1 -mr-1 shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Eliminar ${item.name} del carrito`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <QuantityStepper value={item.quantity} onChange={(quantity) => setQuantity(item.productId, quantity)} label={item.name} size="sm" />
          <div className="text-right">
            <p className="text-xs text-muted tabular-nums">{formatPrice(item.price)} c/u</p>
            <p className="font-bold text-navy-900 tabular-nums">{formatPrice(item.price * item.quantity)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
