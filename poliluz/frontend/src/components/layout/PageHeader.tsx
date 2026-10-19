import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'

export function PageHeader({
  title,
  description,
  breadcrumbs,
  eyebrow,
  children,
  compact = false,
}: {
  title: string
  description?: ReactNode
  breadcrumbs?: Crumb[]
  eyebrow?: string
  children?: ReactNode
  compact?: boolean
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50/70 to-white">
      <div className="pointer-events-none absolute -top-24 right-[-10%] size-[360px] rounded-full bg-brand-100/50 blur-3xl" aria-hidden />
      <Container className={`relative ${compact ? 'py-7 sm:py-9' : 'py-10 sm:py-14'}`}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-4" />}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl animate-fade-up">
            {eyebrow && <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">{eyebrow}</p>}
            <h1 className={`mt-1 font-extrabold tracking-tight text-navy-900 ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-[2.75rem]'}`}>{title}</h1>
            {description && <div className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{description}</div>}
          </div>
          {children}
        </div>
      </Container>
    </section>
  )
}
