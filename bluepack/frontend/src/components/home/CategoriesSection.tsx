import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductImage } from '@/components/product/ProductImage'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCategories } from '@/hooks/useCategories'
import { catalogUrl } from '@/lib/catalogParams'
import { pluralize } from '@/lib/format'
import type { CategoryTone } from '@/types/catalog'

const TONES: Record<CategoryTone, string> = {
  blue: 'from-[#EAF3FF] to-[#F6FAFF]',
  sky: 'from-[#E6F3FB] to-[#F5FAFD]',
  mint: 'from-[#E8F6F1] to-[#F5FBF8]',
  slate: 'from-[#ECF0F5] to-[#F7F9FB]',
  sand: 'from-[#F8F0E4] to-[#FCF8F2]',
}

export function CategoriesSection() {
  const { data: categories, loading } = useCategories()

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Categorías"
          title="Explorá por categoría"
          description="Encontrá rápido lo que tu negocio necesita, organizado por tipo de producto."
          link={{ to: '/productos', label: 'Ver todo el catálogo' }}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {loading && !categories
            ? Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="aspect-[4/5] rounded-3xl" />)
            : categories?.map((category) => (
                <Link
                  key={category.id}
                  to={catalogUrl({ category: category.slug })}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-b p-3 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-4 ${TONES[category.tone]}`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <ProductImage src={category.image} alt="" className="size-full p-1 transition-transform duration-500 group-hover:scale-[1.07] sm:p-2" />
                  </span>
                  <span className="mt-3 flex items-end justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block text-[15px] leading-tight font-bold text-navy-900 sm:text-base">{category.name}</span>
                      <span className="mt-1 block text-xs text-muted sm:text-sm">{pluralize(category.productCount, 'producto', 'productos')}</span>
                    </span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-brand-600 shadow-sm transition-colors group-hover:bg-brand-500 group-hover:text-white sm:size-9">
                      <ArrowUpRight className="size-4" aria-hidden />
                    </span>
                  </span>
                </Link>
              ))}
        </div>
      </Container>
    </section>
  )
}
