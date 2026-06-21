import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit3, LayoutGrid, AlertTriangle, Package, Search } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { useStock } from '@/hooks/useStock'
import { FilterChips } from '@/components/features/catalogue/FilterChips'

function ProductCardSkeleton() {
  return (
    <div className="glass rounded-3xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-square bg-navy-light" />
      <div className="p-3 flex flex-col gap-1.5">
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const lowStock  = product.stock > 0 && product.stock <= 5
  const outOfStock = product.stock === 0
  const thumb = product.images?.[0] ?? product.image_url ?? null

  return (
    <div className={cn(
      'glass rounded-3xl overflow-hidden flex flex-col',
      outOfStock && 'opacity-60',
    )}>
      <div className="relative bg-navy-light aspect-square flex items-center justify-center">
        {thumb ? (
          <img
            src={thumb}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <Package size={28} />
            <span className="text-micro">Aucune photo</span>
          </div>
        )}

        {/* Edit button overlay */}
        <Link
          to={`/app/catalogue/${product.id}/modifier`}
          className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-navy/70 backdrop-blur-glass flex items-center justify-center text-white/70 hover:text-white hover:bg-navy/90 active:scale-95 transition-all"
          aria-label="Modifier"
        >
          <Edit3 size={14} />
        </Link>

        {lowStock && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber/20 backdrop-blur-xs">
            <AlertTriangle size={10} className="text-amber" />
            <span className="text-[10px] font-semibold text-amber">Stock bas</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-red-500/20 backdrop-blur-xs">
            <span className="text-[10px] font-semibold text-red-400">Épuisé</span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1">
        <p className="text-label font-semibold text-white leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between">
          <p className="text-body font-bold text-amber">{formatFCFA(product.price)}</p>
          <p className={cn(
            'text-micro',
            outOfStock ? 'text-red-400' : lowStock ? 'text-amber' : 'text-white/40',
          )}>
            {outOfStock ? 'Épuisé' : `${product.stock} en stock`}
          </p>
        </div>
      </div>
    </div>
  )
}

export function CatalogueMarchandPage() {
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState('Tout')
  const { products, total, hasMore, loadMore, loading, loadingMore } = useStock()

  const categories = ['Tout', ...new Set(products.map(p => p.category).filter(Boolean))]

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = activeCategory === 'Tout' || p.category === activeCategory
    return matchSearch && matchCat
  })

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 flex-1">
              <LayoutGrid size={18} className="text-orange" />
              <h1 className="font-display font-bold text-h2 text-white">Mon catalogue</h1>
              {total > 0 && (
                <span className="text-micro text-white/40">({total})</span>
              )}
            </div>
            <Link
              to="/app/catalogue/ajouter"
              className="w-9 h-9 rounded-2xl bg-orange flex items-center justify-center text-white hover:bg-orange-hi active:scale-95 transition-all shadow-orange-glow"
              aria-label="Ajouter un produit"
            >
              <Plus size={18} />
            </Link>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder:text-white/35 text-body focus:outline-none focus:border-orange/50"
            />
          </div>
        </div>
      </div>

      <div className="page-container py-4 flex flex-col gap-4">
        {/* Filtre catégorie */}
        {categories.length > 1 && (
          <FilterChips
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        )}

        {/* Stock bas quick link */}
        {lowStockCount > 0 && (
          <Link
            to="/app/stock-bas"
            className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5 border border-amber/20 hover:bg-amber/8 transition-colors"
          >
            <AlertTriangle size={15} className="text-amber" />
            <p className="text-label text-white flex-1">
              <span className="font-semibold">{lowStockCount} produit{lowStockCount > 1 ? 's' : ''}</span> en stock bas — Voir
            </p>
          </Link>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Package size={28} className="text-white/20" />
            </div>
            {search ? (
              <>
                <p className="text-body font-semibold text-white/60">Aucun produit trouvé</p>
                <p className="text-label text-white/35 mt-1">Essayez un autre terme de recherche</p>
              </>
            ) : (
              <>
                <p className="text-body font-semibold text-white/60">Votre catalogue est vide</p>
                <p className="text-label text-white/35 mt-1">Transférez un message WhatsApp pour ajouter un produit</p>
                <Link
                  to="/app/catalogue/ajouter"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange text-white text-label font-semibold hover:bg-orange-hi active:scale-95 transition-all"
                >
                  <Plus size={15} />
                  Ajouter manuellement
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Load more — n'apparaît que si des produits non encore chargés existent */}
            {hasMore && !search && activeCategory === 'Tout' && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-3 rounded-2xl glass border border-white/10 text-label text-white/60 hover:text-white hover:border-orange/40 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
                    Chargement…
                  </span>
                ) : (
                  `Voir plus (${total - products.length} restants)`
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
