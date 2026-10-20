<?php

declare(strict_types=1);

namespace Bluepack\WhatsApp;

use Bluepack\Orders\Order;
use Bluepack\Support\Money;

final class OrderMessageFormatter
{
    /** Aviso que acompaña al total mientras el catálogo sea de demostración (DEMO_MODE). */
    public const DEMO_NOTICE = '_Pedido armado en la tienda de demostración: productos y precios de referencia, a confirmar._';

    public function __construct(private readonly string $storeName, private readonly bool $demoMode = false)
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
        if ($this->demoMode) {
            $lines[] = self::DEMO_NOTICE;
        }
        $lines[] = '*TOTAL ESTIMADO: ' . Money::format($order->total()) . '*';

        if ($customer->comments !== null) {
            $lines[] = '';
            $lines[] = "Comentarios: {$customer->comments}";
        }

        $lines[] = '';
        $lines[] = '¿Me confirman disponibilidad, precio final y cómo coordinamos la entrega? ¡Gracias!';

        return implode("\n", $lines);
    }
}
