import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { catalogueService } from '@/services/catalogueService'
import { useCatalogueStore } from '@/store/catalogueStore'
import { useListCacheStore, buildListKey } from '@/store/listCacheStore'

const PAGE_SIZE = 20

export function useTenant({
  category = 'Tout',
  search = '',
  priceMin = '',
  priceMax = '',
  sort = '',
  page = 1,
} = {}) {
  const { slug } = useParams()
  const setBoutique = useCatalogueStore(s => s.setBoutique)

  // Debounce search 350ms (Décision 2)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(timer)
  }, [search])

  // Clé de cache : slug + filtres + page — une vue filtrée n'écrase jamais le cache non filtré
  const cacheKey = buildListKey('boutique', {
    slug, c: category, q: debouncedSearch, min: priceMin, max: priceMax, s: sort, p: page,
  })

  // Lazy initializers : lit le cache synchroniquement sur le premier rendu
  const [boutiqueMeta, setBoutiqueMeta] = useState(
    () => useListCacheStore.getState().getEntry(cacheKey)?.boutique ?? null
  )
  const [products, setProducts] = useState(
    () => useListCacheStore.getState().getEntry(cacheKey)?.items ?? []
  )
  const [total, setTotal] = useState(
    () => useListCacheStore.getState().getEntry(cacheKey)?.total ?? 0
  )
  const [pages, setPages] = useState(
    () => useListCacheStore.getState().getEntry(cacheKey)?.pages ?? 1
  )
  const [loading, setLoading] = useState(
    () => !useListCacheStore.getState().getEntry(cacheKey)
  )
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    const cached = useListCacheStore.getState().getEntry(cacheKey)
    if (cached) {
      setBoutiqueMeta(cached.boutique)
      setProducts(cached.items)
      setTotal(cached.total)
      setPages(cached.pages)
      setBoutique({ ...cached.boutique, products: cached.items })
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const filters = {}
    if (category !== 'Tout') filters.category = category
    if (debouncedSearch.trim()) filters.search = debouncedSearch.trim()
    if (priceMin !== '') filters.priceMin = priceMin
    if (priceMax !== '') filters.priceMax = priceMax
    if (sort) filters.sort = sort

    catalogueService.getBoutique(slug, page, PAGE_SIZE, filters)
      .then(data => {
        if (cancelled) return
        const {
          items, products: legacyProducts,
          total: t = 0, pages: pg = 1,
          page: _page, hasMore: _hasMore,
          ...shopMeta
        } = data
        const p = items ?? legacyProducts ?? []
        setBoutiqueMeta(shopMeta)
        setProducts(p)
        setTotal(t)
        setPages(pg)
        setBoutique({ ...shopMeta, products: p })
        useListCacheStore.getState().setEntry(cacheKey, { boutique: shopMeta, items: p, total: t, pages: pg })
      })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [slug, cacheKey, page, category, debouncedSearch, priceMin, priceMax, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  const boutique = boutiqueMeta ? { ...boutiqueMeta, products } : null

  return { boutique, products, total, pages, loading, error, slug }
}
