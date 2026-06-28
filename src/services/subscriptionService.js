import { api } from './api'

export const subscriptionService = {
  getSubscription: () => api.get('/api/subscription'),
  getPlans:        () => api.get('/api/plans'),
  createCheckout:  (body) => api.post('/api/subscription/checkout', body),
  getPayments:     () => api.get('/api/subscription/payments'),
  cancel:          () => api.post('/api/subscription/cancel'),
  reactivate:      () => api.post('/api/subscription/reactivate'),
}
