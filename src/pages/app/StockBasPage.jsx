import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Package, Plus, Minus, Loader2, Check } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { stockService } from '@/services/stockService'

function StockRow({ product }) {
  const [qty, setQty]           = useState(product.stock)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [saveError, setSaveError] = useState(null)
  const prevQty  = useRef(product.stock)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function updateQty(next) {
    setQty(next)
    setSaved(false)
    setSaveError(null)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await stockService.updateStock(product.id, { stock: next })
        prevQty.current = next
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      } catch (err) {
        setSaveError(err.message)
        setQty(prevQty.current)
      } finally {
        setSaving(false)
      }
    }, 600)
  }

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
        {saveError && (
          <p className="text-micro text-red-400 mt-0.5">{saveError}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQty(Math.max(0, qty - 1))}
          disabled={saving}
          className="w-7 h-7 rounded-xl bg-white/8 text-white/70 flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all disabled:opacity-40"
          aria-label="Diminuer"
        >
          <Minus size={12} />
        </button>

        <div className="min-w-[2ch] flex items-center justify-center">
          {saving ? (
            <Loader2 size={14} className="animate-spin text-white/50" />
          ) : (
            <span className={`text-body font-bold text-center transition-colors ${
              saved ? 'text-emerald-400' : qty <= 2 ? 'text-red-400' : 'text-amber'
            }`}>
              {saved ? <Check size={14} /> : qty}
            </span>
          )}
        </div>

        <button
          onClick={() => updateQty(qty + 1)}
          disabled={saving}
          className="w-7 h-7 rounded-xl bg-orange/20 text-orange flex items-center justify-center hover:bg-orange/30 active:scale-95 transition-all disabled:opacity-40"
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

  useEffect(() => {
    stockService.listLowStock()
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.products ?? [])
        setProducts(items)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-navy-deep">
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
            {products.map(p => <StockRow key={p.id} product={p} />)}
          </div>
        )}

        <Link
          to="/app/profil/comment-ajouter"
          className="text-center text-label text-orange hover:text-orange-hi transition-colors"
        >
          Comment ajouter du stock via WhatsApp ?
        </Link>
      </div>
    </div>
  )
}
