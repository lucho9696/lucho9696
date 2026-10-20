<?php

declare(strict_types=1);

namespace Bluepack\Http;

final class Router
{
    /** @var list<array{method: string, regex: string, handler: callable}> */
    private array $routes = [];

    public function get(string $pattern, callable $handler): void
    {
        $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable $handler): void
    {
        $this->add('POST', $pattern, $handler);
    }

    public function add(string $method, string $pattern, callable $handler): void
    {
        $regex = preg_replace('#\{([a-zA-Z_]+)\}#', '(?P<$1>[a-zA-Z0-9\-_]+)', Request::normalizePath($pattern));
        $this->routes[] = ['method' => $method, 'regex' => "#^{$regex}$#", 'handler' => $handler];
    }

    public function dispatch(Request $request): JsonResponse
    {
        $methodMismatch = false;

        foreach ($this->routes as $route) {
            if (!preg_match($route['regex'], $request->path, $matches)) {
                continue;
            }
            if ($route['method'] !== $request->method && !($route['method'] === 'GET' && $request->method === 'HEAD')) {
                $methodMismatch = true;
                continue;
            }

            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

            return ($route['handler'])($request, $params);
        }

        throw $methodMismatch
            ? new HttpException(405, 'Método no permitido.')
            : new HttpException(404, 'Recurso no encontrado.');
    }
}
