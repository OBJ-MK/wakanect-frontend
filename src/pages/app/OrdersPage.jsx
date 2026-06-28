import { useState } from 'react'
import { Search, ChevronLeft } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderDetail } from '@/components/features/orders/OrderDetail'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PaymentBadge } from '@/components/features/orders/PaymentBadge'
import { formatFCFA, formatRelativeTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'

const STATUS_FILTERS = ['Toutes', 'Nouvelle', 'Confirmée', 'Livrée', 'Annulée']

function OrderRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-4 border-b border-white/6 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-3 w-20 bg-white/8 rounded" />
        <div className="flex gap-1.5 mt-0.5">
          <div className="h-5 w-20 bg-white/8 rounded-full" />
          <div className="h-5 w-16 bg-white/8 rounded-full" />
        </div>
      </div>
      <div className="h-4 w-16 bg-white/10 rounded mt-1" />
    </div>
  )
}

export function OrdersPage() {
  const { orders: fetchedOrders, loading, loadingMore, hasMore, loadMore, total, changeStatus, markPaid } = useOrders()
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('Toutes')
  const [selected, setSelected]       = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const filtered = fetchedOrders.filter(o => {
    const matchesSearch = o.customer_name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'Toutes' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selectedOrder = selected ? (fetchedOrders.find(o => o.id === selected) ?? null) : null

  async function handleStatusUpdate(status) {
    if (!selected) return
    setStatusUpdating(true)
    try {
      await changeStatus(selected, status)
    } finally {
      setStatusUpdating(false)
    }
  }

  async function handleMarkPaid() {
    if (!selected) return
    setStatusUpdating(true)
    try {
      await markPaid(selected)
    } finally {
      setStatusUpdating(false)
    }
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-navy-deep">
        <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button
              onClick={() => setSelected(null)}
              className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-display font-semibold text-h3 text-white">
                {selectedOrder.customer_name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={selectedOrder.status} />
                <span className="text-white/20">·</span>
                <PaymentBadge status={selectedOrder.payment_status} />
              </div>
            </div>
          </div>
        </div>
        <div className="page-container py-5 pb-56">
          <OrderDetail
            order={selectedOrder}
            onStatusUpdate={handleStatusUpdate}
            onMarkPaid={handleMarkPaid}
            loading={statusUpdating}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display font-bold text-h2 text-white">Commandes</h1>
            {total > 0 && (
              <span className="text-micro text-white/40">{total} au total</span>
            )}
          </div>
          <Input
            icon={<Search size={16} />}
            type="search"
            placeholder="Rechercher un client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            containerClassName="mb-3"
            className="py-2.5"
          />
          <div
            className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5"
            role="group"
            aria-label="Filtres par statut"
          >
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                aria-pressed={statusFilter === f}
                className={cn(
                  'flex-shrink-0 px-4 py-1.5 rounded-full text-label font-semibold transition-colors whitespace-nowrap',
                  statusFilter === f
                    ? 'bg-orange text-white shadow-orange-glow'
                    : 'bg-white/8 text-white/60 border border-white/10 hover:border-orange/40',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-4 flex flex-col gap-3">
        {loading ? (
          <div className="glass rounded-3xl overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="glass rounded-3xl overflow-hidden">
              {filtered.map(order => (
                <button
                  key={order.id}
                  onClick={() => setSelected(order.id)}
                  className="w-full flex items-start gap-3 px-4 py-4 border-b border-white/6 last:border-0 hover:bg-white/4 active:bg-white/8 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-white">{order.customer_name}</p>
                    <p className="text-micro text-white/40 mb-1.5">{formatRelativeTime(order.created_at)}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={order.status} />
                      <span className="text-white/20 text-micro">·</span>
                      <PaymentBadge status={order.payment_status} />
                    </div>
                  </div>
                  <p className="text-label font-bold text-amber shrink-0">{formatFCFA(order.total)}</p>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                  <p className="text-body text-white/50">Aucune commande trouvée</p>
                </div>
              )}
            </div>

            {/* Charger plus — visible seulement sans filtre actif */}
            {hasMore && !search && statusFilter === 'Toutes' && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-3 rounded-2xl glass border border-white/10 text-label text-white/60 hover:text-white hover:border-orange/40 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
                    Chargement…
                  </span>
                ) : (
                  `Voir les commandes plus anciennes (${total - fetchedOrders.length} restantes)`
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
