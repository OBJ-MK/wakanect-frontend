import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      merchant: null,
      isAuthenticated: false,

      login: (token, merchant) => set({ token, merchant, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('waka_token')
        set({ token: null, merchant: null, isAuthenticated: false })
      },
      setMerchant: (merchant) => set({ merchant }),
    }),
    {
      name: 'waka-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          localStorage.setItem('waka_token', state.token)
        }
      },
    }
  )
)
