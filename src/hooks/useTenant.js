import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { catalogueService } from '@/services/catalogueService'
import { useCatalogueStore } from '@/store/catalogueStore'

export function useTenant() {
  const { slug } = useParams()
  const setBoutique = useCatalogueStore(s => s.setBoutique)
  const setBoutiqueCache = useCatalogueStore(s => s.setBoutiqueCache)

  // Lazy initializers : lit le cache Zustand synchroniquement sur le premier rendu.
  // Résultat : retour sur une page déjà visitée = données dispo immédiatement, loading=false.
  const [boutiqueMeta, setBoutiqueMeta] = useState(
    () => useCatalogueStore.getState().boutiqueCache[slug]?.boutique ?? null
  )
  const [products, setProducts] = useState(
    () => useCatalogueStore.getState().boutiqueCache[slug]?.products ?? []
  )
  const [page, setPage] = useState(
    () => useCatalogueStore.getState().boutiqueCache[slug]?.page ?? 1
  )
  const [total, setTotal] = useState(
    () => useCatalogueStore.getState().boutiqueCache[slug]?.total ?? 0
  )
  const [hasMore, setHasMore] = useState(
    () => useCatalogueStore.getState().boutiqueCache[slug]?.hasMore ?? false
  )
  const [loading, setLoading] = useState(
    () => !useCatalogueStore.getState().boutiqueCache[slug]
  )
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    const cached = useCatalogueStore.getState().boutiqueCache[slug]
    if (cached) {
      // Cache hit — restaure l'état local et met à jour le store (nécessaire pour ProductCard.slug)
      setBoutiqueMeta(cached.boutique)
      setProducts(cached.products)
      setTotal(cached.total)
      setHasMore(cached.hasMore)
      setPage(cached.page)
      setBoutique({ ...cached.boutique, products: cached.products })
      setLoading(false)
      setError(null)
      return
    }

    // Cache miss — fetch réseau
    setLoading(true)
    setError(null)
    setProducts([])
    setPage(1)
    setHasMore(false)

    catalogueService.getBoutique(slug, 1)
      .then(data => {
        const { products: p = [], total: t = 0, hasMore: h = false, ...shopMeta } = data
        setBoutiqueMeta(shopMeta)
        setProducts(p)
        setTotal(t)
        setHasMore(h)
        setPage(1)
        setBoutique({ ...shopMeta, products: p })
        setBoutiqueCache(slug, { boutique: shopMeta, products: p, total: t, hasMore: h, page: 1 })
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !slug) return
    const nextPage = page + 1
    setLoadingMore(true)
    try {
      const data = await catalogueService.getBoutique(slug, nextPage)
      const newProds = data.products ?? []
      setProducts(prev => [...prev, ...newProds])
      setHasMore(data.hasMore ?? false)
      setPage(nextPage)
    } catch { /* ignore — scroll retry */ }
    finally { setLoadingMore(false) }
  }, [loadingMore, hasMore, slug, page])

  const boutique = boutiqueMeta ? { ...boutiqueMeta, products } : null

  return { boutique, products, total, hasMore, loadMore, loading, loadingMore, error, slug }
}
