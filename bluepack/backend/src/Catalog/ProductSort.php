<?php

declare(strict_types=1);

namespace Bluepack\Catalog;

enum ProductSort: string
{
    case Featured = 'featured';
    case Relevance = 'relevance';
    case PriceAsc = 'price_asc';
    case PriceDesc = 'price_desc';
    case NameAsc = 'name_asc';
    case NameDesc = 'name_desc';
}
