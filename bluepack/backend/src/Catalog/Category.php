<?php

declare(strict_types=1);

namespace Bluepack\Catalog;

final readonly class Category
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $name,
        public string $description,
        public string $image,
        public string $tone,
    ) {
    }

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        return new self(
            (string) $data['id'],
            (string) $data['slug'],
            (string) $data['name'],
            (string) ($data['description'] ?? ''),
            (string) ($data['image'] ?? ''),
            (string) ($data['tone'] ?? 'blue'),
        );
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image,
            'tone' => $this->tone,
        ];
    }
}
