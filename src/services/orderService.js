import { api } from './api'

export const orderService = {
  list: (page = 1, limit = 20) => api.get(`/api/orders?page=${page}&limit=${limit}`),
  get: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  markPaid: (id) => api.patch(`/api/orders/${id}/payment`, {}),
}
