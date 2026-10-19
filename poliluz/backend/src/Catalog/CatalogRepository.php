<?php

declare(strict_types=1);

namespace Poliluz\Catalog;

/**
 * Fuente de datos del catálogo. Hoy se implementa con un JSON local de demostración;
 * para pasar a productos reales alcanza con otra implementación (MySQL, API externa, etc.).
 */
interface CatalogRepository
{
    /** @return list<Category> */
    public function categories(): array;

    /** @return list<Product> */
    public function products(): array;

    public function findProductById(string $id): ?Product;

    public function findProductBySlug(string $slug): ?Product;

    public function findCategoryById(string $id): ?Category;

    public function findCategoryBySlug(string $slug): ?Category;
}
