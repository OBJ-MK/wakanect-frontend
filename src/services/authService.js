import { api } from './api'

export const authService = {
  register: (data) => api.post('/api/merchants/register', data),
  login: (data) => api.post('/api/auth/login', data),
  employeeLogin: (data) => api.post('/api/auth/employee/login', data),
  me: () => api.get('/api/merchants/me'),
}
