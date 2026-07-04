import { useState, useEffect } from 'react'
import { api } from '@/services/api'

// Cache module-level par clé pays : toutes les instances du hook partagent la
// même réponse (évite N requêtes HTTP quand Hero + Pricing + Faq + FinalCta
// appellent usePlans).
const _cache = new Map() // cacheKey → { data, at }
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
 * options.country → force le pays (ex: 'SN' sur la landing page)
 * Sinon :
 *   Anonyme  → pays lu depuis /geo (CF-IPCountry), transmis via ?country=
 *   Connecté → pays déduit du téléphone marchand par le backend (token JWT)
 */
export function usePlans({ country: forcedCountry } = {}) {
  const cacheKey = forcedCountry ?? 'auto'
  const [state, setState] = useState(() => {
    const cached = _cache.get(cacheKey)
    return {
      data:    cached?.data ?? null,
      loading: !cached,
      error:   null,
    }
  })

  function load() {
    setState(s => ({ ...s, loading: true, error: null }))
    const resolve = forcedCountry ? Promise.resolve(forcedCountry) : detectCountry()
    resolve
      .then(country => api.get(planUrl(country)))
      .then(data => {
        _cache.set(cacheKey, { data, at: Date.now() })
        setState({ data, loading: false, error: null })
      })
      .catch(err => setState({ data: null, loading: false, error: err.message }))
  }

  useEffect(() => {
    const cached = _cache.get(cacheKey)
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      setState({ data: cached.data, loading: false, error: null })
      return
    }
    load()
  }, [cacheKey]) // eslint-disable-line react-hooks/exhaustive-deps

  function refetch() {
    _cache.delete(cacheKey)
    setState({ data: null, loading: true, error: null })
    load()
  }

  return { ...state, refetch }
}
