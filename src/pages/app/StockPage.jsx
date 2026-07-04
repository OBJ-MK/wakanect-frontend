import { useState } from 'react'
import { Package, Search, Edit3, Check, X, AlertTriangle } from 'lucide-react'
import { useStock } from '@/hooks/useStock'
import { formatFCFA } from '@/lib/formatters'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/usePermissions'
import { PERM } from '@/lib/permissions'
import { PerformedBy } from '@/components/ui/PerformedBy'

const MOCK_PRODUCTS = []

function StockRow({ product, onSave }) {
  const { ensure } = usePermissions()
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
                className="w-20 px-2 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] text-label text-center focus:outline-none focus:border-orange dark:bg-white/10 dark:border-white/15 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-micro text-white/50">Prix</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-28 px-2 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] text-label text-center focus:outline-none focus:border-orange dark:bg-white/10 dark:border-white/15 dark:text-white"
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
        {!editing && (
          <PerformedBy actor={product.performed_by} prefix="Ajouté par" className="mt-1" />
        )}
      </div>

      {!editing && (
        <button
          // Blocage dès le clic si l'employé n'a pas stock.edit
          onClick={() => ensure(PERM.STOCK_EDIT) && setEditing(true)}
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

  const products = fetchedProducts
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
          <Input
            icon={<Search size={16} />}
            type="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="py-2.5"
          />
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
