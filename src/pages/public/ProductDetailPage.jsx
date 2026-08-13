import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, Package, Minus, Plus } from 'lucide-react'
import { useTenant } from '@/hooks/useTenant'
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
  const addToCartStore = useCatalogueStore(s => s.addToCart)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    catalogueService.getProduct(slug, id)
      .then(data => { if (!cancelled) setProduct(data.product) })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug, id])
}
