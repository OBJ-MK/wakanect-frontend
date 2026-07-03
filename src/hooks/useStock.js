import { useState, useEffect } from 'react'
import { stockService } from '@/services/stockService'
import { useListCacheStore, buildListKey } from '@/store/listCacheStore'

export function useStock({
  category = '',
  search = '',
  priceMin = '',
  priceMax = '',
  sort = '',
  page = 1,
  limit = 50,
} = {}) {
  const [products, setProducts] = useState([])
  const [total, setTotal]       = useState(0)
  const [pages, setPages]       = useState(1)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // Debounce search 350ms (Décision 2)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(timer)
  }, [search])

  // Clé de cache : filtres + page — une vue filtrée n'écrase jamais la vue non filtrée
  const cacheKey = buildListKey('products', {
    c: category, q: debouncedSearch, min: priceMin, max: priceMax, s: sort, l: limit, p: page,
  })

  useEffect(() => {
    let cancelled = false

    // Stale-while-revalidate : sert le cache immédiatement, revalide en arrière-plan
    const cached = useListCacheStore.getState().getEntry(cacheKey)
    if (cached) {
      setProducts(cached.items)
      setTotal(cached.total)
      setPages(cached.pages)
      setLoading(false)
    } else {
      setLoading(true)
    }
    setError(null)

    stockService.list(page, { category, search: debouncedSearch, priceMin, priceMax, sort }, limit)
      .then(data => {
        if (cancelled) return
        const items = data?.items ?? data?.products ?? data?.rows ?? []
        const t  = data?.total ?? items.length
        const pg = data?.pages ?? Math.max(1, Math.ceil(t / limit))
        setProducts(items)
        setTotal(t)
        setPages(pg)
        useListCacheStore.getState().setEntry(cacheKey, { items, total: t, pages: pg })
      })
      .catch(e => { if (!cancelled && !cached) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [cacheKey, page, limit, category, debouncedSearch, priceMin, priceMax, sort])

  async function updateStock(id, data) {
    await stockService.updateStock(id, data)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    // Le stock a changé : invalide toutes les pages produits en cache
    useListCacheStore.getState().clearPrefix('products|')
  }

  return { products, total, pages, loading, error, updateStock }
}

export function usePendingProducts() {
  const [pending, setPending] = useState([])
  const [orphans, setOrphans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    Promise.all([
      stockService.getPending(),
      // Images ambiguës "à rattacher" — absence d'orphelins ne doit jamais bloquer la file
      stockService.getOrphanMedia().catch(() => []),
    ])
      .then(([data, orphanData]) => {
        setPending(Array.isArray(data) ? data : (data?.pending ?? data?.rows ?? []))
        setOrphans(Array.isArray(orphanData) ? orphanData : [])
      })
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

  // Résout une ambiguïté : l'image orpheline rejoint le candidat choisi
  async function attachOrphan(mediaId, candidateId) {
    const res = await stockService.attachOrphanMedia(mediaId, candidateId)
    setOrphans(prev => prev.filter(o => o.media_id !== mediaId))
    if (res?.image_url) {
      setPending(prev => prev.map(p =>
        p.id === candidateId ? { ...p, images: [...(p.images || []), res.image_url] } : p
      ))
    }
  }

  return { pending, orphans, loading, error, applyProduct, ignoreProduct, attachOrphan }
}
