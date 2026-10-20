import { Boxes, MessageCircleMore, PackageCheck, ShoppingBag, Store, type LucideIcon } from 'lucide-react'

export interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

/** Propuestas de valor de Blue Pack, basadas en su comunicación pública (no son promesas verificadas). */
export const BENEFITS: Benefit[] = [
  {
    icon: ShoppingBag,
    title: 'Por mayor y por menor',
    description: 'Comprás en cantidad para tu negocio o solo lo que necesitás.',
  },
  {
    icon: Boxes,
    title: 'Todo lo que tu negocio necesita',
    description: 'Vasos, servilletas, bolsas, cajas, envases y más en un mismo lugar.',
  },
  {
    icon: Store,
    title: 'Stock para comercios y gastronomía',
    description: '¿Ya stockeaste tu negocio? Armá tu pedido desde el catálogo.',
  },
  {
    icon: MessageCircleMore,
    title: 'Atención por WhatsApp',
    description: 'Consultás y confirmás tu pedido hablando directo con Blue Pack.',
  },
  {
    icon: PackageCheck,
    title: 'Consultas por volumen',
    description: 'Contanos qué necesitás y te pasamos las condiciones mayoristas.',
  },
]
