import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, Package, Minus, Plus } from 'lucide-react'
import { useCatalogueStore } from '@/store/catalogueStore'
import { formatFCFA } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { catalogueService } from '@/services/catalogueService'


const COLOR_MAP = {
  'Rouge': '#E53E3E',
  'Noir': '#1A202C',
  'Blanc': '#F7FAFC',
  'Bleu': '#3182CE',
  'Vert': '#38A169',
  'Jaune': '#D69E2E',
  'Rose': '#ED64A6',
  'Marron': '#7B341E',
  'Kaki': '#718096',
  'Multicolore': 'linear-gradient(135deg, #E53E3E, #D69E2E, #38A169)',
}

function PhotoCarousel({ images, name }) {
  const [idx, setIdx] = useState(0)
  const count = Math.max(1, images?.length ?? 0)

  function prev() { setIdx(i => (i - 1 + count) % count) }
  function next() { setIdx(i => (i + 1) % count) }

  return (
    <div className="relative bg-cream dark:bg-navy-light aspect-[3/4] w-full overflow-hidden">
      {images?.length > 0 ? (
        <img
          src={images[idx]?.url}
          alt={`${name} — photo ${idx + 1}`}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/20">
          <Package size={48} />
          <p className="text-label">Aucune photo</p>
        </div>
      )}

      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={cn('w-1.5 h-1.5 rounded-full transition-all', i === idx ? 'bg-white w-4' : 'bg-white/40')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ProductDetailPage() {
  const { slug, id } = useParams()
  const navigate = useNavigate()
  const addToCartStore = useCatalogueStore(s => s.addToCart)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    catalogueService.getProduct(slug, id)
      .then(data => {
        if (cancelled) return
        setProduct(data.product)
        if (data.product?.colors?.length === 1) setSelectedColor(data.product.colors[0])
        if (data.product?.sizes?.length === 1) setSelectedSize(data.product.sizes[0])
      })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="aspect-[3/4] w-full bg-navy-light dark:bg-navy animate-pulse" />
        <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-3">
          <div className="h-6 w-3/4 bg-navy/10 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-1/3 bg-navy/10 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-12 w-full bg-navy/8 dark:bg-white/8 rounded-xl mt-3 animate-pulse" />
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-h3 font-display font-bold text-navy dark:text-white">Produit introuvable</p>
        <p className="text-body text-navy/60 dark:text-white/50">Ce produit n'existe plus ou a été retiré.</p>
        <button
          onClick={() => navigate(`/boutique/${slug}`)}
          className="mt-2 px-4 py-2 rounded-full bg-navy text-white text-label font-semibold"
        >
          Retour à la boutique
        </button>
      </div>
    )
  }

  const outOfStock = product.stock <= 0
  const needsColor = product.colors?.length > 0 && !selectedColor
  const needsSize  = product.sizes?.length > 0 && !selectedSize

  function handleAdd() {
    if (outOfStock || needsColor || needsSize) return
    addToCartStore({ ...product, selectedSize }, selectedColor, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep pb-28">
      {/* Header retour */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
        <button
          onClick={() => navigate(`/boutique/${slug}`)}
          className="flex items-center gap-1.5 text-label font-semibold text-navy dark:text-white"
        >
          <ChevronLeft size={18} /> Retour
        </button>
      </div>

      <PhotoCarousel images={product.images} name={product.name} />

      <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-4">
        <div>
          <p className="text-h2 font-display font-bold text-navy dark:text-white">{product.name}</p>
          <p className="text-h3 font-bold text-orange mt-1">{formatFCFA(product.price)}</p>
          {product.wholesale_price && (
            <p className="text-label text-navy/50 dark:text-white/40">
              Prix en gros : {formatFCFA(product.wholesale_price)}
            </p>
          )}
        </div>

        {outOfStock && (
          <span className="self-start text-label font-semibold bg-black/70 text-white px-3 py-1 rounded-full">
            Épuisé
          </span>
        )}

        {product.description && (
          <p className="text-body text-navy/70 dark:text-white/60 whitespace-pre-line">
            {product.description}
          </p>
        )}

        {/* Couleurs */}
        {product.colors?.length > 0 && (
          <div>
            <p className="text-label font-semibold text-navy dark:text-white mb-2">Couleur</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label border transition-all',
                    selectedColor === color
                      ? 'border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy'
                      : 'border-[var(--border-default)] text-[var(--text-secondary)]'
                  )}
                >
                  {COLOR_MAP[color] && (
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                      style={{ background: COLOR_MAP[color] }}
                    />
                  )}
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tailles */}
        {product.sizes?.length > 0 && (
          <div>
            <p className="text-label font-semibold text-navy dark:text-white mb-2">Taille</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-label border transition-all',
                    selectedSize === size
                      ? 'border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy'
                      : 'border-[var(--border-default)] text-[var(--text-secondary)]'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantité */}
        {!outOfStock && (
          <div>
            <p className="text-label font-semibold text-navy dark:text-white mb-2">Quantité</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border border-[var(--border-default)] flex items-center justify-center text-navy dark:text-white active:scale-90 transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="text-body font-semibold text-navy dark:text-white w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-9 h-9 rounded-full border border-[var(--border-default)] flex items-center justify-center text-navy dark:text-white active:scale-90 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barre d'action fixe */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white/90 dark:bg-navy/90 backdrop-blur-glass border-t border-navy/8 dark:border-white/8 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleAdd}
            disabled={outOfStock || needsColor || needsSize}
            className={cn(
              'w-full py-3 rounded-full text-label font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]',
              outOfStock
                ? 'bg-navy/10 text-navy/40 dark:bg-white/10 dark:text-white/30 cursor-not-allowed'
                : 'bg-navy text-white dark:bg-white dark:text-navy'
            )}
          >
            {outOfStock ? 'Épuisé' : added ? '✓ Ajouté au panier' : (
              <><ShoppingBag size={16} /> {needsColor ? 'Choisir une couleur' : needsSize ? 'Choisir une taille' : 'Ajouter au panier'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}