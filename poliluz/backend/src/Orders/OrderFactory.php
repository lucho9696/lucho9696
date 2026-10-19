<?php

declare(strict_types=1);

namespace Poliluz\Orders;

use Poliluz\Catalog\CatalogRepository;
use Poliluz\Validation\Validator;

final class OrderFactory
{
    public function __construct(
        private readonly CatalogRepository $catalog,
        private readonly int $maxLines,
        private readonly int $maxQuantity,
    ) {
    }

    /**
     * @param array<string, mixed> $payload {customer: {...}, items: [{productId, quantity}]}
     * @throws \Poliluz\Validation\ValidationException
     */
    public function fromPayload(array $payload): Order
    {
        $validator = new Validator(is_array($payload['customer'] ?? null) ? $payload['customer'] : []);
        $customer = Customer::fromValidator($validator);
        $lines = $this->lines($payload['items'] ?? null, $validator);

        $validator->validate();

        return new Order($customer, $lines);
    }

    /** @return list<OrderLine> */
    private function lines(mixed $items, Validator $validator): array
    {
        if (!is_array($items) || $items === []) {
            $validator->addError('items', 'Tu carrito está vacío.');

            return [];
        }
        if (count($items) > $this->maxLines) {
            $validator->addError('items', "El pedido no puede tener más de {$this->maxLines} productos distintos.");

            return [];
        }

        // Agrupa líneas repetidas del mismo producto sumando cantidades.
        $quantities = [];
        foreach ($items as $item) {
            $id = is_array($item) && is_string($item['productId'] ?? null) ? $item['productId'] : '';
            $quantity = is_array($item) ? filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT) : false;

            if ($id === '' || $quantity === false || $quantity < 1) {
                $validator->addError('items', 'Hay productos con cantidades inválidas en el carrito.');

                return [];
            }
            $quantities[$id] = ($quantities[$id] ?? 0) + $quantity;
        }

        $lines = [];
        foreach ($quantities as $id => $quantity) {
            $product = $this->catalog->findProductById((string) $id);

            if ($product === null) {
                $validator->addError('items', 'Uno de los productos del carrito ya no está disponible en el catálogo.');

                return [];
            }
            if (!$product->available) {
                $validator->addError('items', "\"{$product->name}\" no está disponible por el momento.");

                return [];
            }
            if ($quantity > $this->maxQuantity) {
                $validator->addError('items', "La cantidad máxima por producto es {$this->maxQuantity}.");

                return [];
            }

            $lines[] = new OrderLine($product, $quantity);
        }

        return $lines;
    }
}
