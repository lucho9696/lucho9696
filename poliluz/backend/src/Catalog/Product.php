<?php

declare(strict_types=1);

namespace Poliluz\Catalog;

final readonly class Product
{
    /**
     * @param list<string> $gallery
     * @param list<string> $tags
     */
    public function __construct(
        public string $id,
        public string $sku,
        public string $slug,
        public string $name,
        public string $description,
        public int $price,
        public string $categoryId,
        public string $presentation,
        public string $unitSingular,
        public string $unitPlural,
        public string $image,
        public array $gallery,
        public bool $featured,
        public bool $isNew,
        public bool $available,
        public array $tags,
    ) {
    }

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        $unit = is_array($data['saleUnit'] ?? null) ? $data['saleUnit'] : [];
        $image = (string) ($data['image'] ?? '');
        $gallery = array_values(array_filter(array_map('strval', (array) ($data['gallery'] ?? []))));

        return new self(
            (string) $data['id'],
            (string) ($data['sku'] ?? ''),
            (string) $data['slug'],
            (string) $data['name'],
            (string) ($data['description'] ?? ''),
            (int) $data['price'],
            (string) $data['categoryId'],
            (string) ($data['presentation'] ?? ''),
            (string) ($unit['singular'] ?? 'unidad'),
            (string) ($unit['plural'] ?? 'unidades'),
            $image,
            $gallery !== [] ? $gallery : [$image],
            (bool) ($data['featured'] ?? false),
            (bool) ($data['isNew'] ?? false),
            (bool) ($data['available'] ?? true),
            array_values(array_map('strval', (array) ($data['tags'] ?? []))),
        );
    }

    public function unitLabel(int $quantity): string
    {
        return $quantity === 1 ? $this->unitSingular : $this->unitPlural;
    }

    /** @return array<string, mixed> */
    public function toArray(?Category $category = null): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'categoryId' => $this->categoryId,
            'category' => $category ? ['id' => $category->id, 'slug' => $category->slug, 'name' => $category->name] : null,
            'presentation' => $this->presentation,
            'saleUnit' => ['singular' => $this->unitSingular, 'plural' => $this->unitPlural],
            'image' => $this->image,
            'gallery' => $this->gallery,
            'featured' => $this->featured,
            'isNew' => $this->isNew,
            'available' => $this->available,
            'tags' => $this->tags,
        ];
    }
}
