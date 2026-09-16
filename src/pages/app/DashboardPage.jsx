import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, CheckSquare,
  Bell, ChevronRight, AlertTriangle, ShieldAlert,
  ShoppingBag, ArrowUpRight,
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/authStore'
import { formatFCFA, formatRelativeTime } from '@/lib/formatters'
import { WakanectLogo } from '@/components/brand/WakanectLogo'
import { RevenueChart } from '@/components/features/dashbord/RevenueChart'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { notificationService } from '@/services/notificationService'

const EMPTY_STATS = {
  revenue: 0,
  revenue_today: 0,
  revenue_change: null,
  pending_validation: 0,
  pending_orders_count: 0,
  orders_count: 0,
  low_stock_count: 0,
  recent_orders: [],
}

const PERIODS = [
  { id: 'day',   label: 'Jour',    title: "Revenu aujourd'hui",       compare: 'vs hier' },
  { id: 'week',  label: 'Semaine', title: 'Revenu — 7 derniers jours',  compare: 'vs semaine précédente' },
  { id: 'month', label: 'Mois',    title: 'Revenu — 30 derniers jours', compare: 'vs mois précédent' },
  { id: 'all',   label: 'Tous',    title: 'Revenu total',               compare: null },
]

function DashboardAction({ to, icon: Icon, title, description, count, tone = 'orange' }) {
  const toneClasses = tone === 'amber'
    ? {
        border: 'border-amber/20 hover:bg-amber/8',
        icon: 'bg-amber/15 text-amber',
        count: 'bg-amber text-navy-deep',
      }
    : {
        border: 'border-orange/20 hover:bg-orange/8',
        icon: 'bg-orange/15 text-orange',
        count: 'bg-orange text-white',
      }

  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-3xl border glass px-4 py-3.5 transition-all hover:-translate-y-0.5 ${toneClasses.border}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${toneClasses.icon}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-white truncate">{title}</p>
        <p className="text-micro text-white/45 truncate">{description}</p>
      </div>
      {count > 0 && (
        <span className={`shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center ${toneClasses.count}`}>
          <span className="text-[10px] font-bold leading-none">{count}</span>
        </span>
      )}
      <ChevronRight size={16} className="text-white/25 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

export function DashboardPage() {
  const { merchant } = useAuthStore()
  const [period, setPeriod] = useState('day')
  const { stats, loading } = useDashboard(period)
  const activePeriod = PERIODS.find(p => p.id === period) ?? PERIODS[0]

  const [unreadNotifs, setUnreadNotifs] = useState(0)
  useEffect(() => {
    let cancelled = false
    notificationService.list()
      .then(data => {
        if (cancelled) return
        setUnreadNotifs((data.notifications || []).filter(n => !n.read).length)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const data = stats || EMPTY_STATS
  const firstName = (merchant?.actor_name ?? merchant?.owner_name)?.split(' ')[0] ?? 'commerçant'
  const recentOrders = Array.isArray(data.recent_orders) ? data.recent_orders : []

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header mobile inchangé ; desktop devient un vrai header de contenu. */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3 lg:static lg:border-0 lg:px-8 lg:pt-7 lg:pb-1 lg:bg-transparent lg:backdrop-blur-none">
        <div className="flex items-center justify-between max-w-lg mx-auto lg:max-w-none lg:mx-auto lg:w-full lg:max-w-[1440px]">
          <div className="flex items-center gap-2 lg:hidden">
            <WakanectLogo variant="mark" className="h-8 w-8" />
            <span className="font-display font-bold text-white text-h3">
              Waka<span className="text-amber">nect</span>
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="font-display font-bold text-h2 text-white">Bonjour, {firstName} 👋</p>
            <p className="text-label text-white/40 mt-1">Voici un aperçu de votre activité.</p>
          </div>
          <Link
            to="/app/notifications"
            className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-orange flex items-center justify-center px-1">
                <span className="text-[9px] font-bold text-white leading-none">{unreadNotifs}</span>
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5 lg:max-w-none lg:py-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
            {/* Revenu : carte principale desktop */}
            <section className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-4xl glass p-6 lg:min-h-[330px] lg:p-7">
                <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-80" />
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-orange/8 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-micro text-white/50 uppercase tracking-wider">
                    {activePeriod.title}
                  </p>
                  <div className="flex items-center gap-1 shrink-0 rounded-xl bg-white/4 p-1">
                    {PERIODS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPeriod(p.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-micro font-semibold transition-colors ${
                          period === p.id
                            ? 'bg-orange/20 text-orange'
                            : 'text-white/40 hover:text-white hover:bg-white/8'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={loading ? 'opacity-40 transition-opacity' : 'transition-opacity'}>
                  <p className="font-display font-extrabold text-display text-white leading-none">
                    {formatFCFA(data.revenue ?? data.revenue_today ?? 0)}
                  </p>
                  {activePeriod.compare && data.revenue_change != null && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <TrendingUp size={14} className={data.revenue_change >= 0 ? 'text-emerald' : 'text-red-400 rotate-180'} />
                      <span className={`text-label font-semibold ${data.revenue_change >= 0 ? 'text-emerald' : 'text-red-400'}`}>
                        {data.revenue_change >= 0 ? '+' : ''}{data.revenue_change}%
                      </span>
                      <span className="text-label text-white/40">{activePeriod.compare}</span>
                    </div>
                  )}
                </div>

                <div className="mt-7">
                  <RevenueChart series={data.series} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/8 pt-4">
                  <div>
                    <p className="text-micro text-white/35">Commandes</p>
                    <p className="font-display font-bold text-h2 text-white mt-1">{data.orders_count ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-micro text-white/35">À encaisser</p>
                    <p className="font-display font-bold text-h2 text-white mt-1">{data.unpaid_count ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-micro text-white/35">Panier moyen</p>
                    <p className="font-display font-bold text-h2 text-white mt-1">{formatFCFA(data.avg_basket ?? 0)}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/8 lg:hidden">
                  <p className="text-label text-white/60">
                    Bonjour, <span className="text-white font-semibold">{firstName}</span> 👋
                  </p>
                </div>
              </div>
            </section>

            {/* Actions déjà existantes : simplement mieux organisées sur desktop. */}
            <aside className="lg:col-span-4 flex flex-col gap-4">
              {merchant?.wakanect_whatsapp_number && merchant?.phone_verified === false && merchant?.role === 'owner' && (
                <Link
                  to="/app/verifier-numero"
                  className="group flex items-center gap-3 glass rounded-3xl px-4 py-3.5 border border-orange/25 hover:bg-orange/8 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange/15 flex items-center justify-center shrink-0">
                    <ShieldAlert size={17} className="text-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-white truncate">Vérifie ton numéro WhatsApp</p>
                    <p className="text-micro text-white/45 truncate">10 secondes, gratuit — envoie un code sur WhatsApp</p>
                  </div>
                  <ChevronRight size={16} className="text-white/30 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              <DashboardAction
                to="/app/validation"
                icon={CheckSquare}
                title="Valider un produit"
                description="Via WhatsApp"
                count={data.pending_validation}
                tone="amber"
              />

              {data.low_stock_count > 0 && (
                <DashboardAction
                  to="/app/stock-bas"
                  icon={AlertTriangle}
                  title={`${data.low_stock_count} produit${data.low_stock_count > 1 ? 's' : ''} en stock bas`}
                  description="Approvisionner avant rupture"
                  count={data.low_stock_count}
                  tone="amber"
                />
              )}

              <Link
                to="/app/commandes"
                className="group flex items-center justify-between rounded-3xl glass border border-white/8 px-5 py-4 hover:bg-white/5 transition-all"
              >
                <div>
                  <p className="text-label font-semibold text-white">Commandes en attente</p>
                  <p className="text-micro text-white/40 mt-0.5">{data.pending_orders_count ?? 0} nouvelle{(data.pending_orders_count ?? 0) > 1 ? 's' : ''}</p>
                </div>
                <ArrowUpRight size={17} className="text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </aside>
          </div>

          {/* Commandes récentes : données déjà renvoyées par /dashboard/stats. */}
          <section className="mt-5 glass rounded-4xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 lg:px-6">
              <div>
                <h2 className="font-display font-bold text-h3 text-white">Dernières commandes</h2>
                <p className="text-micro text-white/35 mt-0.5">Les 5 commandes les plus récentes</p>
              </div>
              <Link
                to="/app/commandes"
                className="flex items-center gap-1 text-label font-semibold text-orange hover:text-orange-hi transition-colors"
              >
                Voir tout
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="divide-y divide-white/6">
                {recentOrders.map(order => (
                  <Link
                    key={order.id}
                    to="/app/commandes"
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/4 transition-colors lg:px-6"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <ShoppingBag size={16} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-semibold text-white truncate">{order.customer_name}</p>
                      <p className="text-micro text-white/35 mt-0.5">{formatRelativeTime(order.created_at)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                    <p className="text-label font-bold text-amber shrink-0">{formatFCFA(order.total)}</p>
                    <ChevronRight size={15} className="text-white/20 shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingBag size={22} className="text-white/20 mb-2" />
                <p className="text-body text-white/40">Aucune commande récente</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
