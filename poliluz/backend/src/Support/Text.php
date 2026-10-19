<?php

declare(strict_types=1);

namespace Poliluz\Support;

final class Text
{
    private const ACCENTS = [
        'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a',
        'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
        'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
        'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o',
        'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
        'ñ' => 'n', 'ç' => 'c', 'º' => '', '°' => '',
    ];

    /** Minúsculas, sin acentos y con espacios colapsados: base para búsquedas. */
    public static function normalize(string $value): string
    {
        $value = strtr(mb_strtolower($value, 'UTF-8'), self::ACCENTS);
        $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?? '';

        return trim($value);
    }

    /**
     * Limpia texto ingresado por usuarios: quita caracteres de control,
     * recorta espacios y limita la longitud.
     */
    public static function clean(mixed $value, int $maxLength, bool $multiline = false): string
    {
        if (!is_scalar($value)) {
            return '';
        }

        $value = (string) $value;
        if (!mb_check_encoding($value, 'UTF-8')) {
            $value = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
        }

        $value = str_replace(["\r\n", "\r"], "\n", $value);
        $pattern = $multiline ? '/[\x00-\x09\x0B-\x1F\x7F]/u' : '/[\x00-\x1F\x7F]/u';
        $value = preg_replace($pattern, $multiline ? '' : ' ', $value) ?? '';

        if ($multiline) {
            $value = preg_replace("/\n{3,}/", "\n\n", $value) ?? '';
            $value = implode("\n", array_map(static fn (string $line): string => trim(preg_replace('/[ \t]+/', ' ', $line) ?? ''), explode("\n", $value)));
        } else {
            $value = preg_replace('/\s+/u', ' ', $value) ?? '';
        }

        return mb_substr(trim($value), 0, $maxLength);
    }
}
