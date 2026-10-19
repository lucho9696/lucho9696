<?php

declare(strict_types=1);

namespace Poliluz\WhatsApp;

use Poliluz\Catalog\Product;

/** Mensajes predefinidos para los accesos directos a WhatsApp de la tienda. */
final class ContactMessages
{
    public function __construct(private readonly string $storeName)
    {
    }

    public function general(): string
    {
        return "Hola, {$this->storeName}. Quisiera hacer una consulta.";
    }

    public function wholesale(): string
    {
        return "Hola, {$this->storeName}. Tengo un comercio y quisiera consultar precios y condiciones para compras por mayor.";
    }

    public function product(Product $product): string
    {
        return "Hola, {$this->storeName}. Quisiera consultar por el producto \"{$product->name}\" ({$product->presentation}).";
    }
}
