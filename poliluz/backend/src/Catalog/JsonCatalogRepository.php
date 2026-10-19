<?php

declare(strict_types=1);

namespace Poliluz\Catalog;

use RuntimeException;

final class JsonCatalogRepository implements CatalogRepository
{
    /** @var array<string, Category> */
    private array $categories = [];

    /** @var array<string, Product> */
    private array $products = [];

    private bool $loaded = false;

    public function __construct(private readonly string $path)
    {
    }

    public function categories(): array
    {
        $this->load();

        return array_values($this->categories);
    }

    public function products(): array
    {
        $this->load();

        return array_values($this->products);
    }

    public function findProductById(string $id): ?Product
    {
        $this->load();

        return $this->products[$id] ?? null;
    }

    public function findProductBySlug(string $slug): ?Product
    {
        foreach ($this->products() as $product) {
            if ($product->slug === $slug) {
                return $product;
            }
        }

        return null;
    }

    public function findCategoryById(string $id): ?Category
    {
        $this->load();

        return $this->categories[$id] ?? null;
    }

    public function findCategoryBySlug(string $slug): ?Category
    {
        foreach ($this->categories() as $category) {
            if ($category->slug === $slug || $category->id === $slug) {
                return $category;
            }
        }

        return null;
    }

    private function load(): void
    {
        if ($this->loaded) {
            return;
        }

        $raw = is_readable($this->path) ? file_get_contents($this->path) : false;
        $data = $raw === false ? null : json_decode($raw, true);

        if (!is_array($data) || !is_array($data['categories'] ?? null) || !is_array($data['products'] ?? null)) {
            throw new RuntimeException("No se pudo leer el catálogo en {$this->path}.");
        }

        foreach ($data['categories'] as $item) {
            $category = Category::fromArray($item);
            $this->categories[$category->id] = $category;
        }

        foreach ($data['products'] as $item) {
            $product = Product::fromArray($item);
            if (!isset($this->categories[$product->categoryId])) {
                throw new RuntimeException("El producto {$product->id} usa una categoría inexistente.");
            }
            $this->products[$product->id] = $product;
        }

        $this->loaded = true;
    }
}
