import type { Product, SaleUnit } from '@/types/catalog'

export const MAX_QUANTITY = 9999
export const CART_STORAGE_KEY = 'bluepack:cart:v1'

/** Línea del carrito. Guarda una copia de los datos visibles del producto; el precio final lo recalcula el servidor. */
export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  presentation: string
  saleUnit: SaleUnit
  quantity: number
}

export type CartAction =
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] }

/** Cantidades válidas: enteros entre 1 y MAX_QUANTITY. */
export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(value)))
}

export function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    presentation: product.presentation,
    saleUnit: product.saleUnit,
    quantity: clampQuantity(quantity),
  }
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      if (!action.product.available) return state
      const existing = state.find((item) => item.productId === action.product.id)
      if (existing) {
        return state.map((item) =>
          item.productId === action.product.id
            ? { ...toCartItem(action.product, item.quantity + clampQuantity(action.quantity)) }
            : item,
        )
      }
      return [...state, toCartItem(action.product, action.quantity)]
    }
    case 'setQuantity':
      return state.map((item) =>
        item.productId === action.productId ? { ...item, quantity: clampQuantity(action.quantity) } : item,
      )
    case 'remove':
      return state.filter((item) => item.productId !== action.productId)
    case 'clear':
      return []
    case 'hydrate':
      return action.items
  }
}

export function cartTotals(items: CartItem[]) {
  return items.reduce(
    (totals, item) => ({
      lines: totals.lines + 1,
      units: totals.units + item.quantity,
      total: totals.total + item.price * item.quantity,
    }),
    { lines: 0, units: 0, total: 0 },
  )
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  const unit = item.saleUnit as Record<string, unknown> | undefined
  return (
    typeof item.productId === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.image === 'string' &&
    typeof item.presentation === 'string' &&
    typeof unit?.singular === 'string' &&
    typeof unit?.plural === 'string' &&
    typeof item.quantity === 'number'
  )
}

/** Lee el carrito guardado descartando datos corruptos o con formato viejo. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    return parsed.filter(isCartItem).flatMap((item) => {
      if (seen.has(item.productId)) return []
      seen.add(item.productId)
      return [{ ...item, quantity: clampQuantity(item.quantity) }]
    })
  } catch {
    return []
  }
}
