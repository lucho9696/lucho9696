<?php

declare(strict_types=1);

namespace Bluepack\Orders;

use Bluepack\Catalog\Product;

final readonly class OrderLine
{
    public function __construct(
        public Product $product,
        public int $quantity,
    ) {
    }

    public function subtotal(): int
    {
        return $this->product->price * $this->quantity;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'productId' => $this->product->id,
            'slug' => $this->product->slug,
            'name' => $this->product->name,
            'presentation' => $this->product->presentation,
            'quantity' => $this->quantity,
            'unitLabel' => $this->product->unitLabel($this->quantity),
            'unitPrice' => $this->product->price,
            'subtotal' => $this->subtotal(),
        ];
    }
}
