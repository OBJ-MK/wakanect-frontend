import { useState, useEffect, useCallback } from 'react'
import { orderService } from '@/services/orderService'
import { useOrderStore } from '@/store/orderStore'
import { useListCacheStore, buildListKey } from '@/store/listCacheStore'

const PAGE_SIZE = 20

export function useOrders({ search = '', status = 'Toutes', sort = '', page = 1 } = {}) {
  const { orders, setOrders, updateOrderStatus, updateOrderPayment } = useOrderStore()
  const [loading, setLoading] = useState(true)
  const [total, setTotal]     = useState(0)
  const [pages, setPages]     = useState(1)
  const [error, setError]     = useState(null)

  // Debounce search 350ms (Décision 2)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(timer)
  }, [search])

  // Clé de cache : filtres + page — une vue filtrée n'écrase jamais la vue non filtrée
  const cacheKey = buildListKey('orders', { st: status, q: debouncedSearch, s: sort, p: page })

  const fetchList = useCallback(async ({ silent = false } = {}) => {
    const cached = useListCacheStore.getState().getEntry(cacheKey)
    if (cached && !silent) {
      setOrders(cached.items)
      setTotal(cached.total)
      setPages(cached.pages)
      setLoading(false)
    } else if (!silent && !cached) {
      setLoading(true)
    }
    try {
      const data = await orderService.list(page, { status, search: debouncedSearch, sort }, PAGE_SIZE)
      const items = data?.items ?? data?.orders ?? data?.rows ?? []
      const t  = data?.total ?? items.length
      const pg = data?.pages ?? Math.max(1, Math.ceil(t / PAGE_SIZE))
      setOrders(items)
      setTotal(t)
      setPages(pg)
      useListCacheStore.getState().setEntry(cacheKey, { items, total: t, pages: pg })
      setError(null)
    } catch (e) {
      if (!silent && !useListCacheStore.getState().getEntry(cacheKey)) setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [cacheKey, page, status, debouncedSearch, sort, setOrders])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  async function changeStatus(id, newStatus) {
    await orderService.updateStatus(id, newStatus)
    updateOrderStatus(id, newStatus)
    // Le statut a changé : invalide toutes les pages commandes en cache
    useListCacheStore.getState().clearPrefix('orders|')
    fetchList({ silent: true })
  }

  async function markPaid(id) {
    await orderService.markPaid(id)
    updateOrderPayment(id)
    useListCacheStore.getState().clearPrefix('orders|')
    fetchList({ silent: true })
  }

  return { orders, loading, total, pages, error, changeStatus, markPaid }
}
