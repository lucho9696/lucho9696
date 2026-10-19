import { X } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDialog } from './useDialog'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useDialog(open, onClose)
  const titleId = useId()

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[65] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-navy-950/45 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full animate-fade-up flex-col rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl ${size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-navy-900">
              {title}
            </h2>
            {description && <div className="mt-1 text-sm text-muted">{description}</div>}
          </div>
          <button type="button" onClick={onClose} className="-mt-1 -mr-2 rounded-xl p-2 text-muted hover:bg-surface hover:text-ink" aria-label="Cerrar">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
