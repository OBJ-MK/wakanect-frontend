import { api } from './api'

export const orderService = {
  list: () => api.get('/api/orders'),
  get: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}`, { status }),
  markPaid: (id) => api.patch(`/api/orders/${id}/payment`, {}),
}
