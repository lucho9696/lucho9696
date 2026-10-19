import type { CustomerForm, WholesalePayload } from '@/types/store'

/**
 * Validaciones del lado del cliente para dar respuesta inmediata.
 * El backend vuelve a validar todo: es la fuente de verdad.
 */
export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function phoneError(value: string, required: boolean): string | undefined {
  const raw = value.trim()
  if (!raw) return required ? 'Ingresá un teléfono de contacto.' : undefined
  const digits = raw.replace(/\D/g, '')
  if (!/^[\d\s\-().+]+$/.test(raw) || digits.length < 8 || digits.length > 15) {
    return 'Ingresá un teléfono válido, con código de área (solo números).'
  }
  return undefined
}

function nameError(value: string): string | undefined {
  const name = value.trim()
  if (!name) return 'Ingresá tu nombre.'
  if (name.length < 2) return 'Tu nombre debe tener al menos 2 caracteres.'
  if (name.length > 80) return 'Tu nombre no puede superar los 80 caracteres.'
  return undefined
}

function maxLength(value: string, max: number): string | undefined {
  return value.trim().length > max ? `El texto no puede superar los ${max} caracteres.` : undefined
}

function compact<T>(errors: FieldErrors<T>): FieldErrors<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as FieldErrors<T>
}

export function validateCustomer(form: CustomerForm): FieldErrors<CustomerForm> {
  return compact<CustomerForm>({
    name: nameError(form.name),
    phone: phoneError(form.phone, true),
    business: maxLength(form.business, 80),
    city: maxLength(form.city, 80),
    comments: maxLength(form.comments, 500),
  })
}

export function validateWholesale(form: WholesalePayload): FieldErrors<WholesalePayload> {
  return compact<WholesalePayload>({
    name: nameError(form.name),
    phone: phoneError(form.phone, false),
    business: maxLength(form.business, 80),
    city: maxLength(form.city, 80),
    details:
      maxLength(form.details, 1000) ??
      (!form.details.trim() && form.categories.length === 0 ? 'Contanos qué productos te interesan o elegí al menos una categoría.' : undefined),
  })
}
