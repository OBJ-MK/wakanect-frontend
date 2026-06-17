import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Camera, X, Plus, Check, Clock
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CATEGORIES } from '@/lib/constants'
import { stockService } from '@/services/stockService'

function TagInput({ label, tags, onAdd, onRemove, placeholder, colorClass = 'bg-orange/15 text-orange' }) {
  const [val, setVal] = useState('')

  function add() {
    const v = val.trim()
    if (v && !tags.includes(v)) onAdd(v)
    setVal('')
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label font-semibold text-white/60">{label}</label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => onRemove(t)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-label transition-colors ${colorClass} hover:opacity-70`}
            >
              {t} <X size={11} />
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl bg-white/8 border border-white/10 text-white placeholder:text-white/35 text-label focus:outline-none focus:border-orange/50"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-xl bg-white/10 text-white/70 text-label hover:bg-white/18 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

function ReadOnlyImages({ images }) {
  if (!images?.length) return null
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label font-semibold text-white/60">
        Photos <span className="text-white/35 font-normal">(gestion photos bientôt)</span>
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-white/10"
          />
        ))}
      </div>
    </div>
  )
}

export function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    sizes: [],
    colors: [],
    images: [],
  })
  const [saving, setSaving] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(isEdit)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    stockService.list()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.products ?? data?.rows ?? [])
        const product = list.find(p => String(p.id) === String(id))
        if (!product) return
        setForm({
          name:        product.name        ?? '',
          price:       product.price       ?? '',
          stock:       product.stock       ?? '',
          category:    product.category    ?? '',
          description: product.description ?? '',
          sizes:       product.sizes       ?? [],
          colors:      product.colors      ?? [],
          images:      product.images      ?? (product.image_url ? [product.image_url] : []),
        })
      })
      .catch(() => {/* form stays empty — don't crash */})
      .finally(() => setLoadingProduct(false))
  }, [id, isEdit])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await stockService.update(id, {
        name:        form.name,
        price:       Number(form.price),
        description: form.description,
        category:    form.category,
        stock:       Number(form.stock),
        colors:      form.colors,
        sizes:       form.sizes,
      })
      setSuccess(true)
      setTimeout(() => navigate('/app/catalogue'), 800)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app/catalogue"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
        </div>
      </div>

      <form onSubmit={isEdit ? handleSubmit : e => e.preventDefault()}>
        <div className="page-container py-5 flex flex-col gap-5">

          {/* Images — read-only en édition, section retirée en création */}
          {isEdit && <ReadOnlyImages images={form.images} />}

          {/* Core fields */}
          <div className="glass rounded-3xl p-4 flex flex-col gap-4">
            <Input
              label="Nom du produit"
              placeholder="Ex: Robe Wax Ankara Premium"
              value={form.name}
              onChange={set('name')}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prix (FCFA)"
                type="number"
                min="0"
                placeholder="25000"
                value={form.price}
                onChange={set('price')}
                suffix="FCFA"
                required
              />
              <Input
                label="Quantité"
                type="number"
                min="0"
                placeholder="12"
                value={form.stock}
                onChange={set('stock')}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label font-semibold text-white/60">Catégorie</label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full rounded-2xl px-4 py-3 text-body bg-navy/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
              >
                <option value="">Choisir une catégorie...</option>
                {CATEGORIES.filter(c => c !== 'Tout').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tailles & couleurs */}
          <div className="glass rounded-3xl p-4 flex flex-col gap-4">
            <p className="text-micro text-white/40 uppercase tracking-wider -mb-1">Variantes</p>
            <TagInput
              label="Tailles"
              tags={form.sizes}
              onAdd={v => setForm(f => ({ ...f, sizes: [...f.sizes, v.toUpperCase()] }))}
              onRemove={v => setForm(f => ({ ...f, sizes: f.sizes.filter(s => s !== v) }))}
              placeholder="Ex: M, L, 42..."
              colorClass="bg-orange/15 text-orange"
            />
            <TagInput
              label="Couleurs"
              tags={form.colors}
              onAdd={v => setForm(f => ({ ...f, colors: [...f.colors, v] }))}
              onRemove={v => setForm(f => ({ ...f, colors: f.colors.filter(c => c !== v) }))}
              placeholder="Ex: Rouge, Noir..."
              colorClass="bg-amber/15 text-amber"
            />
          </div>

          {/* Description facultative */}
          <div className="glass rounded-3xl p-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-label font-semibold text-white/60">
                Description <span className="text-white/35 font-normal">(facultatif)</span>
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Décrivez le produit..."
                rows={3}
                className="w-full rounded-2xl px-4 py-3 text-body bg-navy/60 border border-white/10 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange resize-none"
              />
            </div>
          </div>

          {/* Feedback erreur / succès */}
          {error && (
            <p className="text-label text-red-400 bg-red-500/10 rounded-2xl px-4 py-3">{error}</p>
          )}
          {success && (
            <p className="text-label text-emerald-400 bg-emerald-500/10 rounded-2xl px-4 py-3">
              Modifications enregistrées !
            </p>
          )}

          {/* Bouton d'action */}
          {isEdit ? (
            <Button type="submit" size="lg" fullWidth loading={saving} className="mt-1">
              <Check size={16} />
              Enregistrer les modifications
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2 mt-1">
              <Button type="button" size="lg" fullWidth disabled className="opacity-50 cursor-not-allowed">
                <Clock size={16} />
                Publier le produit
              </Button>
              <p className="text-micro text-white/35">
                Ajout manuel de produits bientôt disponible — utilisez WhatsApp pour l'instant
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
