import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MAX_QUANTITY, clampQuantity } from '@/cart/cartStore'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/** Selector de cantidad con botones y edición manual. Solo acepta enteros entre 1 y MAX_QUANTITY. */
export function QuantityStepper({ value, onChange, label, size = 'md', className = '' }: QuantityStepperProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => setDraft(String(value)), [value])

  const commit = () => {
    const parsed = Number.parseInt(draft, 10)
    const next = Number.isNaN(parsed) ? value : clampQuantity(parsed)
    setDraft(String(next))
    if (next !== value) onChange(next)
  }

  const height = size === 'sm' ? 'h-9' : 'h-11'
  const button = `grid ${size === 'sm' ? 'w-9' : 'w-11'} place-items-center text-navy-900 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:text-slate-300`

  return (
    <div className={`inline-flex ${height} items-stretch overflow-hidden rounded-xl border border-line bg-white ${className}`}>
      <button type="button" className={button} onClick={() => onChange(clampQuantity(value - 1))} disabled={value <= 1} aria-label={`Restar una unidad de ${label}`}>
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, '').slice(0, String(MAX_QUANTITY).length))}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            commit()
          }
        }}
        aria-label={`Cantidad de ${label}`}
        className={`${size === 'sm' ? 'w-10 text-sm' : 'w-12'} border-x border-line text-center font-semibold text-navy-900 tabular-nums outline-none focus:bg-brand-50/50`}
      />
      <button type="button" className={button} onClick={() => onChange(clampQuantity(value + 1))} disabled={value >= MAX_QUANTITY} aria-label={`Sumar una unidad de ${label}`}>
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}
