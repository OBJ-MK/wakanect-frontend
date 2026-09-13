import { useState } from 'react'
import { ShoppingCart, Share2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatFCFA } from '@/lib/formatters'
import { useCatalogueStore } from '@/store/catalogueStore'
import { Button } from '@/components/ui/Button'
import { shareOrCopy } from '@/lib/utils'
import { PUBLIC_BASE } from '@/lib/constants'

export function ProductCard({ product }) {
  const { addToCart, boutique } = useCatalogueStore()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)
  const [shared, setShared] = useState(false)

  const outOfStock = product.stock <= 0

  function handleAdd(e) {
    e.stopPropagation()
    if (outOfStock) return
    addToCart(product, null)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  async function handleShare(e) {
    e.stopPropagation()
    if (!boutique?.slug) return
    const url = `${PUBLIC_BASE}/boutique/${boutique.slug}/produit/${product.id}`
    const result = await shareOrCopy(product.name, url)
    if (result === 'shared' || result === 'copied') {
      setShared(true)
      setTimeout(() => setShared(false), 1400)
    }
  }

  function handleCardClick() {
    if (boutique?.slug) {
      navigate(`/boutique/${boutique.slug}/produit/${product.id}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col rounded-3xl bg-white dark:bg-navy overflow-hidden shadow-card border border-[var(--border-default)] cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-cream-dark dark:bg-navy-light overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--text-muted)]">
            🛍️
          </div>
        )}
        {outOfStock && (
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
          className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-black/70 active:scale-95 transition-all"
        >
          {shared ? <Check size={14} /> : <Share2 size={14} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* min-h réserve toujours la place de 2 lignes, même si le titre tient sur une —
            sinon les cartes avec titre court sont plus basses que les autres dans la grille. */}
        <p className="text-body font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </p>
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
      </div>
    </div>
  )
}