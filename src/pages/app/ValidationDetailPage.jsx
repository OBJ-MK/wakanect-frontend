import { useState, useEffect } from 'react'
import { ChevronLeft, Copy } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useValidationStore } from '@/store/validationStore'
import { useAppSummary } from '@/hooks/useAppSummary'
import { WhatsAppBubble } from '@/components/features/parsing/WhatsAppBubble'
import { ConfidenceBadge } from '@/components/features/parsing/ConfidenceBadge'
import { LineActionBar } from '@/components/features/parsing/LineActionBar'
import { ValidationPendingList } from '@/components/features/parsing/ValidationPendingList'
import { VariantEditor, toCleanVariants, variantsSum } from '@/components/features/catalogue/VariantEditor'
import { Input } from '@/components/ui/Input'
import { CATEGORIES } from '@/lib/constants'

const DUPLICATE_LABELS = {
  'image-exact': 'Image identique',
  'text+price': 'Texte + prix identiques',
}

function DuplicateFlag({ duplicate }) {
  if (!duplicate) return null
  const label = DUPLICATE_LABELS[duplicate.matched_on] ?? duplicate.matched_on
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber/10 border border-amber/20">
      <Copy size={12} className="text-amber shrink-0" />
      <span className="text-micro font-semibold text-amber">Doublon possible — {label}</span>
      {duplicate.confidence != null && (
        <span className="text-micro text-amber/70 ml-0.5">({duplicate.confidence}%)</span>
      )}
    </div>
  )
}

function ImageStrip({ images }) {
  if (!images?.length) return null
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {images.map((url, i) => (
        <img key={i} src={url} alt="" className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-white/10" />
      ))}
    </div>
  )
}

export function ValidationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pending, orphans, loading, fetchPending, applyProduct, ignoreProduct, attachOrphan, deleteOrphan } = useValidationStore()
  const { refreshSummary } = useAppSummary()

  // Filet de sécurité : accès direct / rechargement de page → liste vide en store
  useEffect(() => {
    if (!loading && pending.length === 0) fetchPending()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const product = pending.find(p => p.id === id)
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [newSize, setNewSize] = useState('')

  useEffect(() => {
    if (product && !form) {
      setForm({
        name: product.name,
        price: String(product.price || ''),
        quantity: String(product.quantity || 1),
        category: product.category || '',
        sizes: [...(product.sizes || [])],
        variants: (product.colors || []).map(c => ({ color: c, quantity: '' })),
      })
    }
  }, [product]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center gap-3 text-center px-6">
        <p className="text-body text-white/60">Ce produit n'est plus en attente de validation.</p>
        <Link to="/app/validation" className="text-orange font-semibold">Retour à la liste</Link>
      </div>
    )
  }

  if (!form) return null

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))
  const hasVariants = toCleanVariants(form.variants).length > 0

  function addSize() {
    const v = newSize.trim().toUpperCase()
    if (v && !form.sizes.includes(v)) setForm(f => ({ ...f, sizes: [...f.sizes, v] }))
    setNewSize('')
  }
  function removeSize(s) {
    setForm(f => ({ ...f, sizes: f.sizes.filter(x => x !== s) }))
  }

  async function handlePublish() {
    setBusy(true)
    const cleanVariants = toCleanVariants(form.variants)
    try {
      await applyProduct(product.id, {
        name: form.name,
        category: form.category,
        sizes: form.sizes,
        price: parseInt(form.price, 10),
        quantity: cleanVariants.length > 0
          ? cleanVariants.reduce((sum, v) => sum + v.quantity, 0)
          : parseInt(form.quantity, 10),
        colors: form.variants.map(v => v.color.trim()).filter(Boolean),
        variants: cleanVariants,
      })
      refreshSummary()
      navigate('/app/validation', { replace: true }) // retour instantané, pas de délai artificiel
    } finally {
      setBusy(false)
    }
  }

  async function handleIgnore() {
    setBusy(true)
    try {
      await ignoreProduct(product.id)
      refreshSummary()
      navigate('/app/validation', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    // lg: split liste/détail côte à côte comme OrdersPage/ValidationListPage —
    // valider un produit ne fait plus perdre la liste. Mobile inchangé
    // (détail seul, plein écran, colonne liste masquée).
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-navy-deep lg:h-[calc(100dvh-2rem)] lg:overflow-hidden lg:flex lg:items-stretch lg:gap-5 lg:p-6">
      {/* Colonne liste — même contenu que ValidationListPage, produit actif
          surligné, alimentée par le même store (pas de refetch ici). */}
      <div className="hidden lg:flex flex-col lg:w-[390px] lg:shrink-0 lg:min-h-0 lg:sticky lg:top-6 lg:self-start lg:h-full lg:rounded-3xl lg:bg-navy/45 lg:ring-1 lg:ring-white/8 lg:shadow-card lg:overflow-hidden">
        <div className="lg:shrink-0 lg:px-5 lg:pt-5 lg:pb-4">
          <h1 className="font-display font-bold text-h3 text-white">Nouveau produit à valider</h1>
          <p className="text-micro text-white/45">{pending.length} en attente</p>
        </div>
        <div className="lg:px-4 lg:pb-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <ValidationPendingList pending={pending} orphans={orphans} onAttach={attachOrphan} onDelete={deleteOrphan} activeId={id} />
        </div>
      </div>

      {/* Colonne détail */}
      <div className="flex-1 min-w-0 lg:min-h-0">
        <div className="min-h-screen bg-navy-deep lg:h-full lg:min-h-0 lg:rounded-3xl lg:bg-navy/25 lg:ring-1 lg:ring-white/8 lg:shadow-card lg:overflow-y-auto">
          <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3 lg:static lg:!bg-transparent lg:!backdrop-blur-none lg:!border-0 lg:!shadow-none lg:px-7 lg:pt-6 lg:pb-3">
            <div className="max-w-lg mx-auto flex items-center gap-3 lg:max-w-none">
              <Link to="/app/validation" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors lg:hidden">
                <ChevronLeft size={20} />
              </Link>
              <div className="flex-1">
                <h1 className="font-display font-bold text-h3 text-white truncate">
                  {product.name || 'Produit à valider'}
                </h1>
                <p className="text-micro text-white/45">Vérifie et publie</p>
              </div>
            </div>
          </div>

          <div className="page-container py-5 flex flex-col gap-5 lg:max-w-none lg:px-7 lg:pb-10">
            <ImageStrip images={product.images} />

            <div>
              <p className="text-micro text-white/40 uppercase tracking-wider mb-3">Message WhatsApp du commerçant</p>
              <div className="bg-[#0A4A2A] rounded-3xl p-4">
                <WhatsAppBubble text={product.raw_text} timestamp={product.timestamp} senderName="Commerçant" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ConfidenceBadge score={product.confidence} />
              <DuplicateFlag duplicate={product.duplicate} />
            </div>

            <div className="flex flex-col gap-3 lg:max-w-xl">
              <p className="text-micro text-white/40 uppercase tracking-wider">Champs parsés — à vérifier</p>
              <Input label="Nom du produit" value={form.name} onChange={set('name')} />
              <div className="flex flex-wrap gap-3">
                <Input label="Prix (FCFA)" type="number" min="0" value={form.price} onChange={set('price')} suffix="FCFA" containerClassName="flex-1 min-w-[140px]" />
                <Input
                  label="Quantité"
                  type="number"
                  min="1"
                  value={hasVariants ? String(variantsSum(form.variants)) : form.quantity}
                  onChange={set('quantity')}
                  disabled={hasVariants}
                  readOnly={hasVariants}
                  hint={hasVariants ? 'Somme des variantes' : undefined}
                  containerClassName="w-24 min-w-[80px] max-w-[96px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-label font-semibold text-white/60">Catégorie</label>
                <select value={form.category} onChange={set('category')} className="w-full rounded-2xl px-4 py-3 text-body bg-navy/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange">
                  <option value="">Choisir...</option>
                  {CATEGORIES.filter(c => c !== 'Tout').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-label font-semibold text-white/60">Tailles</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.sizes.map(s => (
                    <button key={s} onClick={() => removeSize(s)} className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange/20 text-orange text-label hover:bg-red-500/20 hover:text-red-400 transition-colors">
                      {s} ×
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newSize} onChange={e => setNewSize(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} placeholder="Ex: M" containerClassName="flex-1" className="rounded-xl px-3 py-2 text-label" />
                  <button onClick={addSize} className="px-3 py-2 rounded-xl bg-orange/20 text-orange text-label hover:bg-orange/30 transition-colors">Ajouter</button>
                </div>
              </div>
              <VariantEditor variants={form.variants} onChange={variants => setForm(f => ({ ...f, variants }))} />
            </div>

            <div className="lg:max-w-xl">
              <LineActionBar onPublish={handlePublish} onIgnore={handleIgnore} loading={busy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}