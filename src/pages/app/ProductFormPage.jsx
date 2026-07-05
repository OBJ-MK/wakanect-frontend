import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ChevronLeft, X, Plus, Check, Loader2, Star
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CATEGORIES } from '@/lib/constants'
import { stockService } from '@/services/stockService'
import { VariantEditor, toCleanVariants, variantsSum } from '@/components/features/catalogue/VariantEditor'

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
          className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-label focus:outline-none focus:border-orange/50 dark:bg-navy/60 dark:border-white/10"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-xl bg-[var(--bg-surface-2)] text-[var(--text-secondary)] text-label hover:opacity-80 transition-colors dark:bg-white/10 dark:text-white/70"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

function ImageManager({ productId, images, onChange, onError }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null) // "2/5" pendant un lot
  const [deletingId, setDeletingId] = useState(null)
  const [settingPrimaryId, setSettingPrimaryId] = useState(null)

  const busy = uploading || deletingId !== null || settingPrimaryId !== null

  async function handleAdd(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    onError(null)
    // Upload séquentiel : l'API accepte une image à la fois, on enchaîne
    let lastError = null
    try {
      for (let i = 0; i < files.length; i++) {
        if (files.length > 1) setUploadProgress(`${i + 1}/${files.length}`)
        try {
          const { product } = await stockService.uploadImage(productId, files[i])
          onChange(product.images)
        } catch (err) {
          lastError = err
        }
      }
      if (lastError) onError(lastError.message)
    } finally {
      setUploading(false)
      setUploadProgress(null)
      e.target.value = ''
    }
  }

  async function handleDelete(imgId) {
    setDeletingId(imgId)
    onError(null)
    try {
      const { product } = await stockService.deleteImage(productId, imgId)
      onChange(product.images)
    } catch (err) {
      onError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSetPrimary(imgId) {
    setSettingPrimaryId(imgId)
    onError(null)
    try {
      const { product } = await stockService.setPrimaryImage(productId, imgId)
      onChange(product.images)
    } catch (err) {
      onError(err.message)
    } finally {
      setSettingPrimaryId(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-label font-semibold text-white/60">Photos</label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, idx) => (
          <div key={img.id ?? `img-${idx}`} className="relative shrink-0">
            <img
              src={img.url}
              alt=""
              className={`h-20 w-20 rounded-2xl object-cover border-2 transition-all ${
                img.isPrimary ? 'border-orange' : 'border-white/10'
              }`}
            />

            {/* Étoile — définir comme principale */}
            {!img.isPrimary && img.id && (
              <button
                type="button"
                onClick={() => !busy && handleSetPrimary(img.id)}
                disabled={busy}
                title="Définir comme principale"
                className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-orange disabled:opacity-40 transition-colors"
              >
                {settingPrimaryId === img.id
                  ? <Loader2 size={10} className="animate-spin" />
                  : <Star size={10} />}
              </button>
            )}

            {/* Badge principale */}
            {img.isPrimary && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-orange text-white text-[9px] leading-none whitespace-nowrap">
                principale
              </div>
            )}

            {/* Supprimer */}
            {img.id && (
              <button
                type="button"
                onClick={() => !busy && handleDelete(img.id)}
                disabled={busy}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 disabled:opacity-40 transition-colors"
              >
                {deletingId === img.id
                  ? <Loader2 size={10} className="animate-spin" />
                  : <X size={10} />}
              </button>
            )}
          </div>
        ))}

        {/* Bouton ajouter */}
        <label className={`shrink-0 h-20 w-20 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-0.5 transition-all ${
          busy ? 'opacity-40 cursor-wait' : 'cursor-pointer hover:border-white/40 hover:text-white/60'
        } text-white/40`}>
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          {uploadProgress && (
            <span className="text-[10px] leading-none">{uploadProgress}</span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={handleAdd}
          />
        </label>
      </div>
      {images.length === 0 && (
        <p className="text-micro text-white/35">Appuyez sur + — vous pouvez sélectionner plusieurs photos d'un coup</p>
      )}
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
    wholesalePrice: '',
    stock: '',
    category: '',
    description: '',
    sizes: [],
    variants: [],
    images: [],
  })
  const [saving, setSaving] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(isEdit)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    setSuccess(false) // arrivée depuis la création : repart propre
    stockService.list()
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.products ?? data?.rows ?? [])
        const product = list.find(p => String(p.id) === String(id))
        if (!product) return
        setForm({
          name:        product.name        ?? '',
          price:       product.price       ?? '',
          wholesalePrice: product.wholesale_price ?? '',
          stock:       product.stock       ?? '',
          category:    product.category    ?? '',
          description: product.description ?? '',
          sizes:       product.sizes       ?? [],
          // Variantes existantes, sinon couleurs legacy → lignes sans quantité
          variants:    product.variants?.length
            ? product.variants.map(v => ({ color: v.color, quantity: String(v.quantity ?? 0) }))
            : (product.colors ?? []).map(c => ({ color: c, quantity: '' })),
          images:      product.images      ?? [],
        })
      })
      .catch(() => {/* form stays empty — don't crash */})
      .finally(() => setLoadingProduct(false))
  }, [id, isEdit])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  // Variantes valides (couleur + quantité saisies) → stock global calculé
  const hasVariants = toCleanVariants(form.variants).length > 0

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const cleanVariants = toCleanVariants(form.variants)
      const payload = {
        name:        form.name,
        price:       Number(form.price),
        wholesalePrice: form.wholesalePrice === '' ? null : Number(form.wholesalePrice),
        description: form.description,
        category:    form.category,
        stock:       cleanVariants.length > 0
          ? cleanVariants.reduce((sum, v) => sum + v.quantity, 0)
          : Number(form.stock),
        colors:      form.variants.map(v => v.color.trim()).filter(Boolean),
        sizes:       form.sizes,
        variants:    cleanVariants,
      }

      if (isEdit) {
        await stockService.update(id, payload)
        setSuccess(true)
        setTimeout(() => navigate('/app/catalogue'), 800)
      } else {
        // Création directe depuis l'app : publié immédiatement (démarche volontaire),
        // puis redirection vers l'édition pour ajouter les photos (l'upload
        // nécessite l'id du produit).
        const { product } = await stockService.create({ ...payload, isPublished: true })
        setSuccess(true)
        setTimeout(() => navigate(`/app/catalogue/${product.id}/modifier`, { replace: true }), 800)
      }
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

      <form onSubmit={handleSubmit}>
        <div className="page-container py-5 flex flex-col gap-5">

          {/* Gestion des images — nécessite l'id produit, donc après création */}
          {isEdit ? (
            <ImageManager
              productId={id}
              images={form.images}
              onChange={images => setForm(f => ({ ...f, images }))}
              onError={setError}
            />
          ) : (
            <p className="text-micro text-white/40 glass rounded-2xl px-4 py-3">
              📷 Vous pourrez ajouter les photos juste après la création du produit.
            </p>
          )}

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
                label="Prix en gros"
                type="number"
                min="0"
                placeholder="20000"
                value={form.wholesalePrice}
                onChange={set('wholesalePrice')}
                suffix="FCFA"
                hint="Facultatif"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quantité"
                type="number"
                min="0"
                placeholder="12"
                value={hasVariants ? String(variantsSum(form.variants)) : form.stock}
                onChange={set('stock')}
                disabled={hasVariants}
                readOnly={hasVariants}
                hint={hasVariants ? 'Somme des variantes' : undefined}
                required={!hasVariants}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label font-semibold text-white/60">Catégorie</label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full rounded-2xl px-4 py-3 text-body bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange dark:bg-navy/60 dark:border-white/10"
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
            <VariantEditor
              variants={form.variants}
              onChange={variants => setForm(f => ({ ...f, variants }))}
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
                className="w-full rounded-2xl px-4 py-3 text-body bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange resize-none dark:bg-navy/60 dark:border-white/10"
              />
            </div>
          </div>

          {/* Feedback erreur / succès */}
          {error && (
            <p className="text-label text-red-400 bg-red-500/10 rounded-2xl px-4 py-3">{error}</p>
          )}
          {success && (
            <p className="text-label text-emerald-400 bg-emerald-500/10 rounded-2xl px-4 py-3">
              {isEdit ? 'Modifications enregistrées !' : 'Produit publié ! Ajoutez maintenant les photos…'}
            </p>
          )}

          {/* Bouton d'action */}
          <Button type="submit" size="lg" fullWidth loading={saving} className="mt-1">
            <Check size={16} />
            {isEdit ? 'Enregistrer les modifications' : 'Publier le produit'}
          </Button>
        </div>
      </form>
    </div>
  )
}
