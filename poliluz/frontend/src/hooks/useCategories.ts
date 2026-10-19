import { api } from '@/lib/api'
import { useApi } from './useApi'

export function useCategories() {
  return useApi('categories', api.categories)
}
