import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, Camera, X, Plus, Check
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CATEGORIES } from '@/lib/constants'

const MOCK_PRODUCT = {
  id: '1',
  name: 'Robe Wax Ankara Premium',
  price: '25000',
  stock: '12',
  category: 'Vêtements',
  description: '',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Rouge', 'Noir', 'Blanc'],
  images: [],
}

function PhotoSlot({ image, onAdd, onRemove, index }) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-navy-light border-2 border-dashed border-white/15 flex items-center justify-center">
      {image ? (
        <>
          <img src={image} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-navy/80 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
            aria-label="Supprimer la photo"
          >
            <X size={12} />
          </button>
        </>
      ) : (
        <label className="flex flex-col items-center gap-1.5 cursor-pointer w-full h-full items-center justify-center flex">
          <Camera size={20} className="text-white/30" />
          <span className="text-micro text-white/30">Photo {index + 1}{index < 2 ? ' *' : ''}</span>
          <input type="file" accept="image/*" className="sr-only" onChange={e => {
            const file = e.target.files?.[0]
            if (file) onAdd(index, URL.createObjectURL(file))
          }} />
        </label>
      )}
    </div>
  )
}

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
    images: [null, null],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      // Load existing product data
      setForm({
        ...MOCK_PRODUCT,
        images: [...MOCK_PRODUCT.images, null, null].slice(0, Math.max(2, MOCK_PRODUCT.images.length + 1)),
      })
    }
  }, [isEdit])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function setImage(index, url) {
    setForm(f => {
      const imgs = [...f.images]
      imgs[index] = url
      if (index === imgs.length - 1) imgs.push(null)
      return { ...f, images: imgs }
    })
  }

  function removeImage(index) {
    setForm(f => {
      const imgs = f.images.filter((_, i) => i !== index)
      if (imgs[imgs.length - 1] !== null) imgs.push(null)
      return { ...f, images: imgs }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    navigate('/app/catalogue')
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

      <form onSubmit={handleSubmit}>
        <div className="page-container py-5 flex flex-col gap-5">
          {/* Photos — min 2 slots */}
          <div className="flex flex-col gap-2">
            <label className="text-label font-semibold text-white/60">
              Photos <span className="text-white/35 font-normal">(2 minimum)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {form.images.map((img, i) => (
                <PhotoSlot
                  key={i}
                  index={i}
                  image={img}
                  onAdd={setImage}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </div>

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

            {/* Catégorie */}
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

          <Button type="submit" size="lg" fullWidth loading={saving} className="mt-1">
            <Check size={16} />
            {isEdit ? 'Enregistrer les modifications' : 'Publier le produit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
