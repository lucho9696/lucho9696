<?php

declare(strict_types=1);

use Poliluz\Support\Env;

/*
 * Configuración central del backend.
 * Todos los valores sensibles o dependientes del entorno se leen de variables
 * de entorno (ver .env.example). Nunca guardes credenciales en este archivo.
 */
return [
    'store' => [
        'name' => Env::get('STORE_NAME', 'Poliluz'),
        'tagline' => 'Distribuidora de descartables | Soluciones para tu negocio',
        // Mientras sea true, la API informa que precios y datos son de demostración.
        'demoMode' => Env::bool('DEMO_MODE', true),
        'currency' => 'ARS',
    ],

    'whatsapp' => [
        // Número de WhatsApp de Poliluz en formato internacional, sin "+", espacios ni guiones.
        // Ejemplo para Argentina (código país 54 + 9 + área sin 0 + número sin 15): 5493531234567
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
