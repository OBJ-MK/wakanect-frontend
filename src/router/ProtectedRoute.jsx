import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const paywallPending  = useAuthStore(s => s.paywallPending)
  const clearPaywall    = useAuthStore(s => s.clearPaywall)
  const navigate        = useNavigate()

  useEffect(() => {
    if (paywallPending) {
      clearPaywall()
      navigate('/abonnement/essai-termine', { replace: true })
    }
  }, [paywallPending, clearPaywall, navigate])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
