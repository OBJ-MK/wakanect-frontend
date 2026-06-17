import { useState, useEffect } from 'react'
import { orderService } from '@/services/orderService'
import { useOrderStore } from '@/store/orderStore'

export function useOrders() {
  const { orders, setOrders, updateOrderStatus, updateOrderPayment } = useOrderStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    orderService.list()
      .then(data => {
        if (!cancelled) setOrders(Array.isArray(data) ? data : (data?.rows ?? data?.orders ?? []))
      })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  async function refetchSilent() {
    try {
      const data = await orderService.list()
      setOrders(Array.isArray(data) ? data : (data?.rows ?? data?.orders ?? []))
    } catch { /* silent background sync */ }
  }

  async function changeStatus(id, status) {
    await orderService.updateStatus(id, status)
    updateOrderStatus(id, status)
    refetchSilent()
  }

  async function markPaid(id) {
    await orderService.markPaid(id)
    updateOrderPayment(id)
    refetchSilent()
  }

  return { orders, loading, error, changeStatus, markPaid }
}
