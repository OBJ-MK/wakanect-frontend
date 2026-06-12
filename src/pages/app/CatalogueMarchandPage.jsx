import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit3, LayoutGrid, AlertTriangle, Package, Search } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const MOCK_PRODUCTS = [
  { id: '1', name: 'Robe Wax Ankara Premium', price: 25000, stock: 12, category: 'Vêtements', images: [] },
  { id: '2', name: 'Sneakers Air Force One', price: 45000, stock: 3, category: 'Chaussures', images: [] },
  { id: '3', name: 'Sac à main cuir véritable', price: 35000, stock: 0, category: 'Accessoires', images: [] },
  { id: '4', name: 'Boubou grand modèle', price: 18000, stock: 8, category: 'Vêtements', images: [] },
  { id: '5', name: 'Sandales cuir tressé', price: 12000, stock: 15, category: 'Chaussures', images: [] },
  { id: '6', name: 'Pochette tissu wax', price: 8000, stock: 20, category: 'Accessoires', images: [] },
]

function ProductCard({ product }) {
  const lowStock = product.stock > 0 && product.stock <= 5
  const outOfStock = product.stock === 0

  return (
    <div className={cn(
      'glass rounded-3xl overflow-hidden flex flex-col',
      outOfStock && 'opacity-60',
    )}>
      {/* Photo zone — min 2 photos indicated */}
      <div className="relative bg-navy-light aspect-square flex items-center justify-center">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
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

        {/* Stock badge */}
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
  const [search, setSearch] = useState('')
  const products = []
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
        {filtered.length === 0 ? (
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
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
