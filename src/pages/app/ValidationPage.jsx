import { useState } from 'react'
import { ChevronLeft, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePendingProducts } from '@/hooks/useStock'
import { WhatsAppBubble } from '@/components/features/parsing/WhatsAppBubble'
import { ConfidenceBadge } from '@/components/features/parsing/ConfidenceBadge'
import { LineActionBar } from '@/components/features/parsing/LineActionBar'
import { Input } from '@/components/ui/Input'
import { formatFCFA } from '@/lib/formatters'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const MOCK_PENDING = []

function PendingProductCard({ product, onConfirm, onReject }) {
  const [form, setForm] = useState({
    name: product.name,
    price: String(product.price || ''),
    quantity: String(product.quantity || 1),
    category: product.category || '',
    sizes: [...(product.sizes || [])],
    colors: [...(product.colors || [])],
  })
  const [loading, setLoading] = useState(false)
  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function addSize() {
    const v = newSize.trim().toUpperCase()
    if (v && !form.sizes.includes(v)) {
      setForm(f => ({ ...f, sizes: [...f.sizes, v] }))
    }
    setNewSize('')
  }

  function removeSize(s) {
    setForm(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) }))
  }

  function addColor() {
    const v = newColor.trim()
    if (v && !form.colors.includes(v)) {
      setForm(f => ({ ...f, colors: [...f.colors, v] }))
    }
    setNewColor('')
  }

  function removeColor(c) {
    setForm(f => ({ ...f, colors: f.colors.filter(x => x !== c) }))
  }

  async function handleConfirm() {
    setLoading(true)
    await onConfirm(product.id, {
      ...form,
      price: parseInt(form.price, 10),
      quantity: parseInt(form.quantity, 10),
    })
    setLoading(false)
  }

  async function handleReject() {
    await onReject(product.id)
  }

  return (
    <div className="glass rounded-4xl overflow-hidden animate-fade-up">
      {/* Thread line */}
      <div className="h-0.5 gradient-thread opacity-60" />

      <div className="p-5 flex flex-col gap-5">
        {/* WA Bubble section */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-3">
            Message WhatsApp du commerçant
          </p>
          <div className="bg-[#0A4A2A] rounded-3xl p-4">
            <WhatsAppBubble
              text={product.rawText}
              timestamp={product.timestamp}
              senderName="Commerçant"
            />
          </div>
        </div>

        {/* Confidence + duplicate */}
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceBadge score={product.confidence} />
          {product.is_duplicate && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15">
              <AlertCircle size={13} className="text-red-400" />
              <span className="text-micro font-semibold text-red-400">Doublon suspecté</span>
            </div>
          )}
        </div>

        {/* Parsed fields */}
        <div className="flex flex-col gap-3">
          <p className="text-micro text-white/40 uppercase tracking-wider">Champs parsés — à vérifier</p>

          <Input
            label="Nom du produit"
            value={form.name}
            onChange={set('name')}
          />

          {/* Prix + Quantité — flex-wrap pour mobile */}
          <div className="flex flex-wrap gap-3">
            <Input
              label="Prix (FCFA)"
              type="number"
              min="0"
              value={form.price}
              onChange={set('price')}
              suffix="FCFA"
              containerClassName="flex-1 min-w-[140px]"
            />
            <Input
              label="Quantité"
              type="number"
              min="1"
              value={form.quantity}
              onChange={set('quantity')}
              containerClassName="w-24 min-w-[80px] max-w-[96px]"
            />
          </div>

          {/* Catégorie */}
          <div className="flex flex-col gap-1.5">
            <label className="text-label font-semibold text-white/60">Catégorie</label>
            <select
              value={form.category}
              onChange={set('category')}
              className="w-full rounded-2xl px-4 py-3 text-body bg-navy/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
            >
              <option value="">Choisir...</option>
              {CATEGORIES.filter(c => c !== 'Tout').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Tailles */}
          <div className="flex flex-col gap-1.5">
            <label className="text-label font-semibold text-white/60">Tailles</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => removeSize(s)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange/20 text-orange text-label hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  {s} ×
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSize}
                onChange={e => setNewSize(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                placeholder="Ex: M"
                className="flex-1 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white placeholder:text-white/35 text-label focus:outline-none focus:border-orange/50"
              />
              <button
                onClick={addSize}
                className="px-3 py-2 rounded-xl bg-orange/20 text-orange text-label hover:bg-orange/30 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Couleurs */}
          <div className="flex flex-col gap-1.5">
            <label className="text-label font-semibold text-white/60">Couleurs</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.colors.map(c => (
                <button
                  key={c}
                  onClick={() => removeColor(c)}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber/15 text-amber text-label hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  {c} ×
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newColor}
                onChange={e => setNewColor(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addColor())}
                placeholder="Ex: Noir"
                className="flex-1 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white placeholder:text-white/35 text-label focus:outline-none focus:border-orange/50"
              />
              <button
                onClick={addColor}
                className="px-3 py-2 rounded-xl bg-amber/15 text-amber text-label hover:bg-amber/25 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

        <LineActionBar
          onConfirm={handleConfirm}
          onReject={handleReject}
          loading={loading}
        />
      </div>
    </div>
  )
}

export function ValidationPage() {
  const { pending: fetchedPending, loading, applyProduct } = usePendingProducts()
  const [rejected, setRejected] = useState(new Set())

  const pending = fetchedPending
  const visible = pending.filter(p => !rejected.has(p.id))

  async function handleConfirm(id, data) {
    await applyProduct(id, data)
    setRejected(s => new Set([...s, id]))
  }

  function handleReject(id) {
    setRejected(s => new Set([...s, id]))
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/app" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-h3 text-white">Nouveau produit à valider</h1>
            <p className="text-micro text-white/45">{visible.length} en attente</p>
          </div>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald/15 flex items-center justify-center mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-body font-semibold text-white">Tout est traité !</p>
            <p className="text-label text-white/45 mt-1">Aucun produit en attente de validation</p>
          </div>
        ) : (
          visible.map(product => (
            <PendingProductCard
              key={product.id}
              product={product}
              onConfirm={handleConfirm}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  )
}
