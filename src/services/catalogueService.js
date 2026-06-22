import { api } from './api'

export const catalogueService = {
  getBoutique: (slug, page = 1, limit = 24, { category, search } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (category && category !== 'Tout') params.set('category', category)
    if (search && search.trim()) params.set('search', search.trim())
    return api.get(`/api/boutique/${slug}?${params}`)
  },
  createOrder: (data) => api.post('/api/orders/public', data),
}
