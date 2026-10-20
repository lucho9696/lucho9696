import { describe, expect, it } from 'vitest'
import { phoneError, validateCustomer, validateWholesale } from './validation'

describe('validateCustomer', () => {
  it('exige nombre y teléfono', () => {
    const errors = validateCustomer({ name: '', business: '', phone: '', city: '', comments: '' })
    expect(Object.keys(errors).sort()).toEqual(['name', 'phone'])
  })

  it('acepta datos válidos', () => {
    expect(validateCustomer({ name: 'Juan Pérez', business: '', phone: '351 123-4567', city: 'Villa María', comments: '' })).toEqual({})
  })

  it('valida el teléfono', () => {
    expect(phoneError('abc', true)).toBeDefined()
    expect(phoneError('1234', true)).toBeDefined()
    expect(phoneError('+54 9 353 412-3456', true)).toBeUndefined()
    expect(phoneError('', false)).toBeUndefined()
  })
})

describe('validateWholesale', () => {
  it('pide productos o categorías de interés', () => {
    const base = { name: 'Ana', business: '', businessType: '', city: '', phone: '', categories: [], details: '' }
    expect(validateWholesale(base).details).toBeDefined()
    expect(validateWholesale({ ...base, categories: ['bolsas'] })).toEqual({})
  })
})
