import { create } from 'zustand'

export const useOrderStore = create((set) => ({
  orders: [],
  selectedOrder: null,

  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map(o => o.id === id ? { ...o, status } : o),
      selectedOrder: state.selectedOrder?.id === id
        ? { ...state.selectedOrder, status }
        : state.selectedOrder,
    })),
}))
