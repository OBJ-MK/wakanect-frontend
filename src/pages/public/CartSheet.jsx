import { useEffect } from 'react'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCatalogueStore } from '@/store/catalogueStore'
import { formatFCFA } from '@/lib/formatters'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function CartSheet({ isOpen, onClose }) {
  const { slug } = useParams()
  const cart = useCatalogueStore(s => s.cart)
  const updateQty = useCatalogueStore(s => s.updateQty)
  const removeFromCart = useCatalogueStore(s => s.removeFromCart)
  const navigate = useNavigate()

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-navy rounded-t-4xl shadow-modal animate-slide-up max-h-[85dvh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-navy/15 dark:bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <h2 className="font-display font-bold text-h3 text-navy dark:text-white">
            Panier
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-navy/50 dark:text-white/50 hover:bg-navy/8 dark:hover:bg-white/8 transition-colors"
            aria-label="Fermer le panier"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <ShoppingBag size={36} className="text-navy/20 dark:text-white/20 mb-3" />
              <p className="text-body text-navy/50 dark:text-white/50">Votre panier est vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.key}
                className="flex items-center gap-3 p-3 rounded-2xl bg-cream dark:bg-navy-light"
              >
                <div className="w-12 h-12 rounded-xl bg-cream-dark dark:bg-navy flex items-center justify-center shrink-0 text-xl">
                  🛍️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-navy dark:text-white truncate">{item.name}</p>
                  {item.selectedColor && (
                    <p className="text-micro text-navy/50 dark:text-white/45">{item.selectedColor}</p>
                  )}
                  <p className="text-label font-bold text-orange mt-0.5">{formatFCFA(item.price)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQty(item.key, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-navy/10 dark:bg-white/10 flex items-center justify-center hover:bg-navy/20 dark:hover:bg-white/20 transition-colors"
                    aria-label="Diminuer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-body font-semibold text-navy dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.key, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-navy/10 dark:bg-white/10 flex items-center justify-center hover:bg-navy/20 dark:hover:bg-white/20 transition-colors"
                    aria-label="Augmenter"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-5 border-t border-navy/8 dark:border-white/8 shrink-0 safe-bottom">
            <div className="flex items-center justify-between mb-4">
              <p className="text-body text-navy/60 dark:text-white/60">Total</p>
              <p className="font-display font-bold text-h2 text-navy dark:text-white">{formatFCFA(total)}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => { onClose(); navigate(`/boutique/${slug}/commande`) }}
            >
              Valider la commande
            </Button>
            <button
              onClick={onClose}
              className="w-full text-center text-label text-navy/45 dark:text-white/45 mt-3 hover:text-navy dark:hover:text-white transition-colors py-1"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
