import { create } from 'zustand'

export const useTenantStore = create((set) => ({
  slug: null,
  boutique: null,
  setSlug: (slug) => set({ slug }),
  setBoutique: (boutique) => set({ boutique }),
}))
