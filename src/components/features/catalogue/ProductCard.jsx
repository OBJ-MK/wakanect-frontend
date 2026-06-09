import { useState } from 'react'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { buildColorRequestLink } from '@/lib/utils'
import { useCatalogueStore } from '@/store/catalogueStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function ProductCard({ product }) {
  const { addToCart, boutique } = useCatalogueStore()
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? null)
  const [added, setAdded] = useState(false)

  const outOfStock = product.stock <= 0

  function handleAdd() {
    if (outOfStock) return
    addToCart(product, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const waLink = boutique?.whatsapp_number
    ? buildColorRequestLink(boutique.whatsapp_number, product.name, '__couleur__')
    : null

  return (
    <div className="flex flex-col rounded-3xl bg-white dark:bg-navy overflow-hidden shadow-card border border-[var(--border-default)]">
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

        {/* Color chips */}
        {product.colors?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'px-2 py-0.5 rounded-full text-micro border transition-colors',
                  selectedColor === color
                    ? 'bg-orange text-white border-orange'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-orange/50',
                )}
              >
                {color}
              </button>
            ))}
            {waLink && (
              <a
                href={waLink.replace('__couleur__', 'autre couleur')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-micro border border-wa-green/40 text-wa-green hover:bg-wa-green/10 transition-colors"
              >
                <ExternalLink size={10} /> Autre
              </a>
            )}
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
