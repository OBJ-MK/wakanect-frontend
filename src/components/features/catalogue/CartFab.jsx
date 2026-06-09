import { ShoppingCart } from 'lucide-react'
import { useCatalogueStore } from '@/store/catalogueStore'
import { cn } from '@/lib/utils'

export function CartFab({ onOpen }) {
  const cart = useCatalogueStore(s => s.cart)
  const count = cart.reduce((sum, i) => sum + i.quantity, 0)

  if (count === 0) return null

  return (
    <button
      onClick={onOpen}
      className={cn(
        'fixed bottom-6 right-4 z-30',
        'flex items-center gap-2.5 px-5 py-3.5 rounded-full',
        'bg-orange shadow-orange-glow text-white',
        'font-display font-semibold text-body',
        'active:scale-95 transition-transform',
      )}
      aria-label={`Voir le panier — ${count} article${count > 1 ? 's' : ''}`}
    >
      <ShoppingCart size={20} />
      <span>{count}</span>
    </button>
  )
}
