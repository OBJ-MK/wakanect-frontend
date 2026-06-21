import { useState, useEffect, useCallback } from 'react'
import { stockService } from '@/services/stockService'

export function useStock() {
  const [products, setProducts]       = useState([])
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [hasMore, setHasMore]         = useState(false)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState(null)

  useEffect(() => {
    stockService.list(1)
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.products ?? data?.rows ?? [])
        const t = data?.total ?? items.length
        setProducts(items)
        setTotal(t)
        setHasMore(data?.hasMore ?? items.length < t)
        setPage(1)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    const next = page + 1
    setLoadingMore(true)
    try {
      const data = await stockService.list(next)
      const items = Array.isArray(data) ? data : (data?.products ?? data?.rows ?? [])
      const newTotal = data?.total ?? total
      setProducts(prev => [...prev, ...items])
      setTotal(newTotal)
      setHasMore(data?.hasMore ?? false)
      setPage(next)
    } catch { /* silent */ }
    finally { setLoadingMore(false) }
  }, [loadingMore, hasMore, page, total])

  async function updateStock(id, data) {
    await stockService.updateStock(id, data)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  return { products, total, hasMore, loadMore, loading, loadingMore, error, updateStock }
}

export function usePendingProducts() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    stockService.getPending()
      .then(data => setPending(Array.isArray(data) ? data : (data?.pending ?? data?.rows ?? [])))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function applyProduct(id, data) {
    await stockService.applyPending(id, data)
    setPending(prev => prev.filter(p => p.id !== id))
  }

  async function ignoreProduct(id) {
    await stockService.ignorePending(id)
    setPending(prev => prev.filter(p => p.id !== id))
  }

  return { pending, loading, error, applyProduct, ignoreProduct }
}
