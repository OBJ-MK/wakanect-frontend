import { create } from 'zustand'
import { stockService } from '@/services/stockService'

const STALE_MS = 30 * 1000

// Cache module-level partagé : Sidebar + BottomNav montent en même temps sous
// AppShell et lisent tous les deux ce store — un seul appel réseau part au
// lieu de deux, grâce à la déduplication sur _inFlight.
export const useSummaryStore = create((set, get) => ({
  summary: null,
  loading: false,
  error: null,
  fetchedAt: 0,
  _inFlight: null,

  fetchSummary: (force = false) => {
    const state = get()
    if (!force && state.summary && Date.now() - state.fetchedAt < STALE_MS) {
      return Promise.resolve(state.summary)
    }
    if (state._inFlight) return state._inFlight

    set({ loading: true, error: null })
    const promise = stockService.getDashboardSummary()
      .then((data) => {
        set({ summary: data, loading: false, fetchedAt: Date.now(), _inFlight: null })
        return data
      })
      .catch((err) => {
        set({ error: err.message, loading: false, _inFlight: null })
        throw err
      })
    set({ _inFlight: promise })
    return promise
  },
}))
