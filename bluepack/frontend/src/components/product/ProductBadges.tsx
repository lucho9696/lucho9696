import { Sparkles, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types/catalog'

export function ProductBadges({ product, className = '' }: { product: Product; className?: string }) {
  if (!product.featured && !product.isNew && product.available) return null
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {!product.available && <Badge tone="neutral">Sin stock</Badge>}
      {product.featured && (
        <Badge tone="brand">
          <Star className="size-3 fill-current" aria-hidden />
          Destacado
        </Badge>
      )}
      {product.isNew && (
        <Badge tone="accent">
          <Sparkles className="size-3" aria-hidden />
          Nuevo
        </Badge>
      )}
    </div>
  )
}
