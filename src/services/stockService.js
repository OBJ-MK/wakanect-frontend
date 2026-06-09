import { api } from './api'

export const stockService = {
  list: () => api.get('/api/stock/products'),
  getPending: () => api.get('/api/stock/pending'),
  applyPending: (id, data) => api.post(`/api/stock/apply/${id}`, data),
  updateStock: (id, data) => api.patch(`/api/stock/products/${id}/stock`, data),
  getDashboardStats: () => api.get('/api/dashboard/stats'),
}
