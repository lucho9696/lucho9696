import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice, pluralize } from '@/lib/format'

/** Resumen de totales del carrito. */
export function OrderSummary({ children, title = 'Resumen del pedido' }: { children?: ReactNode; title?: string }) {
  const { totals } = useCart()

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-bold text-navy-900">{title}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Productos distintos</dt>
          <dd className="font-semibold text-navy-900 tabular-nums">{totals.lines}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Total de unidades</dt>
          <dd className="font-semibold text-navy-900 tabular-nums">{pluralize(totals.units, 'unidad', 'unidades')}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="font-semibold text-navy-900">Total estimado</dt>
          <dd className="text-2xl font-extrabold text-navy-900 tabular-nums">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 flex gap-2 rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted">
        <Info className="mt-px size-4 shrink-0 text-brand-500" aria-hidden />
        Precios de demostración. El total es estimativo: valores, disponibilidad y entrega se confirman con Blue Pack.
      </p>
      {children && <div className="mt-5 space-y-3">{children}</div>}
    </div>
  )
}
