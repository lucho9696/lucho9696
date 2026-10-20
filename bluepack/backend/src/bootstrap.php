<?php

declare(strict_types=1);

use Bluepack\App;
use Bluepack\Support\Env;

spl_autoload_register(static function (string $class): void {
    $prefix = 'Bluepack\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $file = __DIR__ . '/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

Env::load(dirname(__DIR__) . '/.env');

return new App(require dirname(__DIR__) . '/config/app.php');
