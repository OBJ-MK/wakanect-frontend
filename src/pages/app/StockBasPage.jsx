import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Package, Plus, Minus, Loader2, Check } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { stockService } from '@/services/stockService'

function StockRow({ product, qty, onChange }) {
  const dirty = qty !== product.stock

  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/6 last:border-0">
      <div className="w-12 h-12 rounded-2xl bg-navy-light flex items-center justify-center shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <Package size={18} className="text-white/30" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-body text-white font-medium truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <AlertTriangle size={11} className="text-amber" />
          <span className="text-micro text-amber font-semibold">Stock bas</span>
          <span className="text-micro text-white/35">{formatFCFA(product.price)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onChange(product.id, Math.max(0, qty - 1))}
          className="w-7 h-7 rounded-xl bg-white/8 text-white/70 flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all"
          aria-label="Diminuer"
        >
          <Minus size={12} />
        </button>

        <span className={`min-w-[2ch] text-body font-bold text-center transition-colors ${
          dirty ? 'text-orange' : qty <= 2 ? 'text-red-400' : 'text-amber'
        }`}>
          {qty}
        </span>

        <button
          onClick={() => onChange(product.id, qty + 1)}
          className="w-7 h-7 rounded-xl bg-orange/20 text-orange flex items-center justify-center hover:bg-orange/30 active:scale-95 transition-all"
          aria-label="Augmenter"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}

export function StockBasPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [overrides, setOverrides] = useState({})
  const [saveErrors, setSaveErrors] = useState({})
  const [saving, setSaving]     = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    stockService.listLowStock()
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.products ?? [])
        setProducts(items)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const dirtyIds = products
    .filter(p => overrides[p.id] !== undefined && overrides[p.id] !== p.stock)
    .map(p => p.id)
  const hasDirty = dirtyIds.length > 0

  useEffect(() => {
    if (!hasDirty) return
    const handler = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasDirty])

  function handleChange(id, qty) {
    setOverrides(prev => ({ ...prev, [id]: qty }))
    setSaveErrors(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  async function handleSave() {
    setSaving(true)
    setSavedMsg(false)
    const results = await Promise.allSettled(
      dirtyIds.map(id =>
        stockService.updateStock(id, { stock: overrides[id] })
          .then(() => ({ id, ok: true }))
          .catch(err => ({ id, ok: false, error: err.message }))
      )
    )
    const newErrors = {}
    const successIds = []
    for (const r of results) {
      const { id, ok, error } = r.value
      if (ok) successIds.push(id)
      else newErrors[id] = error
    }
    setOverrides(prev => {
      const n = { ...prev }
      successIds.forEach(id => delete n[id])
      return n
    })
    setSaveErrors(newErrors)
    setSaving(false)
    if (Object.keys(newErrors).length === 0) {
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)
      setLoading(true)
      stockService.listLowStock()
        .then(data => {
          const items = Array.isArray(data) ? data : (data?.products ?? [])
          setProducts(items)
          setOverrides({})
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }

  return (
    <div className="min-h-screen bg-navy-deep pb-28">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-h3 text-white">Stock bas</h1>
            {!loading && (
              <p className="text-micro text-white/45">
                {products.length} produit{products.length > 1 ? 's' : ''} à approvisionner
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="page-container py-4 flex flex-col gap-4">
        <div className="glass rounded-2xl px-4 py-3 border border-amber/20">
          <p className="text-label text-white/70">
            Ajustez les quantités directement ici, ou transférez un message WhatsApp au numéro Wakanect pour recréer du stock.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-body text-red-400">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald/12 flex items-center justify-center mb-4">
              <Package size={28} className="text-emerald" />
            </div>
            <p className="text-body font-semibold text-white">Tout est bien approvisionné !</p>
            <p className="text-label text-white/40 mt-1">Aucun produit en stock bas</p>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            {products.map(p => (
              <StockRow
                key={p.id}
                product={p}
                qty={overrides[p.id] ?? p.stock}
                onChange={handleChange}
              />
            ))}
          </div>
        )}

        {Object.keys(saveErrors).length > 0 && (
          <div className="glass rounded-2xl px-4 py-3 border border-red-500/30">
            <p className="text-label text-red-400 font-semibold mb-1">
              Erreur sur {Object.keys(saveErrors).length} produit(s)
            </p>
            {Object.entries(saveErrors).map(([id, msg]) => {
              const p = products.find(p => p.id === id)
              return (
                <p key={id} className="text-micro text-red-400/80">{p?.name ?? id} : {msg}</p>
              )
            })}
          </div>
        )}

        {savedMsg && (
          <div className="flex items-center gap-2 justify-center py-2">
            <Check size={14} className="text-emerald-400" />
            <span className="text-label text-emerald-400">Stock mis à jour</span>
          </div>
        )}

        <Link
          to="/app/profil/comment-ajouter"
          className="text-center text-label text-orange hover:text-orange-hi transition-colors"
        >
          Comment ajouter du stock via WhatsApp ?
        </Link>
      </div>

      {hasDirty && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 glass border-t border-white/8">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-orange text-white font-semibold text-body flex items-center justify-center gap-2 hover:bg-orange-hi active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? 'Enregistrement…' : `Enregistrer (${dirtyIds.length})`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
