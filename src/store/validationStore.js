import { create } from 'zustand'
import { stockService } from '@/services/stockService'

export const useValidationStore = create((set, get) => ({
  pending: [],
  orphans: [],
  loading: true,
  loaded: false,
  error: null,

  fetchPending: async (force = false) => {
    if (get().loaded && !force) return
    set({ loading: true, error: null })
    try {
      const [data, orphanData] = await Promise.all([
        stockService.getPending(),
        stockService.getOrphanMedia().catch(() => []),
      ])
      set({
        pending: Array.isArray(data) ? data : (data?.pending ?? data?.rows ?? []),
        orphans: Array.isArray(orphanData) ? orphanData : [],
        loading: false,
        loaded: true,
      })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  applyProduct: async (id, data) => {
    await stockService.applyPending(id, data)
    set(state => ({ pending: state.pending.filter(p => p.id !== id) }))
  },

  ignoreProduct: async (id) => {
    await stockService.ignorePending(id)
    set(state => ({ pending: state.pending.filter(p => p.id !== id) }))
  },

  attachOrphan: async (mediaId, candidateId) => {
    const res = await stockService.attachOrphanMedia(mediaId, candidateId)
    set(state => ({
      orphans: state.orphans.filter(o => o.media_id !== mediaId),
      pending: res?.image_url
        ? state.pending.map(p => p.id === candidateId ? { ...p, images: [...(p.images || []), res.image_url] } : p)
        : state.pending,
    }))
  },

  deleteOrphan: async (mediaId) => {
    await stockService.deleteOrphanMedia(mediaId)
    set(state => ({ orphans: state.orphans.filter(o => o.media_id !== mediaId) }))
  },
}))