import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
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
  { value: 'recent', label: 'Plus récentes' },
  { value: 'price_asc', label: 'Total croissant' },
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
  const [page, setPage] = useState(1)
  const listRef = useRef(null)
  const listScrollRef = useRef(null)

  // Filtrage server-side : statut + recherche (débouncée dans le hook) + tri
  const { orders: fetchedOrders, loading, total, pages, changeStatus, markPaid, notifyLinkOpened, notifyConfirm } = useOrders({
    search: filters.search,
    status: filters.category,
    sort: filters.sort,
    page,
  })

  const [selected, setSelected] = useState(null)
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

    if (window.matchMedia('(min-width: 1024px)').matches) {
      listScrollRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } else {
      listRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
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

  async function handleCancel(reason, reasonDetail) {
    if (!selected) return
    if (!ensure(PERM.ORDERS_CANCEL)) return
    setStatusUpdating(true)
    try {
      await changeStatus(selected, 'Annulée', reason, reasonDetail)
    } finally {
      setStatusUpdating(false)
    }
  }

  async function handleNotifyLinkOpened() {
    if (!selected) return
    notifyLinkOpened(selected).catch(() => { })
  }

  async function handleNotifyConfirm() {
    if (!selected) return
    setStatusUpdating(true)
    try {
      await notifyConfirm(selected)
    } finally {
      setStatusUpdating(false)
    }
  }

  return (
    // lg: split liste/détail côte à côte — sur mobile, un seul des deux est
    // affiché à la fois (comportement inchangé, plein écran).
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-navy-deep lg:h-[calc(100dvh-2rem)] lg:overflow-hidden lg:flex lg:items-stretch lg:gap-5 lg:p-6">
      {/* Colonne liste */}
      <div className={`${selectedOrder ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[390px] lg:shrink-0 lg:min-h-0 lg:sticky lg:top-6 lg:self-start lg:h-full lg:rounded-3xl lg:bg-navy/45 lg:ring-1 lg:ring-white/8 lg:shadow-card lg:overflow-hidden`}>
        <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3 lg:shrink-0 lg:static lg:!bg-transparent lg:!backdrop-blur-none lg:!border-0 lg:!shadow-none lg:px-5 lg:pt-5 lg:pb-4">
          <div className="max-w-lg mx-auto lg:max-w-none">
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
              compact
            />
          </div>
        </div>

        <div className="page-container lg:mx-0 lg:w-full py-4 flex flex-col gap-3 lg:max-w-none lg:px-4 lg:pb-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          {loading ? (
            <div
              ref={listScrollRef}
              className="glass rounded-3xl overflow-y-auto lg:min-h-0 lg:flex-1"
            >
              <div ref={listRef}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <OrderRowSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* LISTE DES COMMANDES : c'est elle qui scroll sur desktop */}
              <div
                ref={listScrollRef}
                className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain"
              >
                <div
                  ref={listRef}
                  className="glass rounded-2xl overflow-hidden scroll-mt-40"
                >
                  {fetchedOrders.map(order => (
                    <button
                      key={order.id}
                      onClick={() => setSelected(order.id)}
                      className={`w-full min-w-0 flex flex-col gap-2.5 px-4 py-3.5 border-b border-white/6 last:border-0 hover:bg-white/4 active:bg-white/8 transition-colors text-left lg:flex-row lg:items-start lg:gap-3 lg:py-3 ${selected === order.id ? 'lg:bg-orange/8' : ''
                        }`}
                    >
                      <div className="w-full min-w-0">
                        <div className="flex items-start justify-between gap-3 min-w-0">
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] leading-5 font-semibold text-white break-words lg:truncate">
                              {order.customer_name}
                            </p>

                            <p className="text-[11px] leading-4 text-white/40">
                              {formatRelativeTime(order.created_at)}
                            </p>
                          </div>

                          <p className="text-[12px] leading-4 font-bold text-amber shrink-0 whitespace-nowrap">
                            {formatFCFA(order.total)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 mt-1.5 min-w-0">
                          <StatusBadge status={order.status} />

                          {order.status !== 'Annulée' && (
                            <>
                              <span className="text-white/20 text-micro">·</span>
                              <PaymentBadge
                                status={order.payment_status}
                                compact
                              />
                            </>
                          )}
                        </div>

                        <PerformedBy
                          actor={order.performed_by}
                          className="mt-1"
                        />
                      </div>
                    </button>
                  ))}

                  {fetchedOrders.length === 0 && (
                    <div className="flex flex-col items-center py-12 text-center">
                      <p className="text-body text-white/50">
                        Aucune commande trouvée
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination fixe en bas du panneau desktop */}
              <div className="shrink-0">
                <Pagination
                  page={page}
                  pages={pages}
                  onChange={changePage}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Colonne détail — plein écran sur mobile si sélectionnée, sinon
          état vide visible seulement sur desktop (rien à montrer sur mobile
          tant que rien n'est sélectionné, la liste occupe déjà l'écran). */}
      <div className={`${selectedOrder ? 'block' : 'hidden lg:block'} flex-1 min-w-0 lg:min-h-0`}>
        {selectedOrder ? (
          <div className="min-h-screen bg-navy-deep lg:h-full lg:min-h-0 lg:rounded-3xl lg:bg-navy/25 lg:ring-1 lg:ring-white/8 lg:shadow-card lg:overflow-y-auto">
            <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3 lg:static lg:!bg-transparent lg:!backdrop-blur-none lg:!border-0 lg:!shadow-none lg:px-7 lg:pt-6 lg:pb-3">
              <div className="max-w-lg mx-auto lg:max-w-none flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors lg:hidden"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex-1">
                  <h1 className="font-display font-semibold text-h3 text-white">
                    {selectedOrder.customer_name}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={selectedOrder.status} />
                    {selectedOrder.status !== 'Annulée' && (
                      <PaymentBadge status={selectedOrder.payment_status} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="page-container py-5 pb-56 lg:max-w-none lg:px-7 lg:pb-10">
              <OrderDetail
                order={selectedOrder}
                onStatusUpdate={handleStatusUpdate}
                onCancel={handleCancel}
                onMarkPaid={handleMarkPaid}
                onNotifyLinkOpened={handleNotifyLinkOpened}
                onNotifyConfirm={handleNotifyConfirm}
                loading={statusUpdating}
              />
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center min-h-[calc(100dvh-3rem)] text-center px-8 rounded-3xl bg-navy/25 ring-1 ring-white/8">
            <div className="w-16 h-16 rounded-full bg-white/6 flex items-center justify-center mb-4">
              <ShoppingBag size={26} className="text-white/25" />
            </div>
            <p className="text-body text-white/40">Sélectionnez une commande pour voir le détail</p>
          </div>
        )}
      </div>
    </div>
  )
}