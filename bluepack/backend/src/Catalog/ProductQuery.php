<?php

declare(strict_types=1);

namespace Bluepack\Catalog;

use Bluepack\Support\Text;

final readonly class ProductQuery
{
    public function __construct(
        public string $search = '',
        public ?string $category = null,
        public bool $featuredOnly = false,
        public bool $newOnly = false,
        public bool $availableOnly = false,
        public ?ProductSort $sort = null,
        public int $page = 1,
        public int $perPage = 12,
    ) {
    }

    /** @param array<string, mixed> $params */
    public static function fromArray(array $params, int $defaultPerPage, int $maxPerPage): self
    {
        $flag = static fn (string $key): bool => in_array((string) ($params[$key] ?? ''), ['1', 'true', 'yes'], true);
        $sort = is_string($params['sort'] ?? null) ? ProductSort::tryFrom($params['sort']) : null;
        $category = is_string($params['category'] ?? null) && $params['category'] !== '' ? $params['category'] : null;
        $perPage = (int) ($params['perPage'] ?? $defaultPerPage);

        return new self(
            Text::clean($params['q'] ?? '', 80),
            $category,
            $flag('featured'),
            $flag('new'),
            $flag('available'),
            $sort,
            max(1, (int) ($params['page'] ?? 1)),
            min(max(1, $perPage), $maxPerPage),
        );
    }

    public function effectiveSort(): ProductSort
    {
        if ($this->sort !== null && ($this->sort !== ProductSort::Relevance || $this->search !== '')) {
            return $this->sort;
        }

        return $this->search !== '' ? ProductSort::Relevance : ProductSort::Featured;
    }
}
