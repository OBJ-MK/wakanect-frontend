import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

export function useAuth() {
  const { login, logout, isAuthenticated, merchant } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(credentials) {
    setLoading(true)
    setError(null)
    try {
      const { token, merchant: m } = await authService.login(credentials)
      localStorage.setItem('waka_token', token)
      login(token, m)
      navigate(m?.role === 'superadmin' ? '/admin' : '/app')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(data) {
    setLoading(true)
    setError(null)
    try {
      const { token, merchant: m } = await authService.register(data)
      localStorage.setItem('waka_token', token)
      login(token, m)
      navigate('/app')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return { handleLogin, handleRegister, handleLogout, loading, error, isAuthenticated, merchant }
}
