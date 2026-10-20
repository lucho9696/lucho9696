import { Facebook, Instagram, Link2, type LucideIcon } from 'lucide-react'

/**
 * Contenido institucional y de navegación de Blue Pack.
 * Datos tomados de sus perfiles públicos (Instagram y Linktree). Productos y precios de la tienda siguen siendo de demostración.
 * El número de WhatsApp de los botones NO se configura acá: está centralizado en el backend (variable WHATSAPP_NUMBER).
 */
export const SITE = {
  name: 'Blue Pack',
  fullName: 'Blue Pack Descartables',
  tagline: 'Venta mayorista y minorista | Villa María, Córdoba',
  location: 'Villa María, Córdoba',
  defaultTitle: 'Blue Pack Descartables | Venta mayorista y minorista en Villa María',
  defaultDescription:
    'Blue Pack: descartables, envases, bolsas y packaging para tu negocio. Venta mayorista y minorista en Villa María, Córdoba. Armá tu pedido online y envialo por WhatsApp.',
  shortDescription: 'Venta mayorista y minorista de descartables en Villa María, Córdoba. Tenemos todo lo que tu negocio necesita.',
  demoNotice: 'Demo: productos, precios e imágenes ilustrativos.',
  /** Versión corta del aviso para la barra superior en pantallas chicas. */
  demoNoticeShort: 'Demo: productos y precios ilustrativos',
} as const

export const MAIN_NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/mayoristas', label: 'Mayoristas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
] as const

export interface SocialLink {
  label: string
  handle: string
  href: string
  icon: LucideIcon
}

/** Redes públicas de Blue Pack (enlazadas desde su Linktree). */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'Instagram', handle: '@bluepack.descartables', href: 'https://www.instagram.com/bluepack.descartables/', icon: Instagram },
  { label: 'Facebook', handle: 'bluepack.descartables', href: 'https://www.facebook.com/bluepack.descartables', icon: Facebook },
  { label: 'Linktree', handle: 'linktr.ee/bluepack.descartables', href: 'https://linktr.ee/bluepack.descartables', icon: Link2 },
]

export interface BusinessInfoItem {
  label: string
  value: string
}

/**
 * Líneas de WhatsApp publicadas en el Linktree de Blue Pack (área 353). Se muestran como texto:
 * los enlaces de WhatsApp de la tienda los arma el backend con WHATSAPP_NUMBER.
 */
export const CONTACT_PHONES = {
  sales: { label: 'Ventas (WhatsApp)', value: '353 412-2227' },
  queries: { label: 'Consultas (WhatsApp)', value: '353 566-9848' },
} as const satisfies Record<string, BusinessInfoItem>

/**
 * Datos comerciales públicos (bio de Instagram y Linktree).
 * Horarios, repartos, dirección exacta y medios de pago no son públicos: no completarlos sin confirmación de Blue Pack.
 */
export const BUSINESS_INFO: readonly BusinessInfoItem[] = [
  { label: 'Ubicación', value: 'Villa María, Córdoba' },
  { label: 'Ventas', value: 'Por mayor y por menor' },
  CONTACT_PHONES.sales,
  CONTACT_PHONES.queries,
  { label: 'Horarios y repartos', value: 'Consultalos por WhatsApp' },
]
