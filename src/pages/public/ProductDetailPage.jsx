import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, Package, Minus, Plus } from 'lucide-react'
import { useCatalogueStore } from '@/store/catalogueStore'
import { formatFCFA } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { catalogueService } from '@/services/catalogueService'
import { track } from '@/lib/track'
import { usePageDuration } from '@/hooks/usePageDuration'

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



function PhotoCarousel({ images, name, idx, setIdx }) {
  const count = Math.max(1, images?.length ?? 0)

  function prev() { setIdx(i => (i - 1 + count) % count) }
  function next() { setIdx(i => (i + 1) % count) }

  return (
    <div className="lg:w-[460px] lg:shrink-0">
      <div className="relative bg-cream dark:bg-navy-light aspect-[3/4] w-full overflow-hidden lg:aspect-square lg:rounded-2xl lg:border lg:border-navy/8 lg:dark:border-white/10">
        {images?.length > 0 ? (
          <img
            src={images[idx]?.url}
            alt={`${name} — photo ${idx + 1}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-navy/20 dark:text-white/20">
            <Package size={48} />
            <p className="text-label">Aucune photo</p>
          </div>
        )}

        {count > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all lg:hidden"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all lg:hidden"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
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

      {/* Vignettes — desktop uniquement (façon Alibaba) */}
      {count > 1 && (
        <div className="hidden lg:flex gap-2.5 mt-3">
          {images.map((img, i) => (
            <button
              key={img.url ?? i}
              onClick={() => setIdx(i)}
              className={cn(
                'w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                i === idx
                  ? 'border-orange'
                  : 'border-transparent hover:border-navy/15 dark:hover:border-white/15'
              )}
            >
              <img src={img.url} alt={`${name} — miniature ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductDetailPage() {
  const { slug, id } = useParams()
  const navigate = useNavigate()
  const addToCartStore = useCatalogueStore(s => s.addToCart)
  usePageDuration(slug, 'product', { productId: id }, id)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    catalogueService.getProduct(slug, id)
      .then(data => {
        if (cancelled) return
        setProduct(data.product)
        setPhotoIdx(0)
        if (data.product?.colors?.length === 1) setSelectedColor(data.product.colors[0])
        if (data.product?.sizes?.length === 1) setSelectedSize(data.product.sizes[0])
        track(slug, 'product_view', { productId: id })
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
  const needsSize = product.sizes?.length > 0 && !selectedSize

  function handleAdd() {
    if (outOfStock || needsColor || needsSize) return
    addToCartStore({ ...product, selectedSize }, selectedColor, quantity)
    track(slug, 'add_to_cart', { productId: id })
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep pb-28 lg:pb-16">
      {/* Header retour */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3 lg:static lg:!bg-transparent lg:!backdrop-blur-none lg:!border-0 lg:!shadow-none lg:px-8 lg:pt-6 lg:pb-0">
        <button
          onClick={() => navigate(`/boutique/${slug}`)}
          className="flex items-center gap-1.5 text-label font-semibold text-navy dark:text-white lg:max-w-[1200px] lg:mx-auto lg:hover:text-orange lg:transition-colors"
        >
          <ChevronLeft size={18} /> Retour à la boutique
        </button>
      </div>

      <div className="lg:flex lg:gap-10 lg:max-w-[1200px] lg:mx-auto lg:px-8 lg:pt-6 lg:items-start">
        <PhotoCarousel images={product.images} name={product.name} idx={photoIdx} setIdx={setPhotoIdx} />

      <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-4 lg:max-w-none lg:mx-0 lg:px-0 lg:py-0 lg:flex-1">
        <div>
          <p className="text-h2 font-display font-bold text-navy dark:text-white lg:text-h1">{product.name}</p>
          <p className="text-h3 font-bold text-orange mt-1 lg:text-h2">{formatFCFA(product.price)}</p>
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
          <p className="text-body text-navy/70 dark:text-white/60 whitespace-pre-line lg:border-t lg:border-navy/8 lg:dark:border-white/10 lg:pt-4">
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
                      : 'border-[var(--border-default)] text-[var(--text-secondary)] lg:hover:border-navy/30 lg:dark:hover:border-white/30'
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
                      : 'border-[var(--border-default)] text-[var(--text-secondary)] lg:hover:border-navy/30 lg:dark:hover:border-white/30'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buy box — quantité + bouton d'achat regroupés (desktop : carte façon "Ajouter au panier" Alibaba) */}
        <div className="lg:mt-2 lg:bg-white lg:dark:bg-navy-light lg:border lg:border-navy/8 lg:dark:border-white/10 lg:rounded-2xl lg:p-5 lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-6">
          {!outOfStock && (
            <div>
              <p className="text-label font-semibold text-navy dark:text-white mb-2">Quantité</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-[var(--border-default)] flex items-center justify-center text-navy dark:text-white active:scale-90 transition-all lg:hover:border-navy/30 lg:dark:hover:border-white/30"
                >
                  <Minus size={16} />
                </button>
                <span className="text-body font-semibold text-navy dark:text-white w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-full border border-[var(--border-default)] flex items-center justify-center text-navy dark:text-white active:scale-90 transition-all lg:hover:border-navy/30 lg:dark:hover:border-white/30"
                >
                  <Plus size={16} />
                </button>
                <span className="text-micro text-navy/40 dark:text-white/30 ml-1">{product.stock} en stock</span>
              </div>
            </div>
          )}

          {/* Bouton d'achat — visible uniquement dans la buy box desktop (mobile garde la barre fixe) */}
          <button
            onClick={handleAdd}
            disabled={outOfStock || needsColor || needsSize}
            className={cn(
              'hidden lg:flex w-full py-3.5 rounded-full text-label font-semibold items-center justify-center gap-2 transition-all active:scale-[0.98]',
              outOfStock
                ? 'bg-navy/10 text-navy/40 dark:bg-white/10 dark:text-white/30 cursor-not-allowed'
                : 'bg-navy text-white dark:bg-white dark:text-navy lg:hover:opacity-90'
            )}
          >
            {outOfStock ? 'Épuisé' : added ? '✓ Ajouté au panier' : (
              <><ShoppingBag size={16} /> {needsColor ? 'Choisir une couleur' : needsSize ? 'Choisir une taille' : 'Ajouter au panier'}</>
            )}
          </button>
        </div>
      </div>
      </div>

      {/* Barre d'action fixe — mobile uniquement, remplacée par la buy box en colonne sur desktop */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white/90 dark:bg-navy/90 backdrop-blur-glass border-t border-navy/8 dark:border-white/8 px-4 py-3 lg:hidden">
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