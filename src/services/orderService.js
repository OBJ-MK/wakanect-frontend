import { api } from './api'

export const orderService = {
  list: (page = 1, { status, search, sort } = {}, limit = 20) => {
    const params = new URLSearchParams({ page, limit })
    if (status && status !== 'Toutes') params.set('status', status)
    if (search && search.trim()) params.set('search', search.trim())
    if (sort) params.set('sort', sort)
    return api.get(`/api/orders?${params}`)
  },
  get: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  markPaid: (id) => api.patch(`/api/orders/${id}/payment`, {}),
}
