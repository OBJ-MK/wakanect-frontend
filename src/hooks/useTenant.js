import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { catalogueService } from '@/services/catalogueService'
import { useCatalogueStore } from '@/store/catalogueStore'

/**
 * Charge la boutique publique en mode infinite scroll.
 * Page 1 → meta boutique + premiers produits.
 * loadMore() → produits suivants accumulés dans `products`.
 */
export function useTenant() {
  const { slug } = useParams()
  const { setBoutique } = useCatalogueStore()

  const [boutiqueMeta, setBoutiqueMeta] = useState(null)
  const [products, setProducts]         = useState([])
  const [page, setPage]                 = useState(1)
  const [total, setTotal]               = useState(0)
  const [hasMore, setHasMore]           = useState(false)
  const [loading, setLoading]           = useState(true)
  const [loadingMore, setLoadingMore]   = useState(false)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (!slug) return
    // Réinitialise l'état quand le slug change (navigation inter-boutiques)
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
        // Le store a besoin de slug + meta pour la navigation du panier
        setBoutique({ ...shopMeta, products: p })
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
    } catch { /* ignore — l'utilisateur peut réessayer en scrollant */ }
    finally { setLoadingMore(false) }
  }, [loadingMore, hasMore, slug, page])

  // Recompose la boutique avec les produits accumulés (compatibilité avec les consumers)
  const boutique = boutiqueMeta ? { ...boutiqueMeta, products } : null

  return { boutique, products, total, hasMore, loadMore, loading, loadingMore, error, slug }
}
