<?php

declare(strict_types=1);

namespace Poliluz\WhatsApp;

use Poliluz\Wholesale\WholesaleInquiry;

final class WholesaleMessageFormatter
{
    public function __construct(private readonly string $storeName)
    {
    }

    public function format(WholesaleInquiry $inquiry): string
    {
        $lines = [
            "Hola, {$this->storeName}. Quisiera recibir información para compras por mayor.",
            '',
            '*DATOS DE CONTACTO*',
            "Nombre: {$inquiry->name}",
        ];

        foreach ([
            'Comercio' => $inquiry->business,
            'Rubro' => $inquiry->businessTypeLabel(),
            'Localidad' => $inquiry->city,
            'Teléfono' => $inquiry->phone,
        ] as $label => $value) {
            if ($value !== null) {
                $lines[] = "{$label}: {$value}";
            }
        }

        if ($inquiry->categories !== []) {
            $lines[] = '';
            $lines[] = '*CATEGORÍAS DE INTERÉS*';
            foreach ($inquiry->categories as $category) {
                $lines[] = "• {$category->name}";
            }
        }

        if ($inquiry->details !== null) {
            $lines[] = '';
            $lines[] = '*PRODUCTOS Y CANTIDADES ESTIMADAS*';
            $lines[] = $inquiry->details;
        }

        $lines[] = '';
        $lines[] = 'Quedo a la espera de información sobre precios mayoristas y condiciones comerciales.';

        return implode("\n", $lines);
    }
}
