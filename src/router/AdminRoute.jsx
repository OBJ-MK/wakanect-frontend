import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AdminRoute() {
  const { isAuthenticated, merchant } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (merchant?.role !== 'superadmin') return <Navigate to="/login" replace />
  return <Outlet />
}
