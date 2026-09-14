import { useEffect, useState } from 'react'
import { ChevronLeft, ImagePlus, X, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useValidationStore } from '@/store/validationStore'
import { ConfidenceBadge } from '@/components/features/parsing/ConfidenceBadge'
import { formatFCFA } from '@/lib/formatters'
import { cn } from '@/lib/utils'

function OrphanMediaPanel({ orphans, candidates, onAttach, onDelete }) {
  const [busyId, setBusyId] = useState(null)
  if (!orphans.length) return null

  async function handleAttach(mediaId, candidateId) {
    setBusyId(mediaId)
    try { await onAttach(mediaId, candidateId) } finally { setBusyId(null) }
  }
  async function handleDelete(mediaId) {
    if (!window.confirm('Supprimer définitivement cette photo ? Elle ne pourra plus être rattachée à un produit.')) return
    setBusyId(mediaId)
    try { await onDelete(mediaId) } finally { setBusyId(null) }
  }

  return (
    <div className="glass rounded-4xl overflow-hidden animate-fade-up border border-amber/20">
      <div className="h-0.5 bg-amber/60" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ImagePlus size={16} className="text-amber shrink-0" />
          <p className="text-body font-semibold text-white">
            Photos à rattacher — à quel produit appartiennent-elles ?
          </p>
        </div>
        <p className="text-label text-white/45">
          Ces photos sont arrivées pendant que plusieurs produits étaient en attente.
          Choisissez le bon produit pour chacune.
        </p>
        <div className="flex flex-col gap-4">
          {orphans.map(orphan => (
            <div key={orphan.media_id} className="flex gap-3 items-start">
              <div className="relative shrink-0">
                <img
                  src={orphan.url}
                  alt=""
                  className={cn(
                    'h-20 w-20 rounded-2xl object-cover border border-amber/30',
                    busyId === orphan.media_id && 'opacity-50'
                  )}
                />
                <button
                  type="button"
                  aria-label="Supprimer cette photo"
                  disabled={busyId === orphan.media_id}
                  onClick={() => handleDelete(orphan.media_id)}
                  className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-navy-deep border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-red-400/60 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidates.length === 0 ? (
                  <span className="text-label text-white/45">Aucun produit en attente</span>
                ) : (
                  candidates.map(c => (
                    <button
                      key={c.id}
                      disabled={busyId === orphan.media_id}
                      onClick={() => handleAttach(orphan.media_id, c.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber/15 border border-amber/25 text-amber text-label hover:bg-amber/25 transition-colors disabled:opacity-50"
                    >
                      {c.name || c.raw_text?.slice(0, 30) || 'Produit sans nom'}
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PendingRow({ product }) {
  if (product.status === 'processing') {
    return (
      <div className="w-full flex items-center gap-3 px-4 py-4 border-b border-white/6 last:border-0">
        <div className="h-12 w-12 rounded-2xl shrink-0 bg-white/6 border border-white/10 flex items-center justify-center">
          <Loader2 size={18} className="text-white/40 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body font-semibold text-white/70 truncate">
            {product.raw_text?.slice(0, 40) || 'Nouveau message'}
          </p>
          <p className="text-micro text-white/40 mt-1">Analyse en cours…</p>
        </div>
      </div>
    )
  }

  const thumb = product.images?.[0]
  return (
    <Link
      to={`/app/validation/${product.id}`}
      className="w-full flex items-center gap-3 px-4 py-4 border-b border-white/6 last:border-0 hover:bg-white/4 active:bg-white/8 transition-colors"
    >
      <div className="h-12 w-12 rounded-2xl overflow-hidden shrink-0 bg-white/8 border border-white/10">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/20 text-micro">?</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-white truncate">
          {product.name || product.raw_text?.slice(0, 40) || 'Produit sans nom'}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          <ConfidenceBadge score={product.confidence} />
          {product.images?.length > 1 && (
            <span className="text-micro text-white/40">{product.images.length} photos</span>
          )}
        </div>
      </div>
      {product.price ? (
        <p className="text-label font-bold text-amber shrink-0">{formatFCFA(product.price)}</p>
      ) : null}
    </Link>
  )
}

export function ValidationListPage() {
  const { pending, orphans, loading, fetchPending, attachOrphan, deleteOrphan } = useValidationStore()

  useEffect(() => { fetchPending(true) }, [])

  // Tant qu'un message est encore en cours d'analyse (parsing IA, 4-10s en
  // pratique), on repolle pour que la carte se complète automatiquement.
  const hasProcessing = pending.some(p => p.status === 'processing')
  useEffect(() => {
    if (!hasProcessing) return
    const interval = setInterval(() => fetchPending(true, true), 2500)
    return () => clearInterval(interval)
  }, [hasProcessing])

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/app" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-h3 text-white">Nouveau produit à valider</h1>
            <p className="text-micro text-white/45">{pending.length} en attente</p>
          </div>
        </div>
      </div>

      <div className="page-container py-4 flex flex-col gap-3">
        {loading ? (
          <div className="glass rounded-3xl overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-white/6 last:border-0 animate-pulse">
                <div className="h-12 w-12 rounded-2xl bg-white/8 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-20 bg-white/8 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : pending.length === 0 && orphans.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald/15 flex items-center justify-center mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-body font-semibold text-white">Tout est traité !</p>
            <p className="text-label text-white/45 mt-1">Aucun produit en attente de validation</p>
          </div>
        ) : (
          <>
            <OrphanMediaPanel orphans={orphans} candidates={pending} onAttach={attachOrphan} onDelete={deleteOrphan} />
            {pending.length > 0 && (
              <div className="glass rounded-3xl overflow-hidden">
                {pending.map(product => <PendingRow key={product.id} product={product} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}