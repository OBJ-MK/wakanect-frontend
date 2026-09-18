import { useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
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

function PendingRow({ product, active }) {
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
      className={cn(
        'w-full flex items-center gap-3 px-4 py-4 border-b border-white/6 last:border-0 hover:bg-white/4 active:bg-white/8 transition-colors',
        active && 'lg:bg-orange/8',
      )}
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

// Contenu de la colonne "liste" partagé entre ValidationListPage et
// ValidationDetailPage (split desktop) — pour que la validation d'un produit
// n'oblige plus à naviguer loin de la liste sur grand écran.
export function ValidationPendingList({ pending, orphans, onAttach, onDelete, activeId }) {
  return (
    <div className="flex flex-col gap-3">
      <OrphanMediaPanel orphans={orphans} candidates={pending} onAttach={onAttach} onDelete={onDelete} />
      {pending.length > 0 && (
        <div className="glass rounded-3xl overflow-hidden">
          {pending.map(product => (
            <PendingRow key={product.id} product={product} active={activeId === product.id} />
          ))}
        </div>
      )}
    </div>
  )
}
