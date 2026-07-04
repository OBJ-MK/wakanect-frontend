import { api } from './api'

export const stockService = {
  list: (page = 1, { category, search, priceMin, priceMax, sort } = {}, limit = 50) => {
    const params = new URLSearchParams({ page, limit })
    if (category) params.set('category', category)
    if (search && search.trim()) params.set('search', search.trim())
    if (priceMin !== undefined && priceMin !== '') params.set('priceMin', priceMin)
    if (priceMax !== undefined && priceMax !== '') params.set('priceMax', priceMax)
    if (sort) params.set('sort', sort)
    return api.get(`/api/stock/products?${params}`)
  },
  getPending: () => api.get('/api/stock/pending'),
  getOrphanMedia: () => api.get('/api/stock/orphan-media'),
  attachOrphanMedia: (mediaId, candidateId) => api.post('/api/stock/orphan-media/attach', { mediaId, candidateId }),
  deleteOrphanMedia: (mediaId) => api.delete(`/api/stock/orphan-media/${mediaId}`),
  applyPending: (id, data) => api.post(`/api/stock/apply/${id}`, data),
  ignorePending: (id) => api.post(`/api/stock/ignore/${id}`),
  listLowStock: () => api.get('/api/stock/products?lowStock=true'),
  updateStock: (id, data) => api.patch(`/api/stock/products/${id}/stock`, data),
  update: (id, data) => api.patch(`/api/products/${id}`, data),
  getDashboardStats: (period = 'day') => api.get(`/api/dashboard/stats?period=${period}`),
  uploadImage: (productId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.upload(`/api/products/${productId}/images`, formData)
  },
  deleteImage: (productId, imageId) => api.delete(`/api/products/${productId}/images/${imageId}`),
  setPrimaryImage: (productId, imageId) => api.patch(`/api/products/${productId}/images/${imageId}/primary`, {}),
}
