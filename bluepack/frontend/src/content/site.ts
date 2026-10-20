/**
 * Contenido institucional y de navegación.
 * Textos provisionales para la demo: reemplazar con los datos reales que confirme Blue Pack.
 * El número de WhatsApp NO se configura acá: está centralizado en el backend (variable WHATSAPP_NUMBER).
 */
export const SITE = {
  name: 'Blue Pack',
  tagline: 'Distribuidora de descartables | Soluciones para tu negocio',
  defaultTitle: 'Blue Pack | Distribuidora de descartables y packaging',
  defaultDescription:
    'Descartables, envases, bolsas y packaging gastronómico para comercios, gastronomía y hogares. Armá tu pedido online y envialo por WhatsApp.',
  shortDescription:
    'Distribuidora de descartables, envases y packaging para comercios, gastronomía y consumidores.',
  demoNotice: 'Demo: productos, precios e imágenes ilustrativos.',
} as const

export const MAIN_NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/mayoristas', label: 'Mayoristas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
] as const

/** Datos comerciales de ejemplo: claramente marcados como pendientes de confirmar. */
export const BUSINESS_INFO_PLACEHOLDER = [
  { label: 'Dirección', value: 'A confirmar por Blue Pack' },
  { label: 'Horarios de atención', value: 'A confirmar por Blue Pack' },
  { label: 'Zona de entrega', value: 'A confirmar por Blue Pack' },
] as const
