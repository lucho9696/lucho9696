import { ArrowRight, ShoppingBag } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCart } from '@/context/CartContext'
import { useUi } from '@/context/UiContext'
import { formatPrice, pluralize } from '@/lib/format'
import { CartLineItem } from './CartLineItem'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUi()
  const { items, totals } = useCart()

  return (
    <Drawer
      open={cartOpen}
      onClose={closeCart}
      title="Tu carrito"
      headerExtra={
        totals.units > 0 && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{pluralize(totals.units, 'unidad', 'unidades')}</span>
        )
      }
      footer={
        items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted">Total estimado</span>
              <span className="text-xl font-extrabold text-navy-900 tabular-nums">{formatPrice(totals.total)}</span>
            </div>
            <p className="text-xs text-muted">Precios de demostración. Valores y disponibilidad se confirman con Blue Pack.</p>
            <ButtonLink to="/checkout" onClick={closeCart} className="w-full" size="lg">
              Iniciar pedido
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink to="/carrito" onClick={closeCart} variant="outline" className="w-full">
              Ver carrito completo
            </ButtonLink>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState icon={ShoppingBag} title="Tu carrito está vacío" description="Explorá el catálogo y agregá los productos que necesitás para tu negocio.">
            <ButtonLink to="/productos" onClick={closeCart}>
              Ver productos
            </ButtonLink>
          </EmptyState>
        </div>
      ) : (
        <ul className="divide-y divide-line px-5">
          {items.map((item) => (
            <li key={item.productId} className="py-4">
              <CartLineItem item={item} compact onNavigate={closeCart} />
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}
