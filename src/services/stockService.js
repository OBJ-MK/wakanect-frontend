import { api } from './api'

export const stockService = {
  list: () => api.get('/api/stock/products'),
  getPending: () => api.get('/api/stock/pending'),
  applyPending: (id, data) => api.post(`/api/stock/apply/${id}`, data),
  ignorePending: (id) => api.post(`/api/stock/ignore/${id}`),
  updateStock: (id, data) => api.patch(`/api/stock/products/${id}/stock`, data),
  update: (id, data) => api.patch(`/api/products/${id}`, data),
  getDashboardStats: () => api.get('/api/dashboard/stats'),
}
