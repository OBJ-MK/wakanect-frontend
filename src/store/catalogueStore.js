import { create } from 'zustand'

export const useCatalogueStore = create((set, get) => ({
  cart: [],
  boutique: null,

  setBoutique: (boutique) => set({ boutique }),

  addToCart: (product, selectedColor = null, quantity = 1) => {
    const cart = get().cart
    const key = `${product.id}-${selectedColor}`
    const existing = cart.find(i => i.key === key)
    if (existing) {
      set({
        cart: cart.map(i =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        ),
      })
    } else {
      set({ cart: [...cart, { ...product, key, selectedColor, quantity }] })
    }
  },

  removeFromCart: (key) => set({ cart: get().cart.filter(i => i.key !== key) }),

  updateQty: (key, quantity) => {
    if (quantity <= 0) {
      set({ cart: get().cart.filter(i => i.key !== key) })
    } else {
      set({ cart: get().cart.map(i => i.key === key ? { ...i, quantity } : i) })
    }
  },

  clearCart: () => set({ cart: [] }),

  get cartCount() {
    return get().cart.reduce((sum, i) => sum + i.quantity, 0)
  },

  get cartTotal() {
    return get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },
}))
