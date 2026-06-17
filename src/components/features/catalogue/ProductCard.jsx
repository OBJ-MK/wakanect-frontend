import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatFCFA } from '@/lib/formatters'
import { useCatalogueStore } from '@/store/catalogueStore'
import { Button } from '@/components/ui/Button'

export function ProductCard({ product }) {
  const { addToCart, boutique } = useCatalogueStore()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)

  const outOfStock = product.stock <= 0

  function handleAdd(e) {
    e.stopPropagation()
    if (outOfStock) return
    addToCart(product, null)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
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
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-body font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
          {product.name}
        </p>
        <p className="text-label font-bold text-orange">{formatFCFA(product.price)}</p>

        {/* Color chips — lecture seule */}
        {product.colors?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.colors.map(color => (
              <span
                key={color}
                className="px-2 py-0.5 rounded-full text-micro border border-[var(--border-default)] text-[var(--text-secondary)]"
              >
                {color}
              </span>
            ))}
          </div>
        )}

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
