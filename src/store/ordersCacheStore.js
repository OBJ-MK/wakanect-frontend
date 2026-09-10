import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_ENTRIES = 20
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000 // 90 jours

function isFresh(order) {
  return Date.now() - new Date(order.createdAt).getTime() < MAX_AGE_MS
}

export const useOrdersCacheStore = create(
  persist(
    (set, get) => ({
      orders: [], // { trackingCode, orderNumber, slug, shopName, total, createdAt }

      addOrder: (order) => set(state => ({
        orders: [order, ...state.orders.filter(isFresh)].slice(0, MAX_ENTRIES),
      })),

      getOrdersForSlug: (slug) => get().orders.filter(o => o.slug === slug && isFresh(o)),
    }),
    { name: 'waka_orders_cache' }
  )
)