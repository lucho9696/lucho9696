import { CONTACT_PHONES } from './site'

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqGroup {
  title: string
  items: FaqItem[]
}

/**
 * Preguntas frecuentes (en primera persona del plural, como habla Blue Pack). Las respuestas distinguen lo que hace
 * la tienda demo de las condiciones comerciales reales, que se confirman por WhatsApp (horarios, repartos y precios no son públicos).
 * Al pasar a datos reales, reescribir las respuestas que mencionan la demostración.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Pedidos',
    items: [
      {
        question: '¿Cómo puedo realizar un pedido?',
        answer:
          'Agregá los productos al carrito, revisá las cantidades y completá tus datos en la página de confirmación. Al confirmar se abre WhatsApp con el detalle del pedido ya escrito, para que nos lo envíes. El pedido se coordina por ese medio: la web no cobra ni registra pedidos.',
      },
      {
        question: '¿Venden por mayor y por menor?',
        answer:
          'Sí, vendemos por mayor y por menor: podés stockear tu negocio o llevar solo lo que necesitás. Si comprás por volumen, escribinos desde la sección Mayoristas y te pasamos las condiciones por WhatsApp.',
      },
      {
        question: '¿Puedo pedir productos que no aparecen en el catálogo?',
        answer:
          'Sí. Consultalo por WhatsApp o indicalo en los comentarios del pedido y te confirmamos si lo tenemos o podemos conseguirlo.',
      },
    ],
  },
  {
    title: 'Precios y disponibilidad',
    items: [
      {
        question: '¿Los precios publicados son definitivos?',
        answer:
          'No. En esta tienda de demostración los productos y precios son ficticios y el total es estimativo. Los precios reales, la disponibilidad y las condiciones te los confirmamos cuando recibimos tu mensaje.',
      },
      {
        question: '¿Cómo consulto la disponibilidad?',
        answer:
          'Cada producto indica si figura disponible en el catálogo de la demo, pero el stock real se confirma por WhatsApp. También podés usar el botón "Consultar por WhatsApp" desde la ficha del producto.',
      },
    ],
  },
  {
    title: 'Horarios, repartos y contacto',
    items: [
      {
        question: '¿Dónde están y cuáles son los horarios?',
        answer:
          'Estamos en Villa María, Córdoba. Los horarios de atención los informamos por WhatsApp: escribinos y te los pasamos.',
      },
      {
        question: '¿Hacen repartos?',
        answer:
          'Consultalo por WhatsApp. Las zonas y los días de reparto los informamos por ese medio, y ahí coordinamos la entrega de cada pedido.',
      },
      {
        question: '¿Cómo me comunico con Blue Pack?',
        answer: `Desde cualquier botón de WhatsApp del sitio. También podés escribirnos al WhatsApp de ventas (${CONTACT_PHONES.sales.value}) o al de consultas (${CONTACT_PHONES.queries.value}). Además, nos encontrás en Instagram y Facebook como @bluepack.descartables.`,
      },
    ],
  },
]

export const FAQ_PREVIEW: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[0].items[1],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[2].items[1],
]
