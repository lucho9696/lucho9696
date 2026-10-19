<?php

declare(strict_types=1);

/*
 * Pruebas del backend sin dependencias externas.
 * Uso: php tests/run.php
 */

use Poliluz\App;
use Poliluz\Catalog\CatalogService;
use Poliluz\Catalog\JsonCatalogRepository;
use Poliluz\Catalog\ProductQuery;
use Poliluz\Http\Request;
use Poliluz\Orders\OrderFactory;
use Poliluz\Support\Money;
use Poliluz\Support\Text;
use Poliluz\Validation\ValidationException;
use Poliluz\WhatsApp\OrderMessageFormatter;
use Poliluz\WhatsApp\WhatsAppLinkBuilder;

putenv('WHATSAPP_NUMBER=WHATSAPP_NUMBER_HERE');
require dirname(__DIR__) . '/src/bootstrap.php';

$catalogPath = dirname(__DIR__) . '/data/catalog.json';
$tests = [];
$test = static function (string $name, callable $fn) use (&$tests): void {
    $tests[$name] = $fn;
};
$assert = static function (bool $condition, string $message = 'La aserción falló'): void {
    if (!$condition) {
        throw new RuntimeException($message);
    }
};
$equals = static function (mixed $expected, mixed $actual, string $label = '') use ($assert): void {
    $assert($expected === $actual, trim("{$label} Esperado: " . var_export($expected, true) . ' / Obtenido: ' . var_export($actual, true)));
};

$appWith = static function (string $number) use ($catalogPath): App {
    $config = require dirname(__DIR__) . '/config/app.php';
    $config['whatsapp']['number'] = $number;
    $config['catalog']['path'] = $catalogPath;

    return new App($config);
};
$call = static function (App $app, string $method, string $path, array $query = [], ?array $body = null): array {
    $response = $app->handle(new Request($method, $path, $query, $body === null ? '' : (string) json_encode($body)));

    return [$response->status, json_decode($response->body(), true)];
};
$validOrder = [
    'customer' => ['name' => 'Juan Pérez', 'phone' => '351 123-4567', 'business' => 'Almacén Ejemplo', 'city' => 'Villa María', 'comments' => 'Necesito consultar disponibilidad.'],
    'items' => [['productId' => 'p-001', 'quantity' => 2], ['productId' => 'p-008', 'quantity' => 3]],
];

// ---------- Utilidades ----------
$test('Money formatea pesos argentinos', function () use ($equals) {
    $equals('$ 8.500', Money::format(8500));
    $equals('$ 1.234.567', Money::format(1234567));
});

$test('Text normaliza acentos y limpia texto de usuarios', function () use ($equals) {
    $equals('cafe con leche', Text::normalize('  Café  CON leche!! '));
    $equals('hola mundo', Text::clean("hola\x00 \t mundo", 50));
    $equals("línea 1\n\nlínea 2", Text::clean("línea 1\r\n\r\n\r\nlínea 2", 50, true));
    $equals('abc', Text::clean('abcdef', 3));
});

// ---------- Catálogo ----------
$test('El catálogo de demo tiene al menos 16 productos válidos', function () use ($catalogPath, $assert) {
    $repo = new JsonCatalogRepository($catalogPath);
    $assert(count($repo->products()) >= 16, 'Faltan productos');
    $assert(count($repo->categories()) === 8, 'Deben existir 8 categorías');
    $slugs = array_map(fn ($p) => $p->slug, $repo->products());
    $assert(count($slugs) === count(array_unique($slugs)), 'Hay slugs repetidos');
    $publicDir = dirname(__DIR__, 2) . '/frontend/public';
    foreach ($repo->products() as $product) {
        $assert($product->price > 0, "Precio inválido en {$product->id}");
        // Las imágenes viven en el frontend; se verifican cuando el repo completo está disponible.
        foreach (is_dir($publicDir) ? $product->gallery : [] as $image) {
            $assert(is_file($publicDir . $image), "Falta la imagen {$image}");
        }
    }
});

$test('Búsqueda sin acentos, plurales y por categoría', function () use ($catalogPath, $equals, $assert) {
    $service = new CatalogService(new JsonCatalogRepository($catalogPath));
    $result = $service->search(new ProductQuery(search: 'vasos'));
    $equals(3, $result['total'], 'vasos:');
    $result = $service->search(new ProductQuery(search: 'TERMICO cafe'));
    $equals('p-003', $result['items'][0]->id ?? null, 'térmico café:');
    $result = $service->search(new ProductQuery(category: 'envases-para-alimentos'));
    $equals(4, $result['total'], 'categoría envases:');
    $result = $service->search(new ProductQuery(search: 'zzzz inexistente'));
    $equals(0, $result['total'], 'sin resultados:');
    $assert($service->search(new ProductQuery(featuredOnly: true))['total'] > 0, 'Debe haber destacados');
});

$test('Orden por precio, nombre y paginación', function () use ($catalogPath, $equals) {
    $service = new CatalogService(new JsonCatalogRepository($catalogPath));
    $prices = array_map(fn ($p) => $p->price, $service->search(new ProductQuery(sort: \Poliluz\Catalog\ProductSort::PriceAsc, perPage: 48))['items']);
    $sorted = $prices;
    sort($sorted);
    $equals($sorted, $prices, 'precio asc:');
    $names = array_map(fn ($p) => Text::normalize($p->name), $service->search(new ProductQuery(sort: \Poliluz\Catalog\ProductSort::NameDesc, perPage: 48))['items']);
    $sortedNames = $names;
    rsort($sortedNames, SORT_STRING);
    $equals($sortedNames, $names, 'nombre desc:');
    $page2 = $service->search(new ProductQuery(page: 2, perPage: 10));
    $equals(2, $page2['page']);
    $equals(10, count($page2['items']));
    $equals($page2['totalPages'], $service->search(new ProductQuery(page: 99, perPage: 10))['page'], 'página fuera de rango:');
});

// ---------- Pedidos ----------
$test('El pedido recalcula precios con el catálogo y agrupa líneas', function () use ($catalogPath, $equals) {
    $factory = new OrderFactory(new JsonCatalogRepository($catalogPath), 100, 9999);
    $order = $factory->fromPayload([
        'customer' => ['name' => 'Ana', 'phone' => '3531234567'],
        'items' => [['productId' => 'p-001', 'quantity' => 2, 'price' => 1], ['productId' => 'p-001', 'quantity' => 1]],
    ]);
    $equals(1, count($order->lines));
    $equals(3, $order->lines[0]->quantity);
    $equals(8500 * 3, $order->total());
});

$test('El pedido rechaza datos inválidos', function () use ($catalogPath, $assert) {
    $factory = new OrderFactory(new JsonCatalogRepository($catalogPath), 100, 9999);
    $cases = [
        ['customer' => ['name' => '', 'phone' => ''], 'items' => [['productId' => 'p-001', 'quantity' => 1]]],
        ['customer' => ['name' => 'Ana', 'phone' => 'abc'], 'items' => [['productId' => 'p-001', 'quantity' => 1]]],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => []],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => [['productId' => 'p-001', 'quantity' => 0]]],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => [['productId' => 'p-001', 'quantity' => -2]]],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => [['productId' => 'p-001', 'quantity' => 'dos']]],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => [['productId' => 'nope', 'quantity' => 1]]],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => [['productId' => 'p-023', 'quantity' => 1]]],
        ['customer' => ['name' => 'Ana', 'phone' => '3531234567'], 'items' => [['productId' => 'p-001', 'quantity' => 10000]]],
    ];
    foreach ($cases as $index => $payload) {
        try {
            $factory->fromPayload($payload);
            $assert(false, "El caso {$index} debió fallar");
        } catch (ValidationException) {
        }
    }
});

$test('El mensaje de WhatsApp incluye cliente, productos, precios y total', function () use ($catalogPath, $validOrder, $assert) {
    $factory = new OrderFactory(new JsonCatalogRepository($catalogPath), 100, 9999);
    $message = (new OrderMessageFormatter('Poliluz'))->format($factory->fromPayload($validOrder));
    foreach ([
        'Hola, Poliluz. Quiero realizar el siguiente pedido:',
        'Nombre: Juan Pérez', 'Comercio: Almacén Ejemplo', 'Teléfono: 3511234567', 'Localidad: Villa María',
        'Vasos plásticos transparentes 500 ml', 'Cantidad: 2 paquetes', 'Precio unitario: $ 8.500', 'Subtotal: $ 17.000',
        'Envases rectangulares para viandas 750 ml', 'Cantidad: 3 packs', 'Precio unitario: $ 12.000', 'Subtotal: $ 36.000',
        'TOTAL ESTIMADO: $ 53.000', 'Comentarios: Necesito consultar disponibilidad.',
        'Quedo a la espera de la confirmación del pedido y de las condiciones de entrega.',
    ] as $fragment) {
        $assert(str_contains($message, $fragment), "Falta en el mensaje: {$fragment}");
    }
});

$test('Enlace wa.me: codificación correcta y número sin configurar', function () use ($equals, $assert) {
    $configured = new WhatsAppLinkBuilder('5493531234567');
    $url = $configured->link("Hola & chau\n¿Precio? #1");
    $equals('https://wa.me/5493531234567?text=Hola%20%26%20chau%0A%C2%BFPrecio%3F%20%231', $url);
    foreach (['WHATSAPP_NUMBER_HERE', '', '+5493531234567', '549 353 123', '0353123456', '12345'] as $invalid) {
        $builder = new WhatsAppLinkBuilder($invalid);
        $assert(!$builder->isConfigured(), "{$invalid} no debería considerarse configurado");
        $assert($builder->link('hola') === null, 'No debe generar enlaces inválidos');
    }
});

// ---------- HTTP ----------
$test('API: catálogo, detalle, 404 y 405', function () use ($appWith, $call, $equals, $assert) {
    $app = $appWith('WHATSAPP_NUMBER_HERE');
    [$status, $body] = $call($app, 'GET', '/api/products', ['category' => 'bolsas', 'sort' => 'price_asc']);
    $equals(200, $status);
    $equals(3, $body['meta']['total']);
    $assert($body['data'][0]['price'] <= $body['data'][1]['price'], 'Orden por precio');
    [$status, $body] = $call($app, 'GET', '/api/products/vasos-de-polipapel-300-ml');
    $equals(200, $status);
    $equals('Vasos descartables', $body['data']['category']['name']);
    $assert(count($body['related']) > 0, 'Debe haber relacionados');
    $equals(['configured' => false, 'url' => null], $body['inquiry']);
    [$status] = $call($app, 'GET', '/api/products/no-existe');
    $equals(404, $status);
    [$status] = $call($app, 'DELETE', '/api/products');
    $equals(405, $status);
    [$status] = $call($app, 'GET', '/api/inexistente');
    $equals(404, $status);
});

$test('API: checkout sin número configurado no devuelve enlace', function () use ($appWith, $call, $validOrder, $equals, $assert) {
    [$status, $body] = $call($appWith('WHATSAPP_NUMBER_HERE'), 'POST', '/api/orders/whatsapp', [], $validOrder);
    $equals(200, $status);
    $equals(false, $body['whatsapp']['configured']);
    $equals(null, $body['whatsapp']['url']);
    $equals(53000, $body['order']['total']);
    [, $config] = $call($appWith('WHATSAPP_NUMBER_HERE'), 'GET', '/api/config');
    $equals(null, $config['whatsapp']['links']['general']);
    $assert($config['store']['demoMode'] === true, 'La demo debe informarse');
});

$test('API: checkout con número configurado devuelve enlace con el mensaje', function () use ($appWith, $call, $validOrder, $equals, $assert) {
    [$status, $body] = $call($appWith('5493531234567'), 'POST', '/api/orders/whatsapp', [], $validOrder);
    $equals(200, $status);
    $assert(str_starts_with($body['whatsapp']['url'], 'https://wa.me/5493531234567?text='), 'Enlace wa.me');
    $equals($body['message'], rawurldecode(substr($body['whatsapp']['url'], strlen('https://wa.me/5493531234567?text='))));
});

$test('API: errores de validación devuelven 422 con campos', function () use ($appWith, $call, $equals, $assert) {
    [$status, $body] = $call($appWith('5493531234567'), 'POST', '/api/orders/whatsapp', [], ['customer' => ['name' => 'A'], 'items' => []]);
    $equals(422, $status);
    $assert(isset($body['fields']['name'], $body['fields']['phone'], $body['fields']['items']), 'Deben informarse los campos');
    $response = $appWith('5493531234567')->handle(new Request('POST', '/api/orders/whatsapp', [], '{no json'));
    $equals(400, $response->status);
});

$test('API: consulta mayorista', function () use ($appWith, $call, $equals, $assert) {
    [$status, $body] = $call($appWith('5493531234567'), 'POST', '/api/wholesale/whatsapp', [], [
        'name' => 'Ana', 'business' => 'Rotisería Demo', 'businessType' => 'gastronomia', 'categories' => ['envases', 'inexistente'], 'details' => 'Envases 750 ml: 20 packs',
    ]);
    $equals(200, $status);
    $assert(str_contains($body['message'], '• Envases para alimentos'), 'Categoría en el mensaje');
    $assert(!str_contains($body['message'], 'inexistente'), 'Ignora categorías inválidas');
    [$status] = $call($appWith('5493531234567'), 'POST', '/api/wholesale/whatsapp', [], ['name' => 'Ana']);
    $equals(422, $status);
});

$failures = 0;
foreach ($tests as $name => $fn) {
    try {
        $fn();
        echo "  ✓ {$name}\n";
    } catch (Throwable $e) {
        $failures++;
        echo "  ✗ {$name}\n    {$e->getMessage()}\n";
    }
}
echo "\n" . (count($tests) - $failures) . '/' . count($tests) . " pruebas OK\n";
exit($failures > 0 ? 1 : 0);
