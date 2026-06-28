import { api } from './api'

export const stockService = {
  list: (page = 1, { category, search } = {}, limit = 50) => {
    const params = new URLSearchParams({ page, limit })
    if (category) params.set('category', category)
    if (search && search.trim()) params.set('search', search.trim())
    return api.get(`/api/stock/products?${params}`)
  },
  getPending: () => api.get('/api/stock/pending'),
  applyPending: (id, data) => api.post(`/api/stock/apply/${id}`, data),
  ignorePending: (id) => api.post(`/api/stock/ignore/${id}`),
  listLowStock: () => api.get('/api/stock/products?lowStock=true'),
  updateStock: (id, data) => api.patch(`/api/stock/products/${id}/stock`, data),
  update: (id, data) => api.patch(`/api/products/${id}`, data),
  getDashboardStats: () => api.get('/api/dashboard/stats'),
  uploadImage: (productId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.upload(`/api/products/${productId}/images`, formData)
  },
  deleteImage: (productId, imageId) => api.delete(`/api/products/${productId}/images/${imageId}`),
  setPrimaryImage: (productId, imageId) => api.patch(`/api/products/${productId}/images/${imageId}/primary`, {}),
}
