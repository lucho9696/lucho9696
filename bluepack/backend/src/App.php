<?php

declare(strict_types=1);

namespace Bluepack;

use Bluepack\Catalog\CatalogRepository;
use Bluepack\Catalog\CatalogService;
use Bluepack\Catalog\JsonCatalogRepository;
use Bluepack\Controllers\CatalogController;
use Bluepack\Controllers\ConfigController;
use Bluepack\Controllers\OrderController;
use Bluepack\Controllers\WholesaleController;
use Bluepack\Http\HttpException;
use Bluepack\Http\JsonResponse;
use Bluepack\Http\Request;
use Bluepack\Http\Router;
use Bluepack\Orders\OrderFactory;
use Bluepack\Validation\ValidationException;
use Bluepack\WhatsApp\ContactMessages;
use Bluepack\WhatsApp\OrderMessageFormatter;
use Bluepack\WhatsApp\WhatsAppLinkBuilder;
use Bluepack\WhatsApp\WholesaleMessageFormatter;
use Throwable;

/** Composición de dependencias y ciclo de vida de una solicitud HTTP. */
final class App
{
    private ?CatalogRepository $repository = null;

    /** @param array<string, mixed> $config */
    public function __construct(private readonly array $config)
    {
    }

    public function handle(Request $request): JsonResponse
    {
        $cors = $this->corsHeaders($request);

        if ($request->method === 'OPTIONS') {
            return $this->withHeaders(new JsonResponse(null, 204), $cors);
        }

        try {
            $response = $this->router()->dispatch($request);
        } catch (ValidationException $e) {
            $response = new JsonResponse(['error' => $e->getMessage(), 'fields' => $e->errors], 422);
        } catch (HttpException $e) {
            $response = new JsonResponse(['error' => $e->getMessage()], $e->status);
        } catch (Throwable $e) {
            error_log('[bluepack] ' . $e::class . ': ' . $e->getMessage());
            $response = new JsonResponse(['error' => 'Ocurrió un error inesperado. Intentá nuevamente.'], 500);
        }

        return $this->withHeaders($response, $cors);
    }

    public function repository(): CatalogRepository
    {
        return $this->repository ??= new JsonCatalogRepository($this->config['catalog']['path']);
    }

    public function whatsapp(): WhatsAppLinkBuilder
    {
        return new WhatsAppLinkBuilder((string) $this->config['whatsapp']['number']);
    }

    private function router(): Router
    {
        $storeName = (string) $this->config['store']['name'];
        $catalog = new CatalogService($this->repository());
        $messages = new ContactMessages($storeName);
        $router = new Router();

        $router->get('/api/health', static fn (): JsonResponse => new JsonResponse(['status' => 'ok']));

        $router->get('/api/config', fn (): JsonResponse => (new ConfigController($this->config['store'], $this->whatsapp(), $messages))->show());

        $catalogController = fn (): CatalogController => new CatalogController(
            $this->repository(),
            $catalog,
            $this->whatsapp(),
            $messages,
            (int) $this->config['catalog']['perPage'],
            (int) $this->config['catalog']['maxPerPage'],
        );
        $router->get('/api/categories', fn (): JsonResponse => $catalogController()->categories());
        $router->get('/api/products', fn (Request $r): JsonResponse => $catalogController()->products($r));
        $router->get('/api/products/{slug}', fn (Request $r, array $p): JsonResponse => $catalogController()->product($r, $p));

        $router->post('/api/orders/whatsapp', fn (Request $r): JsonResponse => (new OrderController(
            new OrderFactory($this->repository(), (int) $this->config['orders']['maxLines'], (int) $this->config['orders']['maxQuantity']),
            new OrderMessageFormatter($storeName),
            $this->whatsapp(),
        ))->whatsapp($r));

        $router->post('/api/wholesale/whatsapp', fn (Request $r): JsonResponse => (new WholesaleController(
            $this->repository(),
            new WholesaleMessageFormatter($storeName),
            $this->whatsapp(),
        ))->whatsapp($r));

        return $router;
    }

    /** @return array<string, string> */
    private function corsHeaders(Request $request): array
    {
        $origin = $request->header('origin');
        $allowed = $this->config['cors']['allowedOrigins'];

        if ($origin === null || !in_array($origin, $allowed, true)) {
            return [];
        }

        return [
            'Access-Control-Allow-Origin' => $origin,
            'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type',
            'Vary' => 'Origin',
        ];
    }

    /** @param array<string, string> $headers */
    private function withHeaders(JsonResponse $response, array $headers): JsonResponse
    {
        foreach ($headers as $name => $value) {
            $response = $response->withHeader($name, $value);
        }

        return $response;
    }
}
