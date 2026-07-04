import { useState, useRef } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderDetail } from '@/components/features/orders/OrderDetail'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PaymentBadge } from '@/components/features/orders/PaymentBadge'
import { formatFCFA, formatRelativeTime } from '@/lib/formatters'
import { FilterBar } from '@/components/features/catalogue/FilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { usePermissions } from '@/hooks/usePermissions'
import { PerformedBy } from '@/components/ui/PerformedBy'
import { PERM } from '@/lib/permissions'

const STATUS_FILTERS = ['Toutes', 'Nouvelle', 'Confirmée', 'Livrée', 'Annulée']

const ORDER_SORT_OPTIONS = [
  { value: 'recent',     label: 'Plus récentes' },
  { value: 'price_asc',  label: 'Total croissant' },
  { value: 'price_desc', label: 'Total décroissant' },
]

const DEFAULT_FILTERS = { search: '', category: 'Toutes', priceMin: '', priceMax: '', sort: 'recent' }

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
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [page, setPage]       = useState(1)
  const listRef = useRef(null)

  // Filtrage server-side : statut + recherche (débouncée dans le hook) + tri
  const { orders: fetchedOrders, loading, total, pages, changeStatus, markPaid } = useOrders({
    search: filters.search,
    status: filters.category,
    sort:   filters.sort,
    page,
  })

  const [selected, setSelected]       = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const { ensure } = usePermissions()

  const selectedOrder = selected ? (fetchedOrders.find(o => o.id === selected) ?? null) : null

  // Tout changement de filtre repart en page 1 — uniquement setState → fetch → re-render
  function updateFilters(partial) {
    setFilters(prev => ({ ...prev, ...partial }))
    setPage(1)
  }

  // Scroll doux vers le haut de la LISTE (pas de la page)
  function changePage(n) {
    setPage(n)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleStatusUpdate(status) {
    if (!selected) return
    // Blocage dès le clic : annulation vs confirmation/livraison
    const perm = status === 'Annulée' || status === 'cancelled'
      ? PERM.ORDERS_CANCEL
      : PERM.ORDERS_CONFIRM
    if (!ensure(perm)) return
    setStatusUpdating(true)
    try {
      await changeStatus(selected, status)
    } finally {
      setStatusUpdating(false)
    }
  }

  async function handleMarkPaid() {
    if (!selected) return
    if (!ensure(PERM.ORDERS_MARK_PAID)) return
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
          <FilterBar
            filters={filters}
            onChange={updateFilters}
            onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1) }}
            categories={STATUS_FILTERS}
            defaultCategory="Toutes"
            showPrice={false}
            sortOptions={ORDER_SORT_OPTIONS}
            total={loading ? null : total}
          />
        </div>
      </div>

      <div className="page-container py-4 flex flex-col gap-3">
        {loading ? (
          <div ref={listRef} className="glass rounded-3xl overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div ref={listRef} className="glass rounded-3xl overflow-hidden scroll-mt-40">
              {fetchedOrders.map(order => (
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
                    <PerformedBy actor={order.performed_by} className="mt-1.5" />
                  </div>
                  <p className="text-label font-bold text-amber shrink-0">{formatFCFA(order.total)}</p>
                </button>
              ))}
              {fetchedOrders.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                  <p className="text-body text-white/50">Aucune commande trouvée</p>
                </div>
              )}
            </div>

            <Pagination page={page} pages={pages} onChange={changePage} />
          </>
        )}
      </div>
    </div>
  )
}
