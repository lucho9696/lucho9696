import { BenefitsSection } from '@/components/home/BenefitsSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { FaqPreview } from '@/components/home/FaqPreview'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { NewProducts } from '@/components/home/NewProducts'
import { WholesaleBanner } from '@/components/home/WholesaleBanner'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function HomePage() {
  usePageMeta(null)

  return (
    <>
      <Hero />
      <BenefitsSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WholesaleBanner />
      <NewProducts />
      <FaqPreview />
    </>
  )
}
