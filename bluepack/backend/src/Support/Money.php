<?php

declare(strict_types=1);

namespace Bluepack\Support;

final class Money
{
    /** Formato local argentino: 8500 → "$ 8.500". */
    public static function format(int $amount): string
    {
        return '$ ' . number_format($amount, 0, ',', '.');
    }
}
