<?php

declare(strict_types=1);

namespace Poliluz\Catalog;

use Poliluz\Support\Text;

final class CatalogService
{
    public function __construct(private readonly CatalogRepository $repository)
    {
    }

    /** @return list<array<string, mixed>> */
    public function categoriesWithCounts(): array
    {
        $counts = [];
        foreach ($this->repository->products() as $product) {
            $counts[$product->categoryId] = ($counts[$product->categoryId] ?? 0) + 1;
        }

        return array_map(
            static fn (Category $category): array => $category->toArray() + ['productCount' => $counts[$category->id] ?? 0],
            $this->repository->categories(),
        );
    }

    /**
     * Filtra, ordena y pagina el catálogo.
     *
     * @return array{items: list<Product>, total: int, page: int, perPage: int, totalPages: int, category: ?Category}
     */
    public function search(ProductQuery $query): array
    {
        $category = $query->category !== null ? $this->repository->findCategoryBySlug($query->category) : null;
        $terms = $this->terms($query->search);
        $scored = [];

        foreach ($this->repository->products() as $product) {
            if ($query->category !== null && $product->categoryId !== $category?->id) {
                continue;
            }
            if (($query->featuredOnly && !$product->featured)
                || ($query->newOnly && !$product->isNew)
                || ($query->availableOnly && !$product->available)) {
                continue;
            }

            $score = $terms === [] ? 0 : $this->score($product, $terms);
            if ($score === null) {
                continue;
            }
            $scored[] = ['product' => $product, 'score' => $score];
        }

        usort($scored, $this->comparator($query->effectiveSort()));

        $total = count($scored);
        $totalPages = max(1, (int) ceil($total / $query->perPage));
        $page = min($query->page, $totalPages);
        $items = array_slice(array_column($scored, 'product'), ($page - 1) * $query->perPage, $query->perPage);

        return [
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perPage' => $query->perPage,
            'totalPages' => $totalPages,
            'category' => $category,
        ];
    }

    /**
     * Productos relacionados: primero de la misma categoría, luego destacados de otras.
     *
     * @return list<Product>
     */
    public function related(Product $product, int $limit = 4): array
    {
        $sameCategory = [];
        $others = [];

        foreach ($this->repository->products() as $candidate) {
            if ($candidate->id === $product->id) {
                continue;
            }
            if ($candidate->categoryId === $product->categoryId) {
                $sameCategory[] = $candidate;
            } elseif ($candidate->featured) {
                $others[] = $candidate;
            }
        }

        return array_slice([...$sameCategory, ...$others], 0, $limit);
    }

    /** @return array<string, mixed> */
    public function present(Product $product): array
    {
        return $product->toArray($this->repository->findCategoryById($product->categoryId));
    }

    /**
     * @param list<Product> $products
     * @return list<array<string, mixed>>
     */
    public function presentMany(array $products): array
    {
        return array_map(fn (Product $product): array => $this->present($product), $products);
    }

    /** @return list<string> */
    private function terms(string $search): array
    {
        $normalized = Text::normalize($search);

        return $normalized === '' ? [] : array_values(array_unique(explode(' ', $normalized)));
    }

    /**
     * Puntaje de relevancia. Todos los términos deben aparecer en algún campo;
     * si alguno no aparece, el producto se descarta (null).
     *
     * @param list<string> $terms
     */
    private function score(Product $product, array $terms): ?int
    {
        $category = $this->repository->findCategoryById($product->categoryId);
        $fields = [
            [Text::normalize($product->name), 6],
            [Text::normalize(implode(' ', $product->tags)), 3],
            [Text::normalize($category?->name ?? ''), 2],
            [Text::normalize($product->description . ' ' . $product->presentation . ' ' . $product->sku), 1],
        ];

        $total = 0;
        foreach ($terms as $term) {
            $variants = [$term];
            if (strlen($term) > 3 && str_ends_with($term, 's')) {
                $variants[] = substr($term, 0, -1);
                if (str_ends_with($term, 'es')) {
                    $variants[] = substr($term, 0, -2);
                }
            }

            $best = 0;
            foreach ($fields as [$haystack, $weight]) {
                foreach ($variants as $variant) {
                    if ($variant !== '' && str_contains($haystack, $variant)) {
                        $best = max($best, $weight);
                    }
                }
            }

            if ($best === 0) {
                return null;
            }
            $total += $best;
        }

        return $total;
    }

    /** @return callable(array{product: Product, score: int}, array{product: Product, score: int}): int */
    private function comparator(ProductSort $sort): callable
    {
        $byName = static fn (Product $a, Product $b): int => strcmp(Text::normalize($a->name), Text::normalize($b->name));

        return match ($sort) {
            ProductSort::PriceAsc => static fn (array $a, array $b): int => [$a['product']->price, $byName($a['product'], $b['product'])] <=> [$b['product']->price, 0],
            ProductSort::PriceDesc => static fn (array $a, array $b): int => [$b['product']->price, $byName($a['product'], $b['product'])] <=> [$a['product']->price, 0],
            ProductSort::NameAsc => static fn (array $a, array $b): int => $byName($a['product'], $b['product']),
            ProductSort::NameDesc => static fn (array $a, array $b): int => $byName($b['product'], $a['product']),
            ProductSort::Relevance => static fn (array $a, array $b): int => [$b['score'], (int) $b['product']->available, $byName($a['product'], $b['product'])] <=> [$a['score'], (int) $a['product']->available, 0],
            ProductSort::Featured => static fn (array $a, array $b): int => [(int) $b['product']->featured, (int) $b['product']->available, $byName($a['product'], $b['product'])] <=> [(int) $a['product']->featured, (int) $a['product']->available, 0],
        };
    }
}
