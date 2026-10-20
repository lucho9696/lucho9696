<?php

declare(strict_types=1);

namespace Bluepack\Http;

final class Request
{
    private const MAX_BODY_BYTES = 65536;

    /**
     * @param array<string, mixed> $query
     * @param array<string, string> $headers
     */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $query = [],
        private readonly string $rawBody = '',
        private readonly array $headers = [],
    ) {
    }

    public static function fromGlobals(): self
    {
        $query = $_GET;

        // En Vercel la ruta original llega como ?__path=... (ver vercel.json).
        if (isset($query['__path']) && is_string($query['__path'])) {
            $path = '/api/' . ltrim($query['__path'], '/');
            unset($query['__path']);
        } else {
            $path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        }

        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with((string) $key, 'HTTP_')) {
                $headers[strtolower(str_replace('_', '-', substr((string) $key, 5)))] = (string) $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = (string) $_SERVER['CONTENT_TYPE'];
        }

        $rawBody = (string) file_get_contents('php://input', false, null, 0, self::MAX_BODY_BYTES + 1);

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            self::normalizePath($path),
            $query,
            $rawBody,
            $headers,
        );
    }

    public static function normalizePath(string $path): string
    {
        $path = '/' . trim($path, '/');

        return preg_replace('#/+#', '/', $path) ?? '/';
    }

    public function header(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    /** @return array<string, mixed> */
    public function json(): array
    {
        if (strlen($this->rawBody) > self::MAX_BODY_BYTES) {
            throw new HttpException(413, 'El contenido enviado es demasiado grande.');
        }
        if (trim($this->rawBody) === '') {
            return [];
        }

        $data = json_decode($this->rawBody, true);
        if (!is_array($data)) {
            throw new HttpException(400, 'El cuerpo de la solicitud debe ser un JSON válido.');
        }

        return $data;
    }
}
