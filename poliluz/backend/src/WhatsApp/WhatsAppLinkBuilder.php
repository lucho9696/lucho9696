<?php

declare(strict_types=1);

namespace Poliluz\WhatsApp;

final class WhatsAppLinkBuilder
{
    public function __construct(private readonly string $number)
    {
    }

    /**
     * El número debe estar en formato internacional, solo dígitos y sin "+".
     * Un placeholder como WHATSAPP_NUMBER_HERE se considera "no configurado".
     */
    public function isConfigured(): bool
    {
        return preg_match('/^[1-9]\d{9,14}$/', $this->number) === 1;
    }

    public function number(): ?string
    {
        return $this->isConfigured() ? $this->number : null;
    }

    /** Devuelve el enlace oficial wa.me con el texto codificado, o null si falta configurar el número. */
    public function link(string $message): ?string
    {
        if (!$this->isConfigured()) {
            return null;
        }

        return 'https://wa.me/' . $this->number . '?text=' . rawurlencode($message);
    }

    /** @return array{configured: bool, url: ?string} */
    public function describe(string $message): array
    {
        return ['configured' => $this->isConfigured(), 'url' => $this->link($message)];
    }
}
