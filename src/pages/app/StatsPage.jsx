import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, TrendingUp, BarChart2, Lock } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/authStore'
import { formatFCFA } from '@/lib/formatters'
import { RevenueChart } from '@/components/features/dashbord/RevenueChart'
import { OrderRow } from '@/components/features/dashbord/OrderRow'

const PERIODS = [
  { id: 'day',   label: 'Jour',    title: "Revenu aujourd'hui",         compare: 'vs hier' },
  { id: 'week',  label: 'Semaine', title: 'Revenu — 7 derniers jours',  compare: 'vs semaine précédente' },
  { id: 'month', label: 'Mois',    title: 'Revenu — 30 derniers jours', compare: 'vs mois précédent' },
  { id: 'all',   label: 'Tous',    title: 'Revenu total',               compare: null },
]

const EMPTY = {
  revenue: 0, revenue_change: null, avg_basket: 0, series: [],
  orders_breakdown: { new: 0, confirmed: 0, delivered: 0, cancelled: 0 },
  top_products: [], recent_orders: [], unpaid_count: 0,
}

function MiniStat({ label, value, accent = 'text-white' }) {
  return (
    <div className="glass rounded-2xl px-3 py-3 flex flex-col gap-0.5 min-w-0">
      <p className={`font-display font-bold text-h3 leading-tight truncate ${accent}`}>{value}</p>
      <p className="text-micro text-white/45 leading-tight">{label}</p>
    </div>
  )
}

const BREAKDOWN_ITEMS = [
  { key: 'new',       label: 'Nouvelles',  dot: 'bg-blue-400' },
  { key: 'confirmed', label: 'Confirmées', dot: 'bg-amber' },
  { key: 'delivered', label: 'Livrées',    dot: 'bg-emerald' },
  { key: 'cancelled', label: 'Annulées',   dot: 'bg-red-400' },
]

export function StatsPage() {
  const { merchant } = useAuthStore()
  const [period, setPeriod] = useState('week')
  const { stats, loading } = useDashboard(period)
  const navigate = useNavigate()

  const data = stats || EMPTY
  const activePeriod = PERIODS.find(p => p.id === period) ?? PERIODS[1]
  const advancedStats = merchant?.plan_limits?.features?.advanced_stats ?? null

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/app/profil" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Statistiques</h1>
          <div className="flex items-center gap-1 shrink-0">
            {PERIODS.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-2 py-1 rounded-lg text-micro font-semibold transition-colors ${
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
      </div>

      <div className="page-container py-5 flex flex-col gap-4">
        {/* Revenu + graphique */}
        <div className="glass rounded-4xl p-5">
          <p className="text-micro text-white/50 uppercase tracking-wider mb-1">{activePeriod.title}</p>
          <p className={`font-display font-extrabold text-display text-white leading-none transition-opacity ${loading ? 'opacity-40' : ''}`}>
            {formatFCFA(data.revenue ?? 0)}
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
          <RevenueChart series={data.series} />
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2">
          <MiniStat
            label="Commandes payées"
            value={(data.orders_breakdown?.confirmed ?? 0) + (data.orders_breakdown?.delivered ?? 0)}
          />
          <MiniStat
            label="Panier moyen"
            value={data.avg_basket > 0 ? formatFCFA(data.avg_basket) : '—'}
            accent="text-amber"
          />
          <MiniStat
            label="À encaisser"
            value={data.unpaid_count ?? 0}
            accent={data.unpaid_count > 0 ? 'text-orange' : 'text-white'}
          />
        </div>

        {/* Répartition des commandes */}
        <div className="glass rounded-3xl p-4">
          <p className="text-micro text-white/45 uppercase tracking-wider mb-3">
            Commandes — {activePeriod.label.toLowerCase()}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {BREAKDOWN_ITEMS.map(item => (
              <div key={item.key} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                <span className="text-label text-white/60 flex-1">{item.label}</span>
                <span className="text-label font-bold text-white">
                  {data.orders_breakdown?.[item.key] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top produits — gated Pro/Premium */}
        {advancedStats === true && (data.top_products?.length ?? 0) > 0 && (
          <div className="glass rounded-3xl overflow-hidden border border-amber/15">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <BarChart2 size={15} className="text-amber" />
              <p className="text-micro text-white/45 uppercase tracking-wider">
                Top produits — {activePeriod.label.toLowerCase()}
              </p>
            </div>
            {data.top_products.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-4 py-2.5 border-t border-white/5">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-micro font-bold shrink-0 ${
                  i === 0 ? 'bg-amber/20 text-amber' : 'bg-white/8 text-white/50'
                }`}>
                  {i + 1}
                </span>
                <p className="flex-1 min-w-0 text-body text-white truncate">{p.name}</p>
                <div className="text-right shrink-0">
                  <p className="text-label font-semibold text-white">×{p.quantity}</p>
                  <p className="text-micro text-white/40">{formatFCFA(p.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {advancedStats === false && (
          <div className="glass rounded-3xl px-4 py-4 border border-white/8 flex items-center gap-3 opacity-70">
            <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center shrink-0">
              <Lock size={16} className="text-white/30" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-white/50">Top produits & analytics avancées</p>
              <Link to="/abonnement" className="text-micro text-orange underline">
                Disponible en plan Pro / Premium →
              </Link>
            </div>
          </div>
        )}

        {/* Dernières commandes */}
        {(data.recent_orders?.length ?? 0) > 0 && (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-micro text-white/45 uppercase tracking-wider">Dernières commandes</p>
              <Link to="/app/commandes" className="text-micro text-orange hover:underline">
                Voir tout
              </Link>
            </div>
            {data.recent_orders.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                onClick={() => navigate('/app/commandes')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
