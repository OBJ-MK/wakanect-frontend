import { useState, useEffect } from 'react'
import { api } from '@/services/api'

// Cache module-level : toutes les instances du hook partagent la même réponse
// (évite N requêtes HTTP quand Hero + Pricing + Faq + FinalCta appellent usePlans).
let _cache    = null
let _cacheAt  = 0
const CACHE_TTL = 60_000

/**
 * Charge GET /api/plans (route publique, pays SN par défaut) et retourne
 * { data, loading, error, refetch }.
 * data = { country, currency, plans, trial: { days, scans }, discounts }
 */
export function usePlans() {
  const [state, setState] = useState(() => ({
    data:    _cache,
    loading: _cache === null,
    error:   null,
  }))

  useEffect(() => {
    if (_cache && Date.now() - _cacheAt < CACHE_TTL) {
      setState({ data: _cache, loading: false, error: null })
      return
    }
    setState(s => ({ ...s, loading: true, error: null }))
    api.get('/api/plans')
      .then(data => {
        _cache   = data
        _cacheAt = Date.now()
        setState({ data, loading: false, error: null })
      })
      .catch(err => setState({ data: null, loading: false, error: err.message }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function refetch() {
    _cache   = null
    _cacheAt = 0
    setState({ data: null, loading: true, error: null })
    api.get('/api/plans')
      .then(data => {
        _cache   = data
        _cacheAt = Date.now()
        setState({ data, loading: false, error: null })
      })
      .catch(err => setState({ data: null, loading: false, error: err.message }))
  }

  return { ...state, refetch }
}
