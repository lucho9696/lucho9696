import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import {
  CART_STORAGE_KEY,
  cartReducer,
  cartTotals,
  parseStoredCart,
  type CartItem,
} from '@/cart/cartStore'
import { readStorage, writeStorage } from '@/lib/storage'
import type { Product } from '@/types/catalog'

interface CartContextValue {
  items: CartItem[]
  totals: ReturnType<typeof cartTotals>
  addItem: (product: Product, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  quantityOf: (productId: string) => number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, () => parseStoredCart(readStorage(CART_STORAGE_KEY)))
  const skipNextWrite = useRef(false)

  // Persistencia en localStorage.
  useEffect(() => {
    if (skipNextWrite.current) {
      skipNextWrite.current = false
      return
    }
    writeStorage(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Sincroniza el carrito entre pestañas abiertas.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return
      skipNextWrite.current = true
      dispatch({ type: 'hydrate', items: parseStoredCart(event.newValue) })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((product: Product, quantity = 1) => dispatch({ type: 'add', product, quantity }), [])
  const setQuantity = useCallback(
    (productId: string, quantity: number) => dispatch({ type: 'setQuantity', productId, quantity }),
    [],
  )
  const removeItem = useCallback((productId: string) => dispatch({ type: 'remove', productId }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals: cartTotals(items),
      addItem,
      setQuantity,
      removeItem,
      clear,
      quantityOf: (productId) => items.find((item) => item.productId === productId)?.quantity ?? 0,
    }),
    [items, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return context
}
