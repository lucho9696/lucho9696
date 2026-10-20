import { describe, expect, it } from 'vitest'
import { formatPrice, formatUnits, pluralize } from './format'

describe('format', () => {
  it('formatea precios en pesos argentinos', () => {
    expect(formatPrice(8500)).toBe('$ 8.500')
    expect(formatPrice(53000)).toBe('$ 53.000')
    expect(formatPrice(1234567)).toBe('$ 1.234.567')
    expect(formatPrice(900)).toBe('$ 900')
  })

  it('pluraliza unidades de venta', () => {
    expect(formatUnits(1, { singular: 'paquete', plural: 'paquetes' })).toBe('1 paquete')
    expect(formatUnits(2, { singular: 'paquete', plural: 'paquetes' })).toBe('2 paquetes')
    expect(pluralize(0, 'producto', 'productos')).toBe('0 productos')
  })
})
