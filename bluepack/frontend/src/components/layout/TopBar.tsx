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
        {/* Móvil: el nombre ya está en el logo; se usa la barra para el aviso de demo o la propuesta */}
        <p className="truncate sm:hidden">
          {demo ? (
            <span className="inline-flex items-center gap-1.5">
              <Info className="size-3.5 shrink-0 text-accent-300" aria-hidden />
              {SITE.demoNoticeShort}
            </span>
          ) : (
            `Venta mayorista y minorista · ${SITE.location}`
          )}
        </p>
        <p className="hidden truncate sm:block">
          <span className="font-semibold text-white">{SITE.fullName}</span>
          {/* Con el aviso de demo visible, la propuesta y la ubicación aparecen recién cuando hay espacio */}
          <span className={`hidden ${demo ? 'lg:inline' : 'md:inline'}`}> | Venta mayorista y minorista</span>
          <span className={`hidden ${demo ? 'xl:inline' : 'md:inline'}`}> · {SITE.location}</span>
        </p>
        <div className="hidden items-center gap-5 sm:flex">
          {demo && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-white/70">
              <Info className="size-3.5" aria-hidden />
              <span className="lg:hidden">{SITE.demoNoticeShort}</span>
              <span className="hidden lg:inline">{SITE.demoNotice}</span>
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
