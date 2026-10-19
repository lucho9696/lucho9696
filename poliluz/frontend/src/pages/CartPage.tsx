import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { useCart } from '@/context/CartContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatPrice } from '@/lib/format'

export default function CartPage() {
  usePageMeta('Carrito', 'Revisá los productos de tu pedido antes de enviarlo por WhatsApp.')
  const { items, totals, clear } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <>
      <PageHeader compact title="Carrito de compras" breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Carrito' }]} />
      <Container className="py-8 pb-28 sm:py-10 lg:pb-14">
        {items.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Tu carrito está vacío" description="Todavía no agregaste productos. Explorá el catálogo y armá tu pedido en pocos pasos.">
            <ButtonLink to="/productos">Explorar productos</ButtonLink>
            <ButtonLink to="/" variant="outline">
              Volver al inicio
            </ButtonLink>
          </EmptyState>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
            <div className="rounded-3xl border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
                <h2 className="font-bold text-navy-900">Productos ({totals.lines})</h2>
                <button type="button" onClick={() => setConfirmClear(true)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted transition-colors hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="size-4" aria-hidden />
                  Vaciar carrito
                </button>
              </div>
              <ul className="divide-y divide-line px-5 sm:px-6">
                {items.map((item) => (
                  <li key={item.productId} className="py-5">
                    <CartLineItem item={item} />
                  </li>
                ))}
              </ul>
              <div className="border-t border-line px-5 py-4 sm:px-6">
                <ButtonLink to="/productos" variant="ghost" size="sm" className="-ml-2 text-brand-600">
                  <ArrowLeft className="size-4" aria-hidden />
                  Seguir comprando
                </ButtonLink>
              </div>
            </div>

            <div className="lg:sticky lg:top-36">
              <OrderSummary>
                <ButtonLink to="/checkout" size="lg" className="w-full">
                  Continuar con el pedido
                  <ArrowRight className="size-5" aria-hidden />
                </ButtonLink>
                <ButtonLink to="/productos" variant="outline" className="w-full">
                  Seguir comprando
                </ButtonLink>
              </OrderSummary>
            </div>
          </div>
        )}
      </Container>

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted">Total estimado</p>
              <p className="text-lg font-extrabold text-navy-900 tabular-nums">{formatPrice(totals.total)}</p>
            </div>
            <ButtonLink to="/checkout" className="flex-1">
              Continuar
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      )}

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="¿Vaciar el carrito?"
        description="Se quitarán todos los productos. Esta acción no se puede deshacer."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmClear(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 shadow-red-600/20 hover:bg-red-700"
              onClick={() => {
                clear()
                setConfirmClear(false)
              }}
            >
              Sí, vaciar carrito
            </Button>
          </div>
        }
      >
        <p className="text-sm text-muted">Vas a quitar {totals.lines} productos del carrito.</p>
      </Modal>
    </>
  )
}
