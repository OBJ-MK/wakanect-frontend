import { useState, useRef, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTenant } from '@/hooks/useTenant'
import { ProductGrid } from '@/components/features/catalogue/ProductGrid'
import { FilterBar } from '@/components/features/catalogue/FilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { CartFab } from '@/components/features/catalogue/CartFab'
import { CartSheet } from './CartSheet'
import { buildWhatsAppLink } from '@/lib/utils'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

const DEFAULT_FILTERS = { search: '', category: 'Tout', priceMin: '', priceMax: '', sort: 'recent' }

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl bg-white dark:bg-navy overflow-hidden border border-[var(--border-default)] animate-pulse">
      <div className="aspect-square bg-cream-dark dark:bg-navy-light" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-navy/10 dark:bg-white/10 rounded w-full" />
        <div className="h-4 bg-navy/10 dark:bg-white/10 rounded w-2/3" />
        <div className="h-8 bg-navy/8 dark:bg-white/8 rounded-xl mt-1" />
      </div>
    </div>
  )
}

export function CataloguePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [categoryOptions, setCategoryOptions] = useState(['Tout'])
  const [cartOpen, setCartOpen] = useState(false)
  const gridRef = useRef(null)

  const isFiltered =
    filters.search.trim() !== '' || filters.category !== 'Tout' ||
    filters.priceMin !== '' || filters.priceMax !== ''

  const { boutique, products, total, pages, loading, error } = useTenant({ ...filters, page })

  // Fige les catégories à partir du premier fetch sans filtre (Décision 1)
  useEffect(() => {
    if (!isFiltered && page === 1 && products.length > 0 && categoryOptions.length === 1) {
      setCategoryOptions(['Tout', ...new Set(products.map(p => p.category).filter(Boolean))])
    }
  }, [products]) // eslint-disable-line react-hooks/exhaustive-deps

  // Tout changement de filtre repart en page 1 — uniquement setState → fetch → re-render
  function updateFilters(partial) {
    setFilters(prev => ({ ...prev, ...partial }))
    setPage(1)
  }

  // Scroll doux vers le haut de la GRILLE (pas de la page)
  function changePage(n) {
    setPage(n)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Premier chargement : squelette pleine page tant que la boutique est inconnue
  if (loading && !boutique) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
          <div className="max-w-lg mx-auto animate-pulse">
            <div className="h-6 w-36 bg-navy/10 dark:bg-white/10 rounded mb-1" />
            <div className="h-3 w-20 bg-navy/8 dark:bg-white/8 rounded" />
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  if (error && !boutique) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-h3 font-display font-bold text-navy">Boutique introuvable</p>
        <p className="text-body text-navy/60">Vérifiez le lien ou contactez le commerçant.</p>
      </div>
    )
  }

  const waLink = boutique?.whatsapp_number
    ? buildWhatsAppLink(boutique.whatsapp_number, `Bonjour, j'ai une question sur votre boutique ${boutique.shop_name}.`)
    : null

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          {/* Logo boutique — rond, fallback initiale sur fond navy */}
          {boutique?.logo_url ? (
            <img
              src={boutique.logo_url}
              alt={`Logo ${boutique?.shop_name || 'boutique'}`}
              className="h-9 w-9 rounded-full object-cover shrink-0 border border-navy/8 dark:border-white/10"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-navy flex items-center justify-center shrink-0">
              <span className="text-white text-label font-bold uppercase">
                {boutique?.shop_name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-h3 text-navy dark:text-white truncate">
              {boutique?.shop_name}
            </p>
            <p className="text-micro text-navy/50 dark:text-white/40">
              {total > 0 ? `${total} produits` : `${products.length} produits`}
            </p>
          </div>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-wa-green text-white text-label font-semibold shrink-0 hover:bg-green-500 active:scale-95 transition-all"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Barre de filtres — recherche débouncée, catégories figées, prix, tri */}
        <FilterBar
          filters={filters}
          onChange={updateFilters}
          onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1) }}
          categories={categoryOptions}
          total={loading ? null : total}
        />

        {/* Product grid — résultats server-side, seule la section liste se recharge */}
        <div ref={gridRef} className="scroll-mt-24">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>

        <Pagination page={page} pages={pages} onChange={changePage} />
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <a
          href="https://wakanect.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-micro text-navy/30 dark:text-white/20 hover:text-navy/50 dark:hover:text-white/40 transition-colors"
        >
          Propulsé par <WakanectLogo variant="mark" className="h-4 w-4 opacity-40" />
        </a>
      </div>

      <CartFab onOpen={() => setCartOpen(true)} />
      <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
