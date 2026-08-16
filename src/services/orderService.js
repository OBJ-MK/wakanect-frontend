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
  updateStatus: (id, status, cancelReason, cancelReasonDetail) =>
    api.patch(`/api/orders/${id}/status`, { status, cancelReason, cancelReasonDetail }),
  notifyLinkOpened: (id) => api.post(`/api/orders/${id}/notify-link-opened`, {}),
  notifyConfirm: (id) => api.post(`/api/orders/${id}/notify-confirm`, {}),
  markPaid: (id) => api.patch(`/api/orders/${id}/payment`, { payment_status: 'Payée' }),
}