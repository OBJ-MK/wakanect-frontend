import { useState, useEffect, useCallback } from 'react'
import { orderService } from '@/services/orderService'
import { useOrderStore } from '@/store/orderStore'

export function useOrders() {
  const { orders, setOrders, updateOrderStatus, updateOrderPayment } = useOrderStore()
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]         = useState(false)
  const [page, setPage]               = useState(1)
  const [total, setTotal]             = useState(0)
  const [error, setError]             = useState(null)

  useEffect(() => {
    let cancelled = false
    orderService.list(1)
      .then(data => {
        if (cancelled) return
        const items = Array.isArray(data) ? data : (data?.orders ?? data?.rows ?? [])
        setOrders(items)
        setTotal(data?.total ?? items.length)
        setHasMore(data?.hasMore ?? false)
        setPage(1)
      })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    const next = page + 1
    setLoadingMore(true)
    try {
      const data = await orderService.list(next)
      const items = Array.isArray(data) ? data : (data?.orders ?? data?.rows ?? [])
      // useOrderStore.getState() donne la valeur courante sans risque de fermeture stale
      setOrders([...useOrderStore.getState().orders, ...items])
      setHasMore(data?.hasMore ?? false)
      setPage(next)
    } catch { /* silent */ }
    finally { setLoadingMore(false) }
  }, [loadingMore, hasMore, page, setOrders])

  async function refetchSilent() {
    try {
      const data = await orderService.list(1)
      const items = Array.isArray(data) ? data : (data?.rows ?? data?.orders ?? [])
      setOrders(items)
      setHasMore(data?.hasMore ?? false)
      setPage(1)
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

  return { orders, loading, loadingMore, hasMore, loadMore, total, error, changeStatus, markPaid }
}
