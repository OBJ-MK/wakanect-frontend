import { useNavigate, useParams } from 'react-router-dom'
import { X, ChevronRight, Package } from 'lucide-react'
import { useOrdersCacheStore } from '@/store/ordersCacheStore'
import { formatFCFA } from '@/lib/formatters'

export function MyOrdersSheet({ isOpen, onClose }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const getOrdersForSlug = useOrdersCacheStore(s => s.getOrdersForSlug)
  const orders = slug ? getOrdersForSlug(slug) : []

  if (!isOpen) return null

  function handleSelect(order) {
    onClose()
    navigate(`/boutique/${slug}/suivi/${order.trackingCode}`)
  }

  return (
    // Bottom sheet en mobile, tiroir latéral droit plein hauteur en desktop
    // (voir CartSheet — même pattern).
    <div className="fixed inset-0 z-50 flex items-end lg:items-stretch lg:justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-navy rounded-t-4xl shadow-modal animate-slide-up max-h-[75dvh] flex flex-col lg:max-w-[420px] lg:mx-0 lg:h-full lg:max-h-none lg:rounded-t-none lg:rounded-l-4xl lg:animate-drawer-in">
        <div className="flex justify-center pt-3 pb-1 shrink-0 lg:hidden">
          <div className="w-10 h-1 rounded-full bg-navy/15 dark:bg-white/15" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <h2 className="font-display font-bold text-h3 text-navy dark:text-white">Mes commandes</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-navy/50 dark:text-white/50 hover:bg-navy/8 dark:hover:bg-white/8 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2 flex flex-col gap-2 safe-bottom">
          {orders.map(order => (
            <button
              key={order.trackingCode}
              onClick={() => handleSelect(order)}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream dark:bg-navy-light text-left hover:bg-cream-dark dark:hover:bg-navy transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                <Package size={18} className="text-orange" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body font-semibold text-navy dark:text-white truncate">{order.orderNumber}</p>
                <p className="text-micro text-navy/50 dark:text-white/40">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · {formatFCFA(order.total)}
                </p>
              </div>
              <ChevronRight size={16} className="text-navy/30 dark:text-white/30 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}