import type { SaleUnit } from '@/types/catalog'

const numberFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

/** Formato de precio local: 8500 → "$ 8.500". */
export function formatPrice(amount: number): string {
  return `$ ${numberFormat.format(Math.round(amount))}`
}

export function formatUnits(quantity: number, unit: SaleUnit): string {
  return `${quantity} ${quantity === 1 ? unit.singular : unit.plural}`
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}
