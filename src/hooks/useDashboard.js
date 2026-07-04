import { useState, useEffect } from 'react'
import { stockService } from '@/services/stockService'

export function useDashboard(period = 'day') {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    stockService.getDashboardStats(period)
      .then(s => { if (!cancelled) setStats(s) })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [period])

  return { stats, loading, error }
}
