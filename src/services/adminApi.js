import { api } from './api'

const BASE = import.meta.env.VITE_API_URL || 'https://api.wakanect.com'

export const adminApi = {
  // ── Écran 1 · Vue d'ensemble ──────────────────────────────────────────────
  overview: (range = '7d') =>
    api.get(`/api/admin/overview?range=${range}`),

  // ── Écran 2 · Parsing & Haiku ─────────────────────────────────────────────
  parsingFunnel: (range = '7d') =>
    api.get(`/api/admin/parsing/funnel?range=${range}`),

  // ── Écran 3 · Journal de parsing ─────────────────────────────────────────
  parsingTop: (range = '7d') =>
    api.get(`/api/admin/parsing/top?range=${range}`),

  parsingEvents: (cursor = null, limit = 50) => {
    const params = new URLSearchParams({ limit: String(limit) })
    if (cursor) params.set('cursor', cursor)
    return api.get(`/api/admin/parsing/events?${params}`)
  },

  parsingEventsCSVUrl: () =>
    `${BASE}/api/admin/parsing/events.csv`,

  // ── Écran 4 · Boutiques ───────────────────────────────────────────────────
  boutiques: ({ country = '', plan = '', status = '', q = '' } = {}) => {
    const params = new URLSearchParams()
    if (country) params.set('country', country)
    if (plan)    params.set('plan', plan)
    if (status)  params.set('status', status)
    if (q)       params.set('q', q)
    const qs = params.toString()
    return api.get(`/api/admin/boutiques${qs ? `?${qs}` : ''}`)
  },

  // ── Écran 5 · Fiche boutique ──────────────────────────────────────────────
  boutique: (slug) =>
    api.get(`/api/admin/boutiques/${slug}`),

  suspend: (id) =>
    api.post(`/api/admin/boutiques/${id}/suspend`),

  extendTrial: (id) =>
    api.post(`/api/admin/boutiques/${id}/extend-trial`),

  changePlan: (id, plan) =>
    api.post(`/api/admin/boutiques/${id}/change-plan`, { plan }),

  resetPassword: (id) =>
    api.post(`/api/admin/boutiques/${id}/reset-password`),

  impersonate: (id) =>
    api.post(`/api/admin/boutiques/${id}/impersonate`),

  // ── Écran 6 · Employés ───────────────────────────────────────────────────
  employes: (q = '') =>
    api.get(`/api/admin/employes${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  // ── Écran 7 · Abonnements ────────────────────────────────────────────────
  abonnements: (range = '30d') =>
    api.get(`/api/admin/abonnements?range=${range}`),

  // ── Écran 8 · Santé ──────────────────────────────────────────────────────
  sante: () =>
    api.get('/api/admin/sante'),

  // ── Écran 9 · Audit ──────────────────────────────────────────────────────
  audit: (scope = 'all') =>
    api.get(`/api/admin/audit?scope=${scope}`),

  // ── Plans tarifaires ─────────────────────────────────────────────────────
  plans: () =>
    api.get('/api/admin/plans'),

  updatePlan: (planKey, data) =>
    api.patch(`/api/admin/plans/${planKey}`, data),
}
