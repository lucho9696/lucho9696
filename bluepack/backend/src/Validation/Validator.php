<?php

declare(strict_types=1);

namespace Bluepack\Validation;

use Bluepack\Support\Text;

/**
 * Validaciones centralizadas para los datos que ingresan los compradores.
 * Acumula errores por campo y devuelve los valores ya limpios.
 */
final class Validator
{
    /** @var array<string, string> */
    private array $errors = [];

    /** @param array<string, mixed> $data */
    public function __construct(private readonly array $data)
    {
    }

    public function requiredText(string $field, string $label, int $min, int $max): string
    {
        $value = Text::clean($this->data[$field] ?? '', $max + 1);

        if ($value === '') {
            $this->errors[$field] = "Ingresá {$label}.";
        } elseif (mb_strlen($value) < $min) {
            $this->errors[$field] = ucfirst($label) . " debe tener al menos {$min} caracteres.";
        } elseif (mb_strlen($value) > $max) {
            $this->errors[$field] = ucfirst($label) . " no puede superar los {$max} caracteres.";
        }

        return mb_substr($value, 0, $max);
    }

    public function optionalText(string $field, int $max, bool $multiline = false): ?string
    {
        $value = Text::clean($this->data[$field] ?? '', $max + 1, $multiline);

        if (mb_strlen($value) > $max) {
            $this->errors[$field] = "El texto no puede superar los {$max} caracteres.";
        }

        return $value === '' ? null : mb_substr($value, 0, $max);
    }

    /**
     * Teléfono de contacto: se aceptan espacios, guiones, paréntesis y "+",
     * pero se guardan solo los dígitos (entre 8 y 15).
     */
    public function phone(string $field, bool $required = true): ?string
    {
        $raw = Text::clean($this->data[$field] ?? '', 40);
        $digits = preg_replace('/\D+/', '', $raw) ?? '';

        if ($raw === '') {
            if ($required) {
                $this->errors[$field] = 'Ingresá un teléfono de contacto.';
            }

            return null;
        }

        if (preg_match('/^[\d\s\-\(\)\.\+]+$/', $raw) !== 1 || strlen($digits) < 8 || strlen($digits) > 15) {
            $this->errors[$field] = 'Ingresá un teléfono válido, con código de área (solo números).';

            return null;
        }

        return $digits;
    }

    public function addError(string $field, string $message): void
    {
        $this->errors[$field] = $message;
    }

    public function fails(): bool
    {
        return $this->errors !== [];
    }

    /** @return array<string, string> */
    public function errors(): array
    {
        return $this->errors;
    }

    public function validate(): void
    {
        if ($this->fails()) {
            throw new ValidationException($this->errors);
        }
    }
}
