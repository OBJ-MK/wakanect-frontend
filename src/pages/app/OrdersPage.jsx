import { useState } from 'react'
import { Search, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/hooks/useOrders'
import { OrderDetail } from '@/components/features/orders/OrderDetail'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PaymentBadge } from '@/components/features/orders/PaymentBadge'
import { formatFCFA, formatRelativeTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const MOCK_ORDERS = []

export function OrdersPage() {
  const { orders: fetchedOrders, loading, changeStatus } = useOrders()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const orders = fetchedOrders
  const filtered = orders.filter(o =>
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOrder = selected ? (orders.find(o => o.id === selected) ?? null) : null

  async function handleStatusUpdate(status) {
    if (!selected) return
    setStatusUpdating(true)
    await changeStatus(selected, status)
    setStatusUpdating(false)
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
        <div className="page-container py-5">
          <OrderDetail
            order={selectedOrder}
            onStatusUpdate={handleStatusUpdate}
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
          <h1 className="font-display font-bold text-h2 text-white mb-3">Commandes</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              placeholder="Rechercher un client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder:text-white/35 text-body focus:outline-none focus:border-orange/50"
            />
          </div>
        </div>
      </div>

      <div className="page-container py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
