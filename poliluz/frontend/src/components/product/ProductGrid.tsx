import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types/catalog'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  products,
  loading = false,
  skeletons = 8,
  className = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}: {
  products: Product[] | undefined
  loading?: boolean
  skeletons?: number
  className?: string
}) {
  const showSkeletons = loading && !products?.length
  return (
    <div className={`grid gap-3 sm:gap-5 ${className} ${loading && products?.length ? 'opacity-60 transition-opacity' : ''}`} aria-busy={loading}>
      {showSkeletons
        ? Array.from({ length: skeletons }, (_, index) => <ProductCardSkeleton key={index} />)
        : products?.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
