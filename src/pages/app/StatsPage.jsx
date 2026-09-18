import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, TrendingUp, BarChart2, Lock, ArrowUpRight, BarChart3 } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/authStore'
import { formatFCFA } from '@/lib/formatters'
import { RevenueChart } from '@/components/features/dashbord/RevenueChart'

const PERIODS = [
  { id: 'day', label: 'Jour', title: "Revenu aujourd'hui", compare: 'vs hier' },
  { id: 'week', label: 'Semaine', title: 'Revenu — 7 derniers jours', compare: 'vs semaine précédente' },
  { id: 'month', label: 'Mois', title: 'Revenu — 30 derniers jours', compare: 'vs mois précédent' },
  { id: 'all', label: 'Tous', title: 'Revenu total', compare: null },
]

const EMPTY = {
  revenue: 0, revenue_change: null,
  orders_paid: 0, orders_paid_change: null,
  avg_basket: 0, avg_basket_change: null,
  conversion_rate_change: null,
  series: [],
  orders_breakdown: { new: 0, confirmed: 0, delivered: 0, cancelled: 0 },
  top_products: [],
  funnel: null,
  avg_duration_seconds: {},
}

const BREAKDOWN_ITEMS = [
  { key: 'new', label: 'Nouvelles', dot: 'bg-blue-400' },
  { key: 'confirmed', label: 'Confirmées', dot: 'bg-amber' },
  { key: 'delivered', label: 'Livrées', dot: 'bg-emerald' },
  { key: 'cancelled', label: 'Annulées', dot: 'bg-red-400' },
]

const FUNNEL_STEPS = [
  { key: 'page_views', durKey: 'catalogue', label: 'Visites boutique' },
  { key: 'product_views', durKey: 'product', label: 'Fiches produit vues' },
  { key: 'add_to_carts', durKey: null, label: 'Ajouts au panier' },
  { key: 'checkouts_started', durKey: 'checkout', label: 'Commandes démarrées' },
  { key: 'orders_placed', durKey: 'confirmation', label: 'Commandes passées' },
]

function fmtDay(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function fmtDuration(s) {
  if (!s || s <= 0) return null
  return s >= 60 ? `${Math.floor(s / 60)}min ${Math.round(s % 60)}s` : `${Math.round(s)}s`
}

function ChangeBadge({ value }) {
  if (value == null) return null
  const positive = value >= 0
  return (
    <div className="flex items-center gap-1">
      <TrendingUp size={12} className={positive ? 'text-emerald' : 'text-red-400 rotate-180'} />
      <span className={`text-micro font-semibold ${positive ? 'text-emerald' : 'text-red-400'}`}>
        {positive ? '+' : ''}{value}%
      </span>
    </div>
  )
}

function KpiCard({ label, value, change, loading }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-1.5 min-w-0">
      <p className="text-micro text-white/45 uppercase tracking-wider truncate">{label}</p>
      <p className={`font-display font-bold text-h2 text-white leading-tight truncate transition-opacity ${loading ? 'opacity-40' : ''}`}>
        {value}
      </p>
      <ChangeBadge value={change} />
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-2 animate-pulse">
      <div className="h-2.5 w-16 rounded bg-white/10" />
      <div className="h-6 w-20 rounded bg-white/10" />
      <div className="h-2.5 w-10 rounded bg-white/10" />
    </div>
  )
}

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-micro text-white/45 uppercase tracking-wider">{children}</p>
      {action}
    </div>
  )
}

function ConversionFunnel({ funnel, durations }) {
  const max = Math.max(funnel.page_views ?? 0, 1)
  return (
    <div className="flex flex-col gap-3.5">
      {FUNNEL_STEPS.map((step, i) => {
        const value = funnel[step.key] ?? 0
        const prevValue = i > 0 ? funnel[FUNNEL_STEPS[i - 1].key] ?? 0 : null
        const stepRate = prevValue > 0 ? Math.round((value / prevValue) * 100) : null
        const widthPct = value > 0 ? Math.max((value / max) * 100, 4) : 0
        const dur = step.durKey ? fmtDuration(durations?.[step.durKey]) : null
        return (
          <div key={step.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-label text-white/60">{step.label}</span>
              <span className="text-label font-bold text-white">{value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/6 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange to-amber transition-all"
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 min-h-[14px]">
              <span className="text-micro text-white/35">
                {stepRate != null ? `${stepRate}% depuis l'étape précédente` : ''}
              </span>
              {dur && <span className="text-micro text-white/35">{dur} en moy.</span>}
            </div>
          </div>
        )
      })}
      <div className="flex items-center justify-between pt-2 border-t border-white/8">
        <span className="text-label text-white/60">Taux de conversion global</span>
        <span className="text-label font-bold text-emerald">{funnel.conversion_rate ?? 0}%</span>
      </div>
      {fmtDuration(durations?.tracking) && (
        <div className="flex items-center justify-between">
          <span className="text-label text-white/60">Temps sur le suivi de commande</span>
          <span className="text-label font-bold text-white">{fmtDuration(durations.tracking)}</span>
        </div>
      )}
    </div>
  )
}

function OrdersDistribution({ breakdown }) {
  const total = BREAKDOWN_ITEMS.reduce((sum, it) => sum + (breakdown?.[it.key] ?? 0), 0)
  return (
    <div>
      <div className="h-3 rounded-full overflow-hidden bg-white/6 flex">
        {total > 0
          ? BREAKDOWN_ITEMS.map((it) => {
              const value = breakdown?.[it.key] ?? 0
              if (value === 0) return null
              return <div key={it.key} className={it.dot} style={{ width: `${(value / total) * 100}%` }} />
            })
          : <div className="w-full bg-white/6" />}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
        {BREAKDOWN_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
            <span className="text-label text-white/60 flex-1">{item.label}</span>
            <span className="text-label font-bold text-white">{breakdown?.[item.key] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopProducts({ products }) {
  if (!products?.length) {
    return <p className="text-label text-white/35 text-center py-4">Pas encore de ventes sur la période.</p>
  }
  return (
    <div className="flex flex-col">
      {products.map((p, i) => (
        <div key={p.name} className="flex items-center gap-3 py-2.5 border-t border-white/5 first:border-0 first:pt-0">
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
  )
}

function AdvancedUpsell() {
  return (
    <div className="glass rounded-3xl px-4 py-4 border border-white/8 flex items-center gap-3 opacity-70">
      <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center shrink-0">
        <Lock size={16} className="text-white/30" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-white/50">Parcours client & top produits</p>
        <Link to="/abonnement" className="text-micro text-orange underline">
          Disponible en plan Pro / Premium →
        </Link>
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <div className="glass rounded-4xl p-5 lg:p-6 animate-pulse">
        <div className="h-3 w-32 rounded bg-white/10 mb-4" />
        <div className="h-[220px] rounded bg-white/6" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-4 h-64 animate-pulse bg-white/4" />
        <div className="glass rounded-3xl p-4 h-64 animate-pulse bg-white/4" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="glass rounded-4xl p-8 flex flex-col items-center text-center gap-2">
      <BarChart3 size={28} className="text-white/25 mb-1" />
      <p className="font-display font-bold text-h3 text-white">Pas encore assez de données</p>
      <p className="text-body text-white/45 max-w-sm">
        Les statistiques s'affichent dès les premières visites et commandes sur votre boutique.
      </p>
    </div>
  )
}

export function StatsPage() {
  const { merchant } = useAuthStore()
  const [period, setPeriod] = useState('week')
  const { stats, loading } = useDashboard(period)

  const data = stats || EMPTY
  const activePeriod = PERIODS.find((p) => p.id === period) ?? PERIODS[1]
  const advancedStats = merchant?.plan_limits?.features?.advanced_stats === true
  const advancedDenied = merchant?.plan_limits?.features?.advanced_stats !== true

  const isEmpty = !loading && stats
    && (data.revenue ?? 0) === 0
    && (data.orders_paid ?? 0) === 0
    && (data.funnel?.page_views ?? 0) === 0

  const dateRange = data.series?.length
    ? `${fmtDay(data.series[0].date)} – ${fmtDay(data.series[data.series.length - 1].date)}`
    : null

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3 lg:static lg:!border-0 lg:!shadow-none lg:px-8 lg:pt-7 lg:pb-1 lg:!bg-transparent lg:!backdrop-blur-none">
        <div className="flex items-center gap-3 max-w-lg mx-auto lg:max-w-none lg:mx-auto lg:w-full lg:max-w-[1440px]">
          <Link
            to="/app/profil"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors lg:hidden"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-h3 lg:text-h2 text-white">Statistiques</h1>
            {dateRange && (
              <p className="hidden lg:block text-label text-white/40 mt-1">{dateRange}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 lg:rounded-xl lg:bg-white/4 lg:p-1">
            {PERIODS.map((p) => (
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
      </div>

      <div className="page-container py-5 lg:max-w-none lg:py-6 lg:px-8">
        <div className="mx-auto w-full lg:max-w-[1440px]">
          {loading && !stats ? (
            <StatsSkeleton />
          ) : isEmpty ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-5">
              {/* Bande 1 — KPI */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard
                  label="Revenu"
                  value={formatFCFA(data.revenue ?? 0)}
                  change={activePeriod.compare ? data.revenue_change : null}
                  loading={loading}
                />
                <KpiCard
                  label="Commandes payées"
                  value={data.orders_paid ?? 0}
                  change={activePeriod.compare ? data.orders_paid_change : null}
                  loading={loading}
                />
                <KpiCard
                  label="Panier moyen"
                  value={data.avg_basket > 0 ? formatFCFA(data.avg_basket) : '—'}
                  change={activePeriod.compare ? data.avg_basket_change : null}
                  loading={loading}
                />
                <KpiCard
                  label="Taux de conversion"
                  value={data.funnel?.page_views > 0 ? `${data.funnel.conversion_rate}%` : '—'}
                  change={activePeriod.compare ? data.conversion_rate_change : null}
                  loading={loading}
                />
              </div>

              {/* Bande 2 — graphique revenu, pièce maîtresse */}
              <div className="glass rounded-4xl p-5 lg:p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-80" />
                <SectionTitle>{activePeriod.title}</SectionTitle>
                <RevenueChart series={data.series} height={240} showAxis />
              </div>

              {/* Bande 3 — parcours client / répartition + top produits */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass rounded-3xl p-4 lg:p-5">
                  <SectionTitle>Parcours client — {activePeriod.label.toLowerCase()}</SectionTitle>
                  {advancedStats && data.funnel?.page_views > 0 ? (
                    <ConversionFunnel funnel={data.funnel} durations={data.avg_duration_seconds} />
                  ) : advancedDenied ? (
                    <AdvancedUpsell />
                  ) : (
                    <p className="text-label text-white/35 text-center py-4">
                      Pas encore de visites enregistrées sur cette période.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="glass rounded-3xl p-4 lg:p-5">
                    <SectionTitle>Commandes — {activePeriod.label.toLowerCase()}</SectionTitle>
                    <OrdersDistribution breakdown={data.orders_breakdown} />
                  </div>

                  <div className="glass rounded-3xl overflow-hidden p-4 lg:p-5">
                    <SectionTitle>
                      <span className="flex items-center gap-2">
                        <BarChart2 size={13} className="text-amber" />
                        Top produits
                      </span>
                    </SectionTitle>
                    {advancedStats ? (
                      <TopProducts products={data.top_products} />
                    ) : advancedDenied ? (
                      <AdvancedUpsell />
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Lien vers le détail des commandes — pas de doublon avec Dashboard */}
              <Link
                to="/app/commandes"
                className="group flex items-center justify-between glass rounded-3xl px-5 py-4 hover:bg-white/5 transition-all"
              >
                <span className="text-label font-semibold text-white">Voir toutes les commandes</span>
                <ArrowUpRight size={17} className="text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
