import { Container } from '@/components/ui/Container'
import { BENEFITS } from '@/content/benefits'

export function BenefitsSection() {
  return (
    <section className="border-y border-line bg-white py-12 sm:py-14" aria-label="Por qué elegir Poliluz">
      <Container>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4 rounded-2xl p-2 lg:flex-col lg:gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block font-bold text-navy-900">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{description}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
