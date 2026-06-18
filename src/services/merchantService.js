import { api } from './api'

export const merchantService = {
  updateProfile: (data) => api.patch('/api/merchants/me', data),
}
