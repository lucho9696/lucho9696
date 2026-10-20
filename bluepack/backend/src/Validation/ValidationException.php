<?php

declare(strict_types=1);

namespace Bluepack\Validation;

use RuntimeException;

final class ValidationException extends RuntimeException
{
    /** @param array<string, string> $errors campo => mensaje */
    public function __construct(public readonly array $errors, string $message = 'Revisá los datos ingresados.')
    {
        parent::__construct($message);
    }
}
