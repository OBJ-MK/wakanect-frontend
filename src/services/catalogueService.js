import { api } from './api'

export const catalogueService = {
  getBoutique: (slug, page = 1, limit = 20, { category, search, priceMin, priceMax, sort } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (category && category !== 'Tout') params.set('category', category)
    if (search && search.trim()) params.set('search', search.trim())
    if (priceMin !== undefined && priceMin !== '') params.set('priceMin', priceMin)
    if (priceMax !== undefined && priceMax !== '') params.set('priceMax', priceMax)
    if (sort) params.set('sort', sort)
    return api.get(`/api/boutique/${slug}?${params}`)
  },
  createOrder: (data) => api.post('/api/orders/public', data),
  uploadPaymentProof: (orderId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.upload(`/api/orders/public/${orderId}/proof`, formData)
  },
}
