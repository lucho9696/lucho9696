import { describe, expect, it } from 'vitest'
import { productListQuery } from './api'
import { catalogUrl, readCatalogFilters, toApiParams, writeCatalogFilters } from './catalogParams'

describe('catalogParams', () => {
  it('lee y escribe los filtros de la URL', () => {
    const filters = readCatalogFilters(new URLSearchParams('q=vaso&categoria=bolsas&orden=precio-asc&destacados=1&pagina=2'))
    expect(filters).toEqual({ q: 'vaso', category: 'bolsas', sort: 'precio-asc', featured: true, page: 2 })
    expect(writeCatalogFilters(filters).toString()).toBe('q=vaso&categoria=bolsas&orden=precio-asc&destacados=1&pagina=2')
  })

  it('ignora valores inválidos', () => {
    expect(readCatalogFilters(new URLSearchParams('orden=cualquiera&pagina=-4'))).toMatchObject({ sort: '', page: 1 })
  })

  it('traduce los filtros a parámetros de la API', () => {
    const params = toApiParams(readCatalogFilters(new URLSearchParams('categoria=bolsas&orden=precio-desc')))
    expect(productListQuery(params)).toBe('category=bolsas&sort=price_desc&perPage=12')
  })

  it('arma URLs del catálogo', () => {
    expect(catalogUrl()).toBe('/productos')
    expect(catalogUrl({ category: 'bolsas', page: 1 })).toBe('/productos?categoria=bolsas')
  })
})
