import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, Package, Minus, Plus } from 'lucide-react'
import { useTenant } from '@/hooks/useTenant'
import { useCatalogueStore } from '@/store/catalogueStore'
import { formatFCFA } from '@/lib/formatters'
import { buildWhatsAppLink } from '@/lib/utils'
import { cn } from '@/lib/utils'


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
  const { boutique, loading } = useTenant()
  const addToCartStore = useCatalogueStore(s => s.addToCart)

  const product = boutique?.products?.find(p => p.id === id) ?? null
  const shopPhone = boutique?.whatsapp_number ?? ''

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)

  const outOfStock = product ? product.stock === 0 : true

  // Variantes couleur avec quantités — les puces viennent des variantes si présentes
  const variants = product?.variants ?? []
  const hasVariants = variants.length > 0
  const displayColors = hasVariants ? variants.map(v => v.color) : (product?.colors ?? [])

  // Défaut : couleur à la quantité la plus abondante (à égalité, la première)
  const defaultColor = hasVariants
    ? variants.reduce((best, v) => (Number(v.quantity) > Number(best.quantity) ? v : best), variants[0]).color
    : (product?.colors?.[0] ?? null)
  const activeColor = selectedColor ?? defaultColor

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep animate-pulse">
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <Link to={`/boutique/${slug}`} className="p-2 -ml-2 rounded-xl text-navy/60 dark:text-white/60">
              <ChevronLeft size={20} />
            </Link>
            <div className="h-5 w-40 bg-navy/10 dark:bg-white/10 rounded" />
          </div>
        </div>
        <div className="aspect-[3/4] w-full bg-cream-dark dark:bg-navy-light" />
        <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-4">
          <div className="h-3 w-20 bg-navy/8 dark:bg-white/8 rounded" />
          <div className="h-7 w-3/4 bg-navy/10 dark:bg-white/10 rounded" />
          <div className="h-8 w-1/3 bg-navy/10 dark:bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center px-5 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-navy/8 dark:bg-white/8 flex items-center justify-center">
          <Package size={28} className="text-navy/30 dark:text-white/25" />
        </div>
        <p className="font-display font-bold text-h3 text-navy dark:text-white">Produit introuvable</p>
        <p className="text-label text-navy/50 dark:text-white/40">Ce produit n'existe plus ou a été retiré de la boutique.</p>
        <Link
          to={`/boutique/${slug}`}
          className="mt-2 px-5 py-2.5 rounded-2xl bg-orange text-white text-label font-semibold hover:bg-orange-hi transition-all"
        >
          Voir la boutique
        </Link>
      </div>
    )
  }

  const colorAvailable = (color) => product.colors?.includes(color)

  function buildWaMsg(color) {
    return `Bonjour, je souhaite commander "${product.name}"${color ? ` en ${color}` : ''}. Est-ce disponible ?`
  }

  function addToCart() {
    addToCartStore(product, activeColor, qty)
    navigate(`/boutique/${slug}/commande`)
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to={`/boutique/${slug}`}
            className="p-2 -ml-2 rounded-xl text-navy/60 dark:text-white/60 hover:bg-navy/8 dark:hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <p className="font-display font-semibold text-navy dark:text-white flex-1 truncate">
            {product.name}
          </p>
        </div>
      </div>

      {/* Photo carousel */}
      <PhotoCarousel images={product.images} name={product.name} />

      <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-5">
        {/* Product header */}
        <div>
          <p className="text-micro text-navy/40 dark:text-white/40 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h1 className="font-display font-bold text-h2 text-navy dark:text-white">{product.name}</h1>
          <p className="font-display font-bold text-h1 text-orange mt-1">{formatFCFA(product.price)}</p>

          {outOfStock ? (
            <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/15 text-red-500 dark:text-red-400 text-label font-semibold">
              Épuisé
            </span>
          ) : (
            <p className="text-label text-navy/50 dark:text-white/40 mt-1">
              {product.stock} en stock
            </p>
          )}
        </div>

        {/* Colors */}
        {displayColors.length > 0 && (
          <div>
            <p className="text-label font-semibold text-navy/70 dark:text-white/60 mb-2.5">
              Couleur — <span className="font-normal">{activeColor ?? 'Choisir'}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {displayColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-label font-medium',
                    activeColor === color
                      ? 'border-orange bg-orange/10 text-orange dark:text-orange'
                      : 'border-navy/15 dark:border-white/15 text-navy/70 dark:text-white/60 hover:border-navy/30 dark:hover:border-white/30',
                  )}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ background: COLOR_MAP[color] ?? '#888' }}
                  />
                  {color}
                </button>
              ))}
            </div>

            {/* Ask for unavailable color on WA */}
            {shopPhone && (
              <a
                href={buildWhatsAppLink(shopPhone, buildWaMsg(null))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-label text-wa-green hover:opacity-75 transition-opacity"
              >
                <MessageCircle size={14} />
                Demander une autre couleur sur WhatsApp
              </a>
            )}
          </div>
        )}

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div>
            <p className="text-label font-semibold text-navy/70 dark:text-white/60 mb-2.5">
              Taille — <span className="font-normal">{selectedSize ?? 'Choisir'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'px-4 py-2 rounded-xl border text-label font-semibold transition-all',
                    selectedSize === size
                      ? 'border-orange bg-orange/10 text-orange'
                      : 'border-navy/15 dark:border-white/15 text-navy/70 dark:text-white/60 hover:border-navy/30 dark:hover:border-white/30',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <p className="text-label font-semibold text-navy/70 dark:text-white/60 flex-1">Quantité</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl border border-navy/15 dark:border-white/15 flex items-center justify-center text-navy/60 dark:text-white/60 hover:bg-navy/8 dark:hover:bg-white/8 active:scale-90 transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="font-display font-bold text-h3 text-navy dark:text-white min-w-[2ch] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty(q => Math.min(product.stock, q + 1))}
              disabled={qty >= product.stock}
              className="w-9 h-9 rounded-xl bg-orange/15 flex items-center justify-center text-orange hover:bg-orange/25 active:scale-90 transition-all disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <p className="text-label font-semibold text-navy/70 dark:text-white/60 mb-2">Description</p>
            <p className="text-body text-navy/60 dark:text-white/55 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={addToCart}
            disabled={outOfStock}
            className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-orange-glow"
          >
            <ShoppingBag size={18} />
            {outOfStock ? 'Épuisé' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}
