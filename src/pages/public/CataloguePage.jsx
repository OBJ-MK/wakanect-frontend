import { useState, useRef, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { useTenant } from '@/hooks/useTenant'
import { ProductGrid } from '@/components/features/catalogue/ProductGrid'
import { FilterChips } from '@/components/features/catalogue/FilterChips'
import { CartFab } from '@/components/features/catalogue/CartFab'
import { CartSheet } from './CartSheet'
import { buildWhatsAppLink } from '@/lib/utils'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

// Skeleton d'une carte produit — donne une perception de contenu immédiat
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
  const { boutique, products, total, hasMore, loadMore, loading, loadingMore, error } = useTenant()
  const [activeCategory, setActiveCategory] = useState('Tout')
  const [cartOpen, setCartOpen]             = useState(false)
  const sentinelRef = useRef(null)

  // Infinite scroll : déclenche loadMore quand la sentinelle entre dans le viewport
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loadingMore) loadMore() },
      { rootMargin: '300px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loadMore, loadingMore])

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-h3 font-display font-bold text-navy">Boutique introuvable</p>
        <p className="text-body text-navy/60">Vérifiez le lien ou contactez le commerçant.</p>
      </div>
    )
  }

  const categories = ['Tout', ...new Set(products.map(p => p.category).filter(Boolean))]

  const displayedProducts = activeCategory === 'Tout'
    ? products
    : products.filter(p => p.category === activeCategory)

  const waLink = boutique?.whatsapp_number
    ? buildWhatsAppLink(boutique.whatsapp_number, `Bonjour, j'ai une question sur votre boutique ${boutique.shop_name}.`)
    : null

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
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
        {/* Category filter */}
        <FilterChips
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Product grid */}
        <ProductGrid products={displayedProducts} />

        {/* Sentinelle pour l'infinite scroll — invisible, déclenchée par l'IntersectionObserver */}
        <div ref={sentinelRef} />

        {/* Spinner de chargement suivant — n'apparaît qu'après le premier rendu */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
          </div>
        )}
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

      {/* Cart FAB */}
      <CartFab onOpen={() => setCartOpen(true)} />

      {/* Cart sheet */}
      <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
