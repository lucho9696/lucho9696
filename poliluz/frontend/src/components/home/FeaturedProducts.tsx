import { ProductGrid } from '@/components/product/ProductGrid'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useApi } from '@/hooks/useApi'
import { api } from '@/lib/api'
import { catalogUrl } from '@/lib/catalogParams'

export function FeaturedProducts() {
  const { data, loading } = useApi('home:featured', () => api.products({ featured: true, perPage: 8 }))

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Destacados"
          title="Productos más elegidos"
          description="Una selección de artículos esenciales para comercios y gastronomía."
          link={{ to: catalogUrl({ featured: true }), label: 'Ver destacados' }}
        />
        <ProductGrid products={data?.data} loading={loading} />
      </Container>
    </section>
  )
}
