import { api } from './api'

export const catalogueService = {
  getBoutique: (slug) => api.get(`/api/boutique/${slug}`),
  createOrder: (data) => api.post('/api/orders/public', data),
}
