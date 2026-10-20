import { useCallback } from 'react'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useToast } from '@/context/ToastContext'

export function usePendingWhatsAppNotice() {
  const notify = useToast()
  const { status } = useStoreConfig()

  return useCallback(() => {
    notify(
      status === 'error'
        ? {
            tone: 'info',
            title: 'No pudimos conectar con el servidor',
            description: 'Revisá tu conexión e intentá nuevamente en unos segundos.',
          }
        : {
            tone: 'info',
            title: 'WhatsApp pendiente de configuración',
            description:
              'El número de Blue Pack todavía no está cargado en esta demo (variable WHATSAPP_NUMBER), por eso no se abre ningún enlace.',
            duration: 6000,
          },
    )
  }, [notify, status])
}
