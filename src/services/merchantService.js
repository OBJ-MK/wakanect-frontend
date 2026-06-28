import { api } from './api'

export const merchantService = {
  updateProfile: (data) => api.patch('/api/merchants/me', data),
  uploadLogo: (file) => {
    const formData = new FormData()
    formData.append('logo', file)
    return api.upload('/api/merchants/me/logo', formData)
  },
}
