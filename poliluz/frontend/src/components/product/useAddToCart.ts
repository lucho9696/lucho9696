import { useCallback } from 'react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useUi } from '@/context/UiContext'
import { formatUnits } from '@/lib/format'
import type { Product } from '@/types/catalog'

/** Agrega al carrito y muestra una notificación discreta con acceso al carrito. */
export function useAddToCart() {
  const { addItem } = useCart()
  const notify = useToast()
  const { openCart } = useUi()

  return useCallback(
    (product: Product, quantity = 1) => {
      if (!product.available) return
      addItem(product, quantity)
      notify({
        title: 'Agregado al carrito',
        description: `${formatUnits(quantity, product.saleUnit)} · ${product.name}`,
        image: product.image,
        action: { label: 'Ver carrito', onClick: openCart },
      })
    },
    [addItem, notify, openCart],
  )
}
