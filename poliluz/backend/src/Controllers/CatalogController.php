<?php

declare(strict_types=1);

namespace Poliluz\Controllers;

use Poliluz\Catalog\CatalogRepository;
use Poliluz\Catalog\CatalogService;
use Poliluz\Catalog\ProductQuery;
use Poliluz\Http\HttpException;
use Poliluz\Http\JsonResponse;
use Poliluz\Http\Request;
use Poliluz\WhatsApp\ContactMessages;
use Poliluz\WhatsApp\WhatsAppLinkBuilder;

final class CatalogController
{
    private const CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=600';

    public function __construct(
        private readonly CatalogRepository $repository,
        private readonly CatalogService $catalog,
        private readonly WhatsAppLinkBuilder $whatsapp,
        private readonly ContactMessages $messages,
        private readonly int $perPage,
        private readonly int $maxPerPage,
    ) {
    }

    public function categories(): JsonResponse
    {
        return (new JsonResponse(['data' => $this->catalog->categoriesWithCounts()]))
            ->withHeader('Cache-Control', self::CACHE);
    }

    public function products(Request $request): JsonResponse
    {
        $query = ProductQuery::fromArray($request->query, $this->perPage, $this->maxPerPage);
        $result = $this->catalog->search($query);

        return (new JsonResponse([
            'data' => $this->catalog->presentMany($result['items']),
            'meta' => [
                'total' => $result['total'],
                'page' => $result['page'],
                'perPage' => $result['perPage'],
                'totalPages' => $result['totalPages'],
                'sort' => $query->effectiveSort()->value,
                'search' => $query->search,
                'category' => $result['category']?->toArray(),
            ],
        ]))->withHeader('Cache-Control', self::CACHE);
    }

    /** @param array<string, string> $params */
    public function product(Request $request, array $params): JsonResponse
    {
        $product = $this->repository->findProductBySlug($params['slug'] ?? '');
        if ($product === null) {
            throw new HttpException(404, 'El producto que buscás no existe o ya no está disponible.');
        }

        return (new JsonResponse([
            'data' => $this->catalog->present($product),
            'related' => $this->catalog->presentMany($this->catalog->related($product)),
            'inquiry' => $this->whatsapp->describe($this->messages->product($product)),
        ]))->withHeader('Cache-Control', self::CACHE);
    }
}
