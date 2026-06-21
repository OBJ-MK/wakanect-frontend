import { useState, useEffect } from 'react'
import { api } from '@/services/api'

// Cache module-level : toutes les instances du hook partagent la même réponse
// (évite N requêtes HTTP quand Hero + Pricing + Faq + FinalCta appellent usePlans).
let _cache    = null
let _cacheAt  = 0
const CACHE_TTL = 60_000

/**
 * Lit le pays du visiteur depuis l'edge Cloudflare (/geo) quand l'utilisateur
 * n'est PAS connecté. Pour les connectés, le backend dérive le pays depuis le
 * numéro de téléphone du marchand stocké dans le JWT → /geo non appelé.
 * Retourne null si connecté (le backend prend la main), 'SN'|'ML' sinon.
 */
async function detectCountry() {
  if (localStorage.getItem('waka_token')) return null  // backend résout depuis le token
  try {
    const r = await fetch('/geo')
    if (!r.ok) return 'SN'
    const { country } = await r.json()
    return country === 'ML' ? 'ML' : 'SN'
  } catch {
    return 'SN'
  }
}

function planUrl(country) {
  return country ? `/api/plans?country=${country}` : '/api/plans'
}

/**
 * Charge GET /api/plans et retourne { data, loading, error, refetch }.
 * data = { country, currency, plans, trial: { days, scans }, discounts }
 *
 * Anonyme  → pays lu depuis /geo (CF-IPCountry), transmis via ?country=
 * Connecté → pays déduit du téléphone marchand par le backend (token JWT)
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
    detectCountry()
      .then(country => api.get(planUrl(country)))
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
    detectCountry()
      .then(country => api.get(planUrl(country)))
      .then(data => {
        _cache   = data
        _cacheAt = Date.now()
        setState({ data, loading: false, error: null })
      })
      .catch(err => setState({ data: null, loading: false, error: err.message }))
  }

  return { ...state, refetch }
}
