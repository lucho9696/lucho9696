import { Link } from 'react-router-dom'

// Tipografía geométrica similar a la del logo (Montserrat 800, importada en main.tsx).
const WORDMARK_FONT = "'Montserrat', 'Inter Variable', ui-sans-serif, system-ui, sans-serif"

interface LogoProps {
  inverted?: boolean
  className?: string
  onClick?: () => void
}

/**
 * Logo de Blue Pack: isotipo sin texto (las bolsas y anillos del logo de Instagram) + wordmark.
 * El logo circular completo, con "BLUE PACK / DESCARTABLES", se reserva para Nosotros y la imagen para redes.
 */
export function Logo({ inverted = false, className = '', onClick }: LogoProps) {
  return (
    <Link to="/" onClick={onClick} className={`group inline-flex shrink-0 items-center gap-2 sm:gap-2.5 ${className}`} aria-label="Blue Pack, ir al inicio">
      <img
        src="/brand/bluepack-icon.svg"
        width={48}
        height={48}
        alt=""
        decoding="async"
        className={`size-10 shrink-0 rounded-full transition-transform duration-300 group-hover:-rotate-6 sm:size-11 lg:size-12 ${
          inverted ? 'ring-2 ring-white/15' : 'shadow-sm shadow-navy-900/25'
        }`}
      />
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span className="text-[1.2rem] font-extrabold tracking-[0.01em] sm:text-[1.3rem] lg:text-[1.4rem]" style={{ fontFamily: WORDMARK_FONT }}>
          <span className={inverted ? 'text-white' : 'text-navy-900'}>BLUE</span>{' '}
          {/* Sobre navy, el turquesa exacto del logo (#59ABBF, 4.4:1); sobre blanco, uno más oscuro para que se lea */}
          <span className={inverted ? 'text-accent-400' : 'text-accent-500'}>PACK</span>
        </span>
        <span className={`mt-1 text-[9px] font-semibold tracking-[0.3em] uppercase sm:text-[9.5px] lg:text-[10px] ${inverted ? 'text-white/60' : 'text-muted'}`}>
          Descartables
        </span>
      </span>
    </Link>
  )
}
