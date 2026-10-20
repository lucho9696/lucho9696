import { ProductCarousel } from '@/components/product/ProductCarousel'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useApi } from '@/hooks/useApi'
import { api } from '@/lib/api'

export function NewProducts() {
  const { data, loading } = useApi('home:new', () => api.products({ new: true, perPage: 12 }))

  return (
    <section className="overflow-hidden bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Novedades"
          title="Recién incorporados"
          description="Productos nuevos en el catálogo para completar tu pedido."
          link={{ to: '/productos?orden=nombre-asc', label: 'Ver catálogo completo' }}
        />
        <ProductCarousel products={data?.data} loading={loading} label="Productos nuevos" />
      </Container>
    </section>
  )
}
