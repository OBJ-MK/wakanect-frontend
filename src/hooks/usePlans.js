import { useState, useEffect } from 'react'
import { api } from '@/services/api'

/**
 * Charge /api/plans (pays-aware) et retourne { data, loading, error, refetch }.
 * data = { country, currency, plans: [...], discounts: { quarter, semester, year } }
 */
export function usePlans() {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  function run() {
    setState(s => ({ ...s, loading: true, error: null }))
    api.get('/api/plans')
      .then(data  => setState({ data, loading: false, error: null }))
      .catch(err  => setState({ data: null, loading: false, error: err.message }))
  }

  useEffect(() => { run() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch: run }
}
