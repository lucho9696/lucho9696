<?php

declare(strict_types=1);

namespace Poliluz\Wholesale;

use Poliluz\Catalog\CatalogRepository;
use Poliluz\Catalog\Category;
use Poliluz\Validation\Validator;

/**
 * Consulta mayorista. Flujo independiente del carrito: no lleva precios,
 * solo el interés del comercio para que Poliluz responda con sus condiciones.
 */
final readonly class WholesaleInquiry
{
    public const BUSINESS_TYPES = [
        'almacen' => 'Almacén / despensa',
        'gastronomia' => 'Gastronomía (restaurante, bar, rotisería)',
        'reventa' => 'Revendedor / distribuidor',
        'eventos' => 'Eventos y catering',
        'institucion' => 'Institución / empresa',
        'otro' => 'Otro rubro',
    ];

    /** @param list<Category> $categories */
    public function __construct(
        public string $name,
        public ?string $business,
        public ?string $businessType,
        public ?string $city,
        public ?string $phone,
        public array $categories,
        public ?string $details,
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     * @throws \Poliluz\Validation\ValidationException
     */
    public static function fromPayload(array $payload, CatalogRepository $catalog): self
    {
        $validator = new Validator($payload);
        $name = $validator->requiredText('name', 'tu nombre', 2, 80);
        $business = $validator->optionalText('business', 80);
        $city = $validator->optionalText('city', 80);
        $phone = $validator->phone('phone', false);
        $details = $validator->optionalText('details', 1000, true);

        $type = is_string($payload['businessType'] ?? null) ? $payload['businessType'] : '';
        if ($type !== '' && !isset(self::BUSINESS_TYPES[$type])) {
            $validator->addError('businessType', 'Elegí un rubro de la lista.');
        }

        $categories = [];
        foreach (array_slice((array) ($payload['categories'] ?? []), 0, 20) as $id) {
            $category = is_string($id) ? $catalog->findCategoryById($id) : null;
            if ($category !== null) {
                $categories[$category->id] = $category;
            }
        }

        if ($details === null && $categories === []) {
            $validator->addError('details', 'Contanos qué productos te interesan o elegí al menos una categoría.');
        }

        $validator->validate();

        return new self($name, $business, $type !== '' ? $type : null, $city, $phone, array_values($categories), $details);
    }

    public function businessTypeLabel(): ?string
    {
        return $this->businessType !== null ? self::BUSINESS_TYPES[$this->businessType] : null;
    }
}
