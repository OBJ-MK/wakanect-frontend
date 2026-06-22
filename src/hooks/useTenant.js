import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { catalogueService } from '@/services/catalogueService'
import { useCatalogueStore } from '@/store/catalogueStore'

export function useTenant({ category = 'Tout', search = '' } = {}) {
  const { slug } = useParams()
  const setBoutique = useCatalogueStore(s => s.setBoutique)
  const setBoutiqueCache = useCatalogueStore(s => s.setBoutiqueCache)

  const isFiltered = category !== 'Tout' || search.trim() !== ''

  // Lazy initializers : lit le cache synchroniquement sur le premier rendu (seulement sans filtre).
  const [boutiqueMeta, setBoutiqueMeta] = useState(
    () => useCatalogueStore.getState().boutiqueCache[slug]?.boutique ?? null
  )
  const [products, setProducts] = useState(
    () => isFiltered ? [] : (useCatalogueStore.getState().boutiqueCache[slug]?.products ?? [])
  )
  const [page, setPage] = useState(
    () => isFiltered ? 1 : (useCatalogueStore.getState().boutiqueCache[slug]?.page ?? 1)
  )
  const [total, setTotal] = useState(
    () => isFiltered ? 0 : (useCatalogueStore.getState().boutiqueCache[slug]?.total ?? 0)
  )
  const [hasMore, setHasMore] = useState(
    () => isFiltered ? false : (useCatalogueStore.getState().boutiqueCache[slug]?.hasMore ?? false)
  )
  const [loading, setLoading] = useState(
    () => isFiltered || !useCatalogueStore.getState().boutiqueCache[slug]
  )
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    // Cache hit uniquement pour la vue sans filtre — évite qu'une vue filtrée écrase le cache
    if (!isFiltered) {
      const cached = useCatalogueStore.getState().boutiqueCache[slug]
      if (cached) {
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
    }

    setLoading(true)
    setError(null)
    setProducts([])
    setPage(1)
    setHasMore(false)

    const filters = {}
    if (category !== 'Tout') filters.category = category
    if (search.trim()) filters.search = search.trim()

    catalogueService.getBoutique(slug, 1, 24, filters)
      .then(data => {
        const { products: p = [], total: t = 0, hasMore: h = false, ...shopMeta } = data
        setBoutiqueMeta(shopMeta)
        setProducts(p)
        setTotal(t)
        setHasMore(h)
        setPage(1)
        setBoutique({ ...shopMeta, products: p })
        // N'écrit en cache que la vue sans filtre
        if (!isFiltered) {
          setBoutiqueCache(slug, { boutique: shopMeta, products: p, total: t, hasMore: h, page: 1 })
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug, category, search]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !slug) return
    const nextPage = page + 1
    setLoadingMore(true)
    try {
      const filters = {}
      if (category !== 'Tout') filters.category = category
      if (search.trim()) filters.search = search.trim()

      const data = await catalogueService.getBoutique(slug, nextPage, 24, filters)
      const newProds = data.products ?? []
      setProducts(prev => [...prev, ...newProds])
      setHasMore(data.hasMore ?? false)
      setPage(nextPage)
    } catch { /* ignore — scroll retry */ }
    finally { setLoadingMore(false) }
  }, [loadingMore, hasMore, slug, page, category, search])

  const boutique = boutiqueMeta ? { ...boutiqueMeta, products } : null

  return { boutique, products, total, hasMore, loadMore, loading, loadingMore, error, slug }
}
