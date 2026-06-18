import { api } from './api'

export const employeeService = {
  list:   ()          => api.get('/api/employees'),
  create: (data)      => api.post('/api/employees', data),
  update: (id, data)  => api.patch(`/api/employees/${id}`, data),
  remove: (id)        => api.delete(`/api/employees/${id}`),
}
