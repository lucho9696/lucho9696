<?php

declare(strict_types=1);

namespace Bluepack\Controllers;

use Bluepack\Http\JsonResponse;
use Bluepack\Http\Request;
use Bluepack\Orders\OrderFactory;
use Bluepack\WhatsApp\OrderMessageFormatter;
use Bluepack\WhatsApp\WhatsAppLinkBuilder;

/**
 * Checkout por WhatsApp: valida el pedido, recalcula precios con el catálogo
 * y devuelve el mensaje listo para enviar. No registra ni almacena pedidos.
 */
final class OrderController
{
    public function __construct(
        private readonly OrderFactory $orders,
        private readonly OrderMessageFormatter $formatter,
        private readonly WhatsAppLinkBuilder $whatsapp,
    ) {
    }

    public function whatsapp(Request $request): JsonResponse
    {
        $order = $this->orders->fromPayload($request->json());
        $message = $this->formatter->format($order);

        return (new JsonResponse([
            'order' => $order->toArray(),
            'message' => $message,
            'whatsapp' => $this->whatsapp->describe($message),
        ]))->withHeader('Cache-Control', 'no-store');
    }
}
