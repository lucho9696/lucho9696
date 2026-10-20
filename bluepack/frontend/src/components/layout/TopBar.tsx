import { Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SITE } from '@/content/site'
import { useDemoMode } from '@/hooks/useDemoMode'

export function TopBar() {
  const demo = useDemoMode()

  return (
    <div className="bg-navy-900 text-white/85">
      <Container className="flex h-9 items-center justify-center gap-6 text-xs sm:justify-between sm:text-[13px]">
        <p className="truncate">
          <span className="font-semibold text-white">Distribuidora de descartables</span>
          <span className="hidden sm:inline"> | Soluciones para tu negocio</span>
        </p>
        <div className="hidden items-center gap-5 sm:flex">
          {demo && (
            <span className="hidden items-center gap-1.5 text-white/70 lg:inline-flex">
              <Info className="size-3.5" aria-hidden />
              {SITE.demoNotice}
            </span>
          )}
          <Link to="/mayoristas" className="font-semibold whitespace-nowrap text-white hover:text-brand-200">
            Consultas por mayor
          </Link>
        </div>
      </Container>
    </div>
  )
}
