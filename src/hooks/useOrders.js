import { useState, useEffect } from 'react'
import { orderService } from '@/services/orderService'
import { useOrderStore } from '@/store/orderStore'

export function useOrders() {
  const { orders, setOrders, updateOrderStatus } = useOrderStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    orderService.list()
      .then(setOrders)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function changeStatus(id, status) {
    await orderService.updateStatus(id, status)
    updateOrderStatus(id, status)
  }

  return { orders, loading, error, changeStatus }
}
