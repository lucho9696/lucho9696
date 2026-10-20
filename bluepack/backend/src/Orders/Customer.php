<?php

declare(strict_types=1);

namespace Bluepack\Orders;

use Bluepack\Validation\Validator;

final readonly class Customer
{
    public function __construct(
        public string $name,
        public string $phone,
        public ?string $business = null,
        public ?string $city = null,
        public ?string $comments = null,
    ) {
    }

    /** Valida y limpia los datos del comprador. Los errores se acumulan en el Validator. */
    public static function fromValidator(Validator $validator): self
    {
        return new self(
            $validator->requiredText('name', 'tu nombre', 2, 80),
            (string) $validator->phone('phone'),
            $validator->optionalText('business', 80),
            $validator->optionalText('city', 80),
            $validator->optionalText('comments', 500, true),
        );
    }
}
