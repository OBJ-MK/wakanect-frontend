import { api } from './api'

export const catalogueService = {
  getBoutique: (slug, page = 1, limit = 24) =>
    api.get(`/api/boutique/${slug}?page=${page}&limit=${limit}`),
  createOrder: (data) => api.post('/api/orders/public', data),
}
