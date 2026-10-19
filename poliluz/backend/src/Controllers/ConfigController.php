<?php

declare(strict_types=1);

namespace Poliluz\Controllers;

use Poliluz\Http\JsonResponse;
use Poliluz\WhatsApp\ContactMessages;
use Poliluz\WhatsApp\WhatsAppLinkBuilder;
use Poliluz\Wholesale\WholesaleInquiry;

final class ConfigController
{
    /** @param array<string, mixed> $store */
    public function __construct(
        private readonly array $store,
        private readonly WhatsAppLinkBuilder $whatsapp,
        private readonly ContactMessages $messages,
    ) {
    }

    public function show(): JsonResponse
    {
        return (new JsonResponse([
            'store' => $this->store,
            'whatsapp' => [
                'configured' => $this->whatsapp->isConfigured(),
                'links' => [
                    'general' => $this->whatsapp->link($this->messages->general()),
                    'wholesale' => $this->whatsapp->link($this->messages->wholesale()),
                ],
            ],
            'wholesale' => [
                'businessTypes' => array_map(
                    static fn (string $value, string $label): array => ['value' => $value, 'label' => $label],
                    array_keys(WholesaleInquiry::BUSINESS_TYPES),
                    WholesaleInquiry::BUSINESS_TYPES,
                ),
            ],
        ]))->withHeader('Cache-Control', 'public, max-age=60');
    }
}
