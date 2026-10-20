import { X } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDialog } from './useDialog'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  side?: 'left' | 'right' | 'bottom'
  children: ReactNode
  footer?: ReactNode
  headerExtra?: ReactNode
}

const PANEL: Record<NonNullable<DrawerProps['side']>, { base: string; closed: string }> = {
  right: { base: 'inset-y-0 right-0 h-full w-full max-w-md', closed: 'translate-x-full' },
  left: { base: 'inset-y-0 left-0 h-full w-[88%] max-w-sm', closed: '-translate-x-full' },
  bottom: { base: 'inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-3xl', closed: 'translate-y-full' },
}

export function Drawer({ open, onClose, title, side = 'right', children, footer, headerExtra }: DrawerProps) {
  const panelRef = useDialog(open, onClose)
  const titleId = useId()
  const panel = PANEL[side]

  return createPortal(
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} inert={!open} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-navy-950/40 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`absolute flex flex-col bg-white shadow-2xl outline-none transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${panel.base} ${open ? 'visible translate-x-0 translate-y-0' : `invisible ${panel.closed}`}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <h2 id={titleId} className="truncate text-lg font-bold text-navy-900">
              {title}
            </h2>
            {headerExtra}
          </div>
          <button type="button" onClick={onClose} className="-mr-1.5 rounded-xl p-2 text-muted transition-colors hover:bg-surface hover:text-ink" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
