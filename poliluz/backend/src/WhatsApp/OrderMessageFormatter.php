<?php

declare(strict_types=1);

namespace Poliluz\WhatsApp;

use Poliluz\Orders\Order;
use Poliluz\Support\Money;

final class OrderMessageFormatter
{
    public function __construct(private readonly string $storeName)
    {
    }

    public function format(Order $order): string
    {
        $customer = $order->customer;
        $lines = [
            "Hola, {$this->storeName}. Quiero realizar el siguiente pedido:",
            '',
            '*DATOS DEL CLIENTE*',
            "Nombre: {$customer->name}",
        ];

        if ($customer->business !== null) {
            $lines[] = "Comercio: {$customer->business}";
        }
        $lines[] = "Teléfono: {$customer->phone}";
        if ($customer->city !== null) {
            $lines[] = "Localidad: {$customer->city}";
        }

        $lines[] = '';
        $lines[] = '*DETALLE DEL PEDIDO*';

        foreach ($order->lines as $line) {
            $product = $line->product;
            $lines[] = '';
            $lines[] = "• {$product->name} ({$product->presentation})";
            $lines[] = "Cantidad: {$line->quantity} {$product->unitLabel($line->quantity)}";
            $lines[] = 'Precio unitario: ' . Money::format($product->price);
            $lines[] = 'Subtotal: ' . Money::format($line->subtotal());
        }

        $lines[] = '';
        $lines[] = '*TOTAL ESTIMADO: ' . Money::format($order->total()) . '*';

        if ($customer->comments !== null) {
            $lines[] = '';
            $lines[] = "Comentarios: {$customer->comments}";
        }

        $lines[] = '';
        $lines[] = 'Quedo a la espera de la confirmación del pedido y de las condiciones de entrega.';

        return implode("\n", $lines);
    }
}
