import { Building2, Check, ClipboardList, Loader2, MessagesSquare, Handshake, Store, Truck, UtensilsCrossed } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { WhatsAppButton } from '@/components/whatsapp/WhatsAppButton'
import { WhatsAppConfirmModal } from '@/components/whatsapp/WhatsAppConfirmModal'
import { useStoreConfig } from '@/context/StoreConfigContext'
import { useCategories } from '@/hooks/useCategories'
import { usePageMeta } from '@/hooks/usePageMeta'
import { ApiError, api } from '@/lib/api'
import { validateWholesale, type FieldErrors } from '@/lib/validation'
import type { WhatsAppMessageResponse, WholesalePayload } from '@/types/store'

const EMPTY: WholesalePayload = { name: '', business: '', businessType: '', city: '', phone: '', categories: [], details: '' }

const AUDIENCES = [
  { icon: Store, title: 'Comercios', text: 'Almacenes, despensas, kioscos y autoservicios.' },
  { icon: UtensilsCrossed, title: 'Gastronomía', text: 'Restaurantes, rotiserías, bares y food trucks.' },
  { icon: Truck, title: 'Revendedores', text: 'Distribuidores y comercios que revenden.' },
  { icon: Building2, title: 'Eventos e instituciones', text: 'Catering, empresas, clubes y escuelas.' },
]

const STEPS = [
  { icon: ClipboardList, title: 'Contanos qué necesitás', text: 'Indicá productos, cantidades estimadas y tu rubro.' },
  { icon: MessagesSquare, title: 'Enviá la consulta por WhatsApp', text: 'Se arma un mensaje con tus datos para que lo envíes.' },
  { icon: Handshake, title: 'Coordinás con Blue Pack', text: 'Precios, condiciones y entregas se acuerdan directamente.' },
]

export default function WholesalePage() {
  usePageMeta('Compras mayoristas', 'Consultas mayoristas para comercios, gastronómicos y revendedores. Coordiná precios y condiciones con Blue Pack por WhatsApp.')
  const { config } = useStoreConfig()
  const { data: categories } = useCategories()
  const [form, setForm] = useState<WholesalePayload>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors<WholesalePayload>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<WhatsAppMessageResponse | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const set = <K extends keyof WholesalePayload>(field: K, value: WholesalePayload[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field] || (field === 'categories' && errors.details)) setErrors((current) => ({ ...current, [field]: undefined, details: field === 'categories' ? undefined : current.details }))
  }

  const toggleCategory = (id: string) =>
    set('categories', form.categories.includes(id) ? form.categories.filter((item) => item !== id) : [...form.categories, id])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    const validation = validateWholesale(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setSubmitting(true)
    try {
      setResult(await api.prepareWholesaleInquiry(form))
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) setErrors(error.fields as FieldErrors<WholesalePayload>)
      setFormError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Mayoristas"
        title="Compras por mayor para tu negocio"
        description="Si comprás por volumen, coordinamos directamente con vos. Contanos qué productos necesitás y te contactamos con la información comercial."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Mayoristas' }]}
      >
        <WhatsAppButton href={config?.whatsapp.links.wholesale} size="lg">
          Escribir por WhatsApp
        </WhatsAppButton>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <section aria-labelledby="audiences">
          <h2 id="audiences" className="text-2xl font-extrabold tracking-tight text-navy-900">
            ¿Para quién es?
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {AUDIENCES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-3xl border border-line bg-white p-4 transition-shadow hover:shadow-card sm:p-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="size-6" aria-hidden />
                </span>
                <p className="mt-4 font-bold text-navy-900">{title}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.35fr]">
          <section aria-labelledby="how" className="lg:sticky lg:top-36">
            <h2 id="how" className="text-2xl font-extrabold tracking-tight text-navy-900">
              ¿Cómo funciona?
            </h2>
            <ol className="mt-6 space-y-5">
              {STEPS.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-4">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-navy-900 text-white">
                    <Icon className="size-5" aria-hidden />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-brand-500 text-[11px] font-bold ring-2 ring-white">{index + 1}</span>
                  </span>
                  <span>
                    <span className="block font-bold text-navy-900">{title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Alert className="mt-8">
              Los precios mayoristas, mínimos de compra y condiciones comerciales se informan directamente por Blue Pack. Esta sección no publica condiciones especiales.
            </Alert>
          </section>

          <form ref={formRef} onSubmit={submit} noValidate className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8" aria-labelledby="wholesale-form">
            <h2 id="wholesale-form" className="text-xl font-bold text-navy-900">
              Solicitar información mayorista
            </h2>
            <p className="mt-1 text-sm text-muted">Completá lo que puedas: el mensaje se arma con estos datos.</p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField label="Nombre y apellido" autoComplete="name" value={form.name} onChange={(event) => set('name', event.target.value)} error={errors.name} required maxLength={80} />
              <TextField label="Comercio o razón social" autoComplete="organization" value={form.business} onChange={(event) => set('business', event.target.value)} error={errors.business} optional maxLength={80} />
              <SelectField label="Rubro" value={form.businessType} onChange={(event) => set('businessType', event.target.value)} error={errors.businessType} optional>
                <option value="">Seleccioná una opción</option>
                {config?.wholesale.businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </SelectField>
              <TextField label="Localidad" autoComplete="address-level2" value={form.city} onChange={(event) => set('city', event.target.value)} error={errors.city} optional maxLength={80} />
              <div className="sm:col-span-2">
                <TextField label="Teléfono" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(event) => set('phone', event.target.value)} error={errors.phone} optional hint="Con código de área." maxLength={30} />
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-semibold text-navy-900">Categorías de interés</legend>
                <div className="flex flex-wrap gap-2">
                  {categories?.map((category) => {
                    const selected = form.categories.includes(category.id)
                    return (
                      <button
                        key={category.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleCategory(category.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-white text-ink hover:border-brand-200 hover:bg-brand-50'}`}
                      >
                        {selected && <Check className="size-3.5" aria-hidden />}
                        {category.name}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <TextAreaField
                  label="Productos y cantidades estimadas"
                  placeholder={'Ej.: Envases rectangulares 750 ml: 20 packs por mes\nVasos 500 ml: 10 paquetes'}
                  value={form.details}
                  onChange={(event) => set('details', event.target.value)}
                  error={errors.details}
                  hint={`${form.details.length}/1000 caracteres`}
                  maxLength={1000}
                  rows={5}
                />
              </div>
            </div>

            {formError && (
              <Alert tone="warning" className="mt-5">
                {formError}
              </Alert>
            )}

            <Button type="submit" variant="whatsapp" size="lg" className="mt-6 w-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <WhatsAppIcon />}
              {submitting ? 'Preparando consulta…' : 'Enviar consulta por WhatsApp'}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">Esta consulta es independiente del carrito y no genera un pedido.</p>
          </form>
        </div>
      </Container>

      {result && (
        <WhatsAppConfirmModal
          open
          onClose={() => setResult(null)}
          title="Revisá tu consulta"
          description="Este es el mensaje que vas a enviar a Blue Pack."
          message={result.message}
          whatsapp={result.whatsapp}
          renderAfterOpen={({ reopen, close }) => (
            <div className="space-y-4">
              <p className="text-sm text-muted">Blue Pack te responderá por WhatsApp con la información comercial. Si la aplicación no se abrió, podés intentarlo nuevamente.</p>
              <div className="flex flex-col gap-3">
                <Button
                  data-autofocus
                  onClick={() => {
                    setForm(EMPTY)
                    close()
                  }}
                >
                  Listo, ya la envié
                </Button>
                <Button variant="outline" onClick={reopen}>
                  <WhatsAppIcon className="size-5 text-whatsapp" />
                  Volver a abrir WhatsApp
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </>
  )
}
