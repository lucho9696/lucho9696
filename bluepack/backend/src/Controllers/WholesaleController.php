<?php

declare(strict_types=1);

namespace Bluepack\Controllers;

use Bluepack\Catalog\CatalogRepository;
use Bluepack\Http\JsonResponse;
use Bluepack\Http\Request;
use Bluepack\WhatsApp\WhatsAppLinkBuilder;
use Bluepack\WhatsApp\WholesaleMessageFormatter;
use Bluepack\Wholesale\WholesaleInquiry;

final class WholesaleController
{
    public function __construct(
        private readonly CatalogRepository $catalog,
        private readonly WholesaleMessageFormatter $formatter,
        private readonly WhatsAppLinkBuilder $whatsapp,
    ) {
    }

    public function whatsapp(Request $request): JsonResponse
    {
        $inquiry = WholesaleInquiry::fromPayload($request->json(), $this->catalog);
        $message = $this->formatter->format($inquiry);

        return (new JsonResponse([
            'message' => $message,
            'whatsapp' => $this->whatsapp->describe($message),
        ]))->withHeader('Cache-Control', 'no-store');
    }
}
