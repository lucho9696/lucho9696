import type { ReactNode } from 'react'
import { Button, ButtonAnchor } from '@/components/ui/Button'
import type { ButtonSize, ButtonVariant } from '@/components/ui/buttonStyles'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useToast } from '@/context/ToastContext'
import { usePendingWhatsAppNotice } from './usePendingWhatsAppNotice'

interface WhatsAppButtonProps {
  /** Enlace wa.me generado por el backend. null = número no configurado. */
  href: string | null | undefined
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  showIcon?: boolean
  'aria-label'?: string
}

/**
 * Botón de WhatsApp. Si el número no está configurado no abre ningún enlace:
 * muestra un aviso de configuración pendiente.
 */
export function WhatsAppButton({ href, children, variant = 'whatsapp', size = 'md', className, showIcon = true, ...rest }: WhatsAppButtonProps) {
  const notifyPending = usePendingWhatsAppNotice()
  const notify = useToast()
  const { status } = useStoreConfig()
  const content = (
    <>
      {showIcon && <WhatsAppIcon className={size === 'sm' ? 'size-4' : 'size-5'} />}
      {children}
    </>
  )

  if (href) {
    return (
      <ButtonAnchor href={href} target="_blank" rel="noopener noreferrer" variant={variant} size={size} className={className} aria-label={rest['aria-label']}>
        {content}
      </ButtonAnchor>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={rest['aria-label']}
      onClick={() =>
        status === 'loading'
          ? notify({ tone: 'info', title: 'Un momento…', description: 'Estamos cargando los datos de contacto.' })
          : notifyPending()
      }
    >
      {content}
    </Button>
  )
}
