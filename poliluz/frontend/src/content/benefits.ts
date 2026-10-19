import { Boxes, MessageCircleMore, ShoppingBasket, Store, Truck, type LucideIcon } from 'lucide-react'

export interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

/** Propuestas de valor genéricas (no son promesas verificadas). */
export const BENEFITS: Benefit[] = [
  {
    icon: Boxes,
    title: 'Variedad de productos',
    description: 'Vasos, envases, bolsas, papel y packaging en un mismo catálogo.',
  },
  {
    icon: Store,
    title: 'Soluciones para tu negocio',
    description: 'Pensado para comercios, gastronomía, eventos y hogares.',
  },
  {
    icon: ShoppingBasket,
    title: 'Compra simple y organizada',
    description: 'Buscá, filtrá y armá tu pedido en pocos pasos.',
  },
  {
    icon: MessageCircleMore,
    title: 'Atención personalizada',
    description: 'Confirmás el pedido conversando directamente con Poliluz.',
  },
  {
    icon: Truck,
    title: 'Consultas mayoristas',
    description: 'Canal directo para compras por volumen y reventa.',
  },
]
