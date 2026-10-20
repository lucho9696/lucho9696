export interface FaqItem {
  question: string
  answer: string
}

export interface FaqGroup {
  title: string
  items: FaqItem[]
}

/**
 * Preguntas frecuentes. Las respuestas distinguen lo que hace la demo de las condiciones
 * comerciales reales, que Blue Pack todavía debe definir.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Pedidos',
    items: [
      {
        question: '¿Cómo puedo realizar un pedido?',
        answer:
          'Agregá los productos al carrito, revisá las cantidades y completá tus datos en la página de confirmación. Al confirmar se abre WhatsApp con el detalle del pedido ya escrito, para que lo envíes a Blue Pack. El pedido se coordina por ese medio: la web no cobra ni registra pedidos.',
      },
      {
        question: '¿Puedo comprar por mayor?',
        answer:
          'Sí. Los comercios, gastronómicos y revendedores pueden escribir desde la sección Mayoristas. Las condiciones para compras por volumen se informan directamente por WhatsApp.',
      },
      {
        question: '¿Puedo solicitar productos que no aparecen en el catálogo?',
        answer:
          'Sí, podés consultarlo por WhatsApp o indicarlo en los comentarios del pedido. Blue Pack te informará si puede conseguirlo.',
      },
    ],
  },
  {
    title: 'Precios y disponibilidad',
    items: [
      {
        question: '¿Los precios publicados son definitivos?',
        answer:
          'No. En esta demostración los precios son ficticios y el total es estimativo. Los valores finales, la disponibilidad y las condiciones se confirman con Blue Pack al recibir tu mensaje.',
      },
      {
        question: '¿Cómo consulto la disponibilidad?',
        answer:
          'Cada producto indica si figura disponible en el catálogo, pero la disponibilidad real se confirma por WhatsApp. También podés usar el botón "Consultar por WhatsApp" desde la ficha del producto.',
      },
    ],
  },
  {
    title: 'Entregas y contacto',
    items: [
      {
        question: '¿Cómo se coordinan la entrega y el retiro?',
        answer:
          'Las modalidades de entrega o retiro todavía no están definidas para la tienda online. Por ahora se acuerdan directamente con Blue Pack por WhatsApp después de enviar el pedido.',
      },
      {
        question: '¿Cómo me comunico con Blue Pack?',
        answer:
          'Desde cualquier botón de WhatsApp del sitio. Los demás datos de contacto (dirección, horarios y redes) se publicarán cuando Blue Pack los confirme.',
      },
    ],
  },
]

export const FAQ_PREVIEW: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[0].items[1],
  FAQ_GROUPS[2].items[0],
]
