<?php

declare(strict_types=1);

namespace Bluepack\Http;

final class JsonResponse
{
    /** @param array<string, string> $headers */
    public function __construct(
        public readonly mixed $data,
        public readonly int $status = 200,
        private array $headers = [],
    ) {
    }

    public function withHeader(string $name, string $value): self
    {
        $clone = clone $this;
        $clone->headers[$name] = $value;

        return $clone;
    }

    /** @return array<string, string> */
    public function headers(): array
    {
        return $this->headers;
    }

    public function body(): string
    {
        return (string) json_encode(
            $this->data,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRESERVE_ZERO_FRACTION | JSON_INVALID_UTF8_SUBSTITUTE,
        );
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        echo $this->status === 204 ? '' : $this->body();
    }
}
