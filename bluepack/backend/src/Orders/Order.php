<?php

declare(strict_types=1);

namespace Bluepack\Orders;

/**
 * Pedido armado a partir del carrito. Los precios siempre se toman del catálogo
 * del servidor, nunca del navegador. Hoy se envía por WhatsApp; a futuro puede
 * persistirse o pasar por una pasarela de pago sin cambiar esta estructura.
 */
final readonly class Order
{
    /** @param list<OrderLine> $lines */
    public function __construct(
        public Customer $customer,
        public array $lines,
    ) {
    }

    public function total(): int
    {
        return array_sum(array_map(static fn (OrderLine $line): int => $line->subtotal(), $this->lines));
    }

    public function totalUnits(): int
    {
        return array_sum(array_map(static fn (OrderLine $line): int => $line->quantity, $this->lines));
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'customer' => [
                'name' => $this->customer->name,
                'business' => $this->customer->business,
                'phone' => $this->customer->phone,
                'city' => $this->customer->city,
                'comments' => $this->customer->comments,
            ],
            'lines' => array_map(static fn (OrderLine $line): array => $line->toArray(), $this->lines),
            'totalUnits' => $this->totalUnits(),
            'total' => $this->total(),
        ];
    }
}
