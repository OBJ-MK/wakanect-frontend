import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Share2, Check, Edit3, AlertTriangle } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'
import { cn, shareOrCopy } from '@/lib/utils'
import { PUBLIC_BASE } from '@/lib/constants'

/**
 * Carte produit UNIQUE, partagée entre la boutique publique (variant="public")
 * et le catalogue marchand (variant="merchant"). Même JSX, même CSS des deux
 * côtés — c'est volontaire : deux implémentations séparées avaient fini par
 * diverger visuellement (cartes mal alignées côté marchand) sans qu'on
 * comprenne pourquoi malgré un code en apparence identique. Une seule source
 * élimine le problème plutôt que de continuer à le chasser.
 *
 * Les différences entre les deux contextes sont pilotées par `variant` :
 * bouton "Ajouter au panier" (public) vs bouton "Modifier" + stock affiché
 * (marchand). Tout le reste — image, titre, structure — est strictement identique.
 */
export function ProductCard({ product, slug, variant = 'public', onAdd }) {
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [shared, setShared] = useState(false)

  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 5
  const imageUrl = product.image_url ?? product.images?.[0]?.url ?? null
  const isMerchant = variant === 'merchant'

  function handleAdd(e) {
    e.stopPropagation()
    if (outOfStock) return
    onAdd?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  async function handleShare(e) {
    e.stopPropagation()
    e.preventDefault()
    if (!slug) return
    const url = `${PUBLIC_BASE}/boutique/${slug}/produit/${product.id}`
    const result = await shareOrCopy(product.name, url)
    if (result === 'shared' || result === 'copied') {
      setShared(true)
      setTimeout(() => setShared(false), 1400)
    }
  }

  function handleCardClick() {
    if (!isMerchant && slug) {
      navigate(`/boutique/${slug}/produit/${product.id}`)
    }
  }

  return (
    <div
      onClick={isMerchant ? undefined : handleCardClick}
      className={cn(
        'flex flex-col rounded-3xl overflow-hidden border transition-shadow',
        isMerchant
          ? 'glass border-transparent'
          : 'bg-white dark:bg-navy shadow-card border-[var(--border-default)] cursor-pointer hover:shadow-md',
        isMerchant && outOfStock && 'opacity-60',
      )}
    >
      {/* Image — aspect-square + object-cover : identique dans les deux variants,
          c'est ce qui garantit que toutes les cartes ont la même hauteur d'image
          quelle que soit la taille/proportion de la photo source. */}
      <div className={cn(
        'relative aspect-square overflow-hidden',
        isMerchant ? 'bg-navy-light' : 'bg-cream-dark dark:bg-navy-light',
      )}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--text-muted)]">
            🛍️
          </div>
        )}

        {!isMerchant && outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-label font-semibold bg-black/60 px-3 py-1 rounded-full">
              Épuisé
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleShare}
          aria-label="Partager cet article"
          className={cn(
            'absolute top-2 w-8 h-8 rounded-xl backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all',
            isMerchant
              ? 'left-2 bg-navy/70 text-white/70 hover:text-white hover:bg-navy/90'
              : 'right-2 bg-black/50 text-white/90 hover:bg-black/70',
          )}
        >
          {shared ? <Check size={14} /> : <Share2 size={14} />}
        </button>

        {isMerchant && (
          <Link
            to={`/app/catalogue/${product.id}/modifier`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-navy/70 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-navy/90 active:scale-95 transition-all"
            aria-label="Modifier"
          >
            <Edit3 size={14} />
          </Link>
        )}

        {isMerchant && lowStock && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber/20 backdrop-blur-xs">
            <AlertTriangle size={10} className="text-amber" />
            <span className="text-[10px] font-semibold text-amber">Stock bas</span>
          </div>
        )}
        {isMerchant && outOfStock && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-red-500/20 backdrop-blur-xs">
            <span className="text-[10px] font-semibold text-red-400">Épuisé</span>
          </div>
        )}
      </div>

      {/* Info — titre à hauteur fixe (2 lignes réservées) dans les deux variants,
          pour que le contenu qui suit (bouton ou prix/stock) soit toujours
          ancré à la même position en bas de carte. */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className={cn(
          'font-semibold line-clamp-2 leading-snug min-h-[2.5rem]',
          isMerchant ? 'text-label text-white' : 'text-body text-[var(--text-primary)]',
        )}>
          {product.name}
        </p>

        {isMerchant ? (
          <div className="flex items-center justify-between mt-auto">
            <p className="text-body font-bold text-amber">{formatFCFA(product.price)}</p>
            <p className={cn(
              'text-micro',
              outOfStock ? 'text-red-400' : lowStock ? 'text-amber' : 'text-white/40',
            )}>
              {outOfStock ? 'Épuisé' : `${product.stock} en stock`}
            </p>
          </div>
        ) : (
          <>
            <p className="text-label font-bold text-orange">{formatFCFA(product.price)}</p>
            <Button
              size="sm"
              variant={outOfStock ? 'ghost' : 'primary'}
              disabled={outOfStock}
              onClick={handleAdd}
              className="mt-auto"
              fullWidth
            >
              {outOfStock ? 'Épuisé' : added ? '✓ Ajouté' : (
                <><ShoppingCart size={14} /> Ajouter</>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}