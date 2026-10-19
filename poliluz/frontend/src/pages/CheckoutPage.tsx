import { ArrowLeft, CheckCircle2, Loader2, Lock, MessageCircleMore, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProductImage } from '@/components/product/ProductImage'
import { Alert } from '@/components/ui/Alert'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { WhatsAppConfirmModal } from '@/components/whatsapp/WhatsAppConfirmModal'
import { useCart } from '@/context/CartContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { ApiError, api } from '@/lib/api'
import { formatPrice, formatUnits, pluralize } from '@/lib/format'
import { readStorage, writeStorage } from '@/lib/storage'
import { validateCustomer, type FieldErrors } from '@/lib/validation'
import type { CustomerForm, OrderWhatsAppResponse } from '@/types/store'

const FORM_KEY = 'poliluz:checkout-form'
const EMPTY_FORM: CustomerForm = { name: '', business: '', phone: '', city: '', comments: '' }

function loadForm(): CustomerForm {
  try {
    return { ...EMPTY_FORM, ...JSON.parse(readStorage(FORM_KEY, 'session') ?? '{}') }
  } catch {
    return EMPTY_FORM
  }
}

const STEPS = ['Carrito', 'Tus datos', 'Enviar por WhatsApp']

function Steps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 text-sm sm:gap-3" aria-label="Pasos del pedido">
      {STEPS.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            <span className={`flex items-center gap-2 ${active ? 'font-semibold text-navy-900' : done ? 'text-brand-600' : 'text-muted'}`} aria-current={active ? 'step' : undefined}>
              <span className={`grid size-7 place-items-center rounded-full text-xs font-bold ${active ? 'bg-brand-500 text-white' : done ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>{index + 1}</span>
              <span className={active ? '' : 'hidden sm:inline'}>{step}</span>
            </span>
            {index < STEPS.length - 1 && <span className="h-px w-5 bg-line sm:w-10" aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}

export default function CheckoutPage() {
  usePageMeta('Confirmar pedido', 'Revisá tu pedido y envialo a Poliluz por WhatsApp.')
  const { items, totals, clear } = useCart()
  const [form, setForm] = useState<CustomerForm>(loadForm)
  const [errors, setErrors] = useState<FieldErrors<CustomerForm>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<OrderWhatsAppResponse | null>(null)
  const [completed, setCompleted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => writeStorage(FORM_KEY, JSON.stringify(form), 'session'), [form])

  const setField = (field: keyof CustomerForm) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const focusFirstError = () =>
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    const validation = validateCustomer(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      focusFirstError()
      return
    }

    setSubmitting(true)
    try {
      const response = await api.prepareWhatsAppOrder({
        customer: form,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      })
      setResult(response)
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        const { items: itemsError, ...fieldErrors } = error.fields
        setErrors(fieldErrors as FieldErrors<CustomerForm>)
        setFormError(itemsError ?? error.message)
        focusFirstError()
      } else {
        setFormError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (completed) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl animate-fade-up text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="size-10" aria-hidden />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-navy-900">¡Listo! Tu pedido quedó preparado</h1>
          <p className="mt-3 text-lg text-muted">
            Si enviaste el mensaje por WhatsApp, Poliluz te responderá por ese medio para confirmar precios, disponibilidad y la forma de entrega.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/productos">Seguir comprando</ButtonLink>
            <ButtonLink to="/" variant="outline">
              Volver al inicio
            </ButtonLink>
          </div>
        </div>
      </Container>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <PageHeader compact title="Confirmar pedido" breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Carrito', to: '/carrito' }, { label: 'Confirmar pedido' }]} />
        <Container className="py-10">
          <EmptyState icon={ShoppingBag} title="No hay productos para confirmar" description="Agregá productos al carrito para armar tu pedido.">
            <ButtonLink to="/productos">Ver productos</ButtonLink>
          </EmptyState>
        </Container>
      </>
    )
  }

  return (
    <>
      <PageHeader compact title="Confirmar pedido" breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Carrito', to: '/carrito' }, { label: 'Confirmar pedido' }]}>
        <Steps current={1} />
      </PageHeader>

      <Container className="py-8 sm:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
          <form ref={formRef} onSubmit={submit} noValidate className="space-y-6">
            <div className="rounded-3xl border border-line bg-white p-5 sm:p-7">
              <h2 className="text-lg font-bold text-navy-900">Tus datos de contacto</h2>
              <p className="mt-1 text-sm text-muted">Los usamos solo para armar el mensaje de WhatsApp. No se guardan en ningún servidor.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <TextField label="Nombre y apellido" name="name" autoComplete="name" value={form.name} onChange={(event) => setField('name')(event.target.value)} error={errors.name} required maxLength={80} />
                <TextField
                  label="Teléfono de contacto"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ej.: 353 412 3456"
                  value={form.phone}
                  onChange={(event) => setField('phone')(event.target.value)}
                  error={errors.phone}
                  hint="Con código de área, sin 0 ni 15."
                  required
                  maxLength={30}
                />
                <TextField label="Nombre del comercio" name="business" autoComplete="organization" value={form.business} onChange={(event) => setField('business')(event.target.value)} error={errors.business} optional maxLength={80} />
                <TextField label="Localidad" name="city" autoComplete="address-level2" value={form.city} onChange={(event) => setField('city')(event.target.value)} error={errors.city} optional maxLength={80} />
                <div className="sm:col-span-2">
                  <TextAreaField
                    label="Comentarios adicionales"
                    name="comments"
                    placeholder="Ej.: consultar disponibilidad, horario para coordinar, productos alternativos…"
                    value={form.comments}
                    onChange={(event) => setField('comments')(event.target.value)}
                    error={errors.comments}
                    hint={`${form.comments.length}/500 caracteres`}
                    optional
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {formError && (
              <Alert tone="warning" title="No pudimos preparar el pedido">
                {formError}
              </Alert>
            )}

            <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-5 text-sm text-navy-900 sm:p-6">
              <p className="flex items-center gap-2 font-semibold">
                <MessageCircleMore className="size-5 text-brand-500" aria-hidden />
                ¿Cómo sigue?
              </p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
                <li>Revisás el mensaje con el detalle de tu pedido.</li>
                <li>Se abre WhatsApp con el texto listo y lo enviás vos.</li>
                <li>Poliluz confirma precios, disponibilidad y entrega por ese medio.</li>
              </ol>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <Lock className="size-3.5" aria-hidden />
                En esta etapa no se realizan pagos online.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/carrito" className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                <ArrowLeft className="size-4" aria-hidden />
                Volver al carrito
              </Link>
              <Button type="submit" variant="whatsapp" size="lg" disabled={submitting} className="sm:min-w-72">
                {submitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <WhatsAppIcon />}
                {submitting ? 'Preparando pedido…' : 'Revisar y enviar por WhatsApp'}
              </Button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-36" aria-label="Resumen del pedido">
            <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-900">Tu pedido</h2>
                <Link to="/carrito" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                  Editar
                </Link>
              </div>
              <ul className="mt-4 max-h-[420px] divide-y divide-line overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3 py-3">
                    <span className="product-stage size-14 shrink-0 overflow-hidden rounded-xl border border-line">
                      <ProductImage src={item.image} alt="" className="size-full p-1.5" />
                    </span>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="line-clamp-2 font-semibold text-navy-900">{item.name}</p>
                      <p className="mt-0.5 text-xs text-muted tabular-nums">
                        {formatUnits(item.quantity, item.saleUnit)} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-navy-900 tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Total de unidades</dt>
                  <dd className="font-semibold text-navy-900">{pluralize(totals.units, 'unidad', 'unidades')}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="font-semibold text-navy-900">Total estimado</dt>
                  <dd className="text-2xl font-extrabold text-navy-900 tabular-nums">{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted">Precios ficticios de demostración. El valor final lo confirma Poliluz.</p>
            </div>
          </aside>
        </div>
      </Container>

      {result && (
        <WhatsAppConfirmModal
          open
          onClose={() => setResult(null)}
          title="Revisá tu pedido"
          description="Este es el mensaje que vas a enviar a Poliluz."
          message={result.message}
          whatsapp={result.whatsapp}
          summary={
            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-xs text-muted">Productos</p>
                <p className="font-bold text-navy-900">
                  {result.order.lines.length} · {pluralize(result.order.totalUnits, 'unidad', 'unidades')}
                </p>
              </div>
              <div className="rounded-2xl bg-surface p-3">
                <p className="text-xs text-muted">Total estimado</p>
                <p className="font-bold text-navy-900 tabular-nums">{formatPrice(result.order.total)}</p>
              </div>
            </div>
          }
          renderAfterOpen={({ reopen, close }) => (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Si ya enviaste el mensaje, podés vaciar el carrito. Si WhatsApp no se abrió o todavía no lo enviaste, tu carrito se mantiene sin cambios.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  data-autofocus
                  onClick={() => {
                    clear()
                    setForm((current) => ({ ...current, comments: '' }))
                    setResult(null)
                    setCompleted(true)
                    window.scrollTo({ top: 0 })
                  }}
                >
                  <CheckCircle2 className="size-5" aria-hidden />
                  Sí, ya lo envié
                </Button>
                <Button variant="outline" onClick={reopen}>
                  <WhatsAppIcon className="size-5 text-whatsapp" />
                  Volver a abrir WhatsApp
                </Button>
                <Button variant="ghost" onClick={close}>
                  Todavía no, volver al pedido
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </>
  )
}
