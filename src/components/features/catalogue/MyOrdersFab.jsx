import { useParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { useOrdersCacheStore } from '@/store/ordersCacheStore'
import { cn } from '@/lib/utils'

export function MyOrdersFab({ onOpen }) {
  const { slug } = useParams()
  const getOrdersForSlug = useOrdersCacheStore(s => s.getOrdersForSlug)
  const orders = slug ? getOrdersForSlug(slug) : []

  if (orders.length === 0) return null

  return (
    <button
      onClick={onOpen}
      className={cn(
        'fixed bottom-24 right-4 z-30 lg:hidden',
        'flex items-center gap-2.5 px-5 py-3.5 rounded-full',
        'bg-navy dark:bg-white/10 border border-white/10 dark:border-white/15 shadow-card text-white',
        'font-display font-semibold text-body',
        'active:scale-95 transition-transform',
      )}
      aria-label={`Mes commandes — ${orders.length}`}
    >
      <PackageSearch size={20} />
      {orders.length > 1 && <span>{orders.length}</span>}
    </button>
  )
}