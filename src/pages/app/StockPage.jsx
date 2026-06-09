import { useState } from 'react'
import { Package, Search, Edit3, Check, X, AlertTriangle } from 'lucide-react'
import { useStock } from '@/hooks/useStock'
import { formatFCFA } from '@/lib/formatters'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const MOCK_PRODUCTS = [
  { id: '1', name: 'Robe Wax Ankara Premium', price: 25000, stock: 12, category: 'Vêtements', image_url: null },
  { id: '2', name: 'Sneakers Air Force One', price: 45000, stock: 3, category: 'Chaussures', image_url: null },
  { id: '3', name: 'Sac à main cuir véritable', price: 35000, stock: 0, category: 'Accessoires', image_url: null },
  { id: '4', name: 'Boubou grand modèle', price: 18000, stock: 8, category: 'Vêtements', image_url: null },
]

function StockRow({ product, onSave }) {
  const [editing, setEditing] = useState(false)
  const [qty, setQty] = useState(String(product.stock))
  const [price, setPrice] = useState(String(product.price))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(product.id, { stock: parseInt(qty, 10), price: parseInt(price, 10) })
    setSaving(false)
    setEditing(false)
  }

  const low = product.stock > 0 && product.stock <= 5
  const out = product.stock === 0

  return (
    <div className={cn(
      'flex items-start gap-3 px-4 py-4 border-b border-white/6 last:border-0',
      out && 'opacity-60',
    )}>
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-2xl bg-navy-light flex items-center justify-center shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <Package size={18} className="text-white/30" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-body text-white font-medium truncate">{product.name}</p>
        <p className="text-micro text-white/40 mb-2">{product.category}</p>

        {editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <label className="text-micro text-white/50">Qté</label>
              <input
                type="number"
                min="0"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="w-20 px-2 py-1 rounded-xl bg-white/10 border border-white/15 text-white text-label text-center focus:outline-none focus:border-orange"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-micro text-white/50">Prix</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-28 px-2 py-1 rounded-xl bg-white/10 border border-white/15 text-white text-label text-center focus:outline-none focus:border-orange"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 rounded-xl bg-emerald/20 text-emerald hover:bg-emerald/30 transition-colors"
              aria-label="Sauvegarder"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="p-1.5 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 transition-colors"
              aria-label="Annuler"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {low && <AlertTriangle size={12} className="text-amber" />}
              <span className={cn(
                'text-label font-semibold',
                out ? 'text-red-400' : low ? 'text-amber' : 'text-emerald',
              )}>
                {out ? 'Épuisé' : `${product.stock} en stock`}
              </span>
            </div>
            <span className="text-label text-white/40">{formatFCFA(product.price)}</span>
          </div>
        )}
      </div>

      {!editing && (
        <button
          onClick={() => setEditing(true)}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors shrink-0"
          aria-label="Modifier"
        >
          <Edit3 size={16} />
        </button>
      )}
    </div>
  )
}

export function StockPage() {
  const { products: fetchedProducts, loading, updateStock } = useStock()
  const [search, setSearch] = useState('')

  const products = fetchedProducts.length > 0 ? fetchedProducts : MOCK_PRODUCTS
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-display font-bold text-h2 text-white flex-1">Stock</h1>
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

      <div className="page-container py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Package size={32} className="text-white/20 mb-3" />
                <p className="text-body text-white/50">Aucun produit trouvé</p>
              </div>
            ) : (
              filtered.map(product => (
                <StockRow key={product.id} product={product} onSave={updateStock} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
