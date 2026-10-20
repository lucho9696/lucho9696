import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useUi } from '@/context/UiContext'

export function CartButton() {
  const { totals } = useCart()
  const { openCart } = useUi()
  const count = totals.units

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative grid size-11 place-items-center rounded-xl text-navy-900 transition-colors hover:bg-brand-50 hover:text-brand-600"
      aria-label={count > 0 ? `Abrir carrito, ${count} ${count === 1 ? 'unidad' : 'unidades'}` : 'Abrir carrito, vacío'}
    >
      <ShoppingCart className="size-6" aria-hidden />
      {count > 0 && (
        <span
          key={count}
          className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 animate-fade-up place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white ring-2 ring-white tabular-nums"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
