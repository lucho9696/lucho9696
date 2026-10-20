import { Check, Copy, ExternalLink } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button, ButtonAnchor } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import type { WhatsAppLinkInfo } from '@/types/catalog'

interface WhatsAppConfirmModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: ReactNode
  message: string
  whatsapp: WhatsAppLinkInfo
  summary?: ReactNode
  /** Contenido que se muestra después de abrir WhatsApp (p. ej. confirmar si se envió). */
  renderAfterOpen: (helpers: { reopen: () => void; close: () => void }) => ReactNode
}

/** Vista previa con el formato de WhatsApp: *texto* se muestra en negrita. */
// Formato de WhatsApp: *negrita* y _cursiva_ (la cursiva solo entre espacios o bordes, como en la app).
const FORMATTED = /(\*[^*\n]+\*|(?<=^|\s)_[^_\n]+_(?=\s|$))/g

function MessagePreview({ message }: { message: string }) {
  return message.split('\n').map((line, lineIndex) => (
    <span key={lineIndex} className="block min-h-[1lh]">
      {line.split(FORMATTED).map((part, index) => {
        if (/^\*[^*]+\*$/.test(part)) {
          return (
            <strong key={index} className="font-semibold text-navy-900">
              {part.slice(1, -1)}
            </strong>
          )
        }
        if (/^_[^_]+_$/.test(part)) {
          return (
            <em key={index} className="text-muted">
              {part.slice(1, -1)}
            </em>
          )
        }
        return part
      })}
    </span>
  ))
}

/**
 * Muestra el mensaje armado y solo abre WhatsApp cuando el usuario lo confirma.
 * Si el número no está configurado, no genera ningún enlace.
 */
export function WhatsAppConfirmModal({ open, onClose, title, description, message, whatsapp, summary, renderAfterOpen }: WhatsAppConfirmModalProps) {
  const [opened, setOpened] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      setOpened(false)
      setCopied(false)
    }
  }, [open, message])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const reopen = () => {
    if (whatsapp.url) window.open(whatsapp.url, '_blank', 'noopener,noreferrer')
  }

  if (opened) {
    return (
      <Modal open={open} onClose={onClose} title="¿Pudiste enviar el mensaje?" description="Se abrió WhatsApp en una nueva pestaña o en la aplicación.">
        {renderAfterOpen({ reopen, close: onClose })}
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={title}
      description={description}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Volver y editar
          </Button>
          {whatsapp.configured && whatsapp.url ? (
            <ButtonAnchor href={whatsapp.url} target="_blank" rel="noopener noreferrer" variant="whatsapp" data-autofocus onClick={() => setOpened(true)}>
              <WhatsAppIcon />
              Abrir WhatsApp y enviar
              <ExternalLink className="size-4 opacity-80" aria-hidden />
            </ButtonAnchor>
          ) : (
            <Button variant="whatsapp" disabled>
              <WhatsAppIcon />
              WhatsApp no configurado
            </Button>
          )}
        </div>
      }
    >
      {!whatsapp.configured && (
        <Alert tone="warning" title="Configuración pendiente" className="mb-4">
          El número de WhatsApp de Blue Pack todavía no está configurado (variable <code className="font-mono text-xs">WHATSAPP_NUMBER</code>). Por seguridad no se abre ningún enlace. Podés copiar el mensaje para probar el formato.
        </Alert>
      )}
      {summary}
      <div className="mt-1">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-navy-900">Mensaje que se enviará</p>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-brand-600 hover:bg-brand-50">
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto rounded-2xl border border-[#D7E9DD] bg-[#F1F8F3] p-4 text-sm leading-relaxed break-words text-ink" data-testid="whatsapp-message">
          <MessagePreview message={message} />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">
        Al confirmar se abrirá WhatsApp con este texto para que lo envíes vos. La web no registra pedidos ni procesa pagos: Blue Pack confirmará precios, disponibilidad y entrega por ese medio.
      </p>
    </Modal>
  )
}
