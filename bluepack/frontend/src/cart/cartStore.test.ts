import { describe, expect, it } from 'vitest'
import type { Product } from '@/types/catalog'
import { MAX_QUANTITY, cartReducer, cartTotals, clampQuantity, parseStoredCart, type CartItem } from './cartStore'

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'p-001',
  sku: 'DEMO-1',
  slug: 'vasos-500',
  name: 'Vasos 500 ml',
  description: '',
  price: 8500,
  categoryId: 'vasos',
  category: null,
  presentation: 'Paquete x 50 unidades',
  saleUnit: { singular: 'paquete', plural: 'paquetes' },
  image: '/images/products/vaso-cristal-500.svg',
  gallery: [],
  featured: false,
  isNew: false,
  available: true,
  tags: [],
  ...overrides,
})

describe('clampQuantity', () => {
  it('acepta solo enteros entre 1 y el máximo', () => {
    expect(clampQuantity(3)).toBe(3)
    expect(clampQuantity(0)).toBe(1)
    expect(clampQuantity(-5)).toBe(1)
    expect(clampQuantity(2.9)).toBe(2)
    expect(clampQuantity(Number.NaN)).toBe(1)
    expect(clampQuantity(Number.POSITIVE_INFINITY)).toBe(1)
    expect(clampQuantity(MAX_QUANTITY + 10)).toBe(MAX_QUANTITY)
  })
})

describe('cartReducer', () => {
  it('agrega productos y suma cantidades sin duplicar líneas', () => {
    let state = cartReducer([], { type: 'add', product: product(), quantity: 2 })
    state = cartReducer(state, { type: 'add', product: product(), quantity: 3 })
    expect(state).toHaveLength(1)
    expect(state[0].quantity).toBe(5)
  })

  it('no agrega productos sin stock', () => {
    expect(cartReducer([], { type: 'add', product: product({ available: false }), quantity: 1 })).toEqual([])
  })

  it('modifica, valida y elimina cantidades', () => {
    let state = cartReducer([], { type: 'add', product: product(), quantity: 1 })
    state = cartReducer(state, { type: 'setQuantity', productId: 'p-001', quantity: 7 })
    expect(state[0].quantity).toBe(7)
    state = cartReducer(state, { type: 'setQuantity', productId: 'p-001', quantity: 0 })
    expect(state[0].quantity).toBe(1)
    state = cartReducer(state, { type: 'remove', productId: 'p-001' })
    expect(state).toEqual([])
  })

  it('vacía el carrito', () => {
    const state = cartReducer([], { type: 'add', product: product(), quantity: 1 })
    expect(cartReducer(state, { type: 'clear' })).toEqual([])
  })
})

describe('cartTotals', () => {
  it('calcula líneas, unidades y total', () => {
    let state: CartItem[] = []
    state = cartReducer(state, { type: 'add', product: product(), quantity: 2 })
    state = cartReducer(state, { type: 'add', product: product({ id: 'p-002', price: 12000 }), quantity: 3 })
    expect(cartTotals(state)).toEqual({ lines: 2, units: 5, total: 2 * 8500 + 3 * 12000 })
  })
})

describe('parseStoredCart', () => {
  it('descarta datos corruptos y normaliza cantidades', () => {
    const valid = cartReducer([], { type: 'add', product: product(), quantity: 2 })[0]
    const raw = JSON.stringify([{ ...valid, quantity: -3 }, { foo: 'bar' }, { ...valid }])
    expect(parseStoredCart(raw)).toEqual([{ ...valid, quantity: 1 }])
    expect(parseStoredCart('no es json')).toEqual([])
    expect(parseStoredCart(null)).toEqual([])
    expect(parseStoredCart('{"a":1}')).toEqual([])
  })
})
