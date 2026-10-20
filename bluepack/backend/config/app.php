<?php

declare(strict_types=1);

use Bluepack\Support\Env;

/*
 * Configuración central del backend.
 * Todos los valores sensibles o dependientes del entorno se leen de variables
 * de entorno (ver .env.example). Nunca guardes credenciales en este archivo.
 */
return [
    'store' => [
        'name' => Env::get('STORE_NAME', 'Blue Pack'),
        'tagline' => 'Venta mayorista y minorista | Villa María, Córdoba',
        // Mientras sea true, la API informa que precios y datos son de demostración.
        'demoMode' => Env::bool('DEMO_MODE', true),
        'currency' => 'ARS',
    ],

    'whatsapp' => [
        // Número de WhatsApp de Blue Pack en formato internacional, sin "+", espacios ni guiones
        // (Argentina, celular: 54 + 9 + código de área sin 0 + número sin 15).
        // WhatsApp de ventas confirmado por el cliente: +54 9 3534 12-2227 → 5493534122227.
        // Los pedidos de la demo llevan precios ficticios: con demoMode el mensaje lo aclara antes del total.
        // Mientras quede el placeholder, la tienda muestra "configuración pendiente" y no abre enlaces.
        'number' => Env::get('WHATSAPP_NUMBER', 'WHATSAPP_NUMBER_HERE'),
    ],

    'catalog' => [
        // Fuente de datos del catálogo. Reemplazable por otra implementación de CatalogRepository.
        'path' => Env::get('CATALOG_PATH', dirname(__DIR__) . '/data/catalog.json'),
        'perPage' => 12,
        'maxPerPage' => 48,
    ],

    'orders' => [
        'maxLines' => 100,
        'maxQuantity' => 9999,
    ],

    'cors' => [
        // Orígenes permitidos separados por coma. Vacío = solo mismo origen (recomendado).
        'allowedOrigins' => Env::list('CORS_ALLOWED_ORIGINS'),
    ],
];
