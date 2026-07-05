import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TrendingUp, ShoppingBag, CheckSquare, LayoutGrid,
  Share2, Bell, Package, ChevronRight, AlertTriangle, BarChart2, Lock, ShieldAlert
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/authStore'
import { formatFCFA } from '@/lib/formatters'
import { WakanectLogo } from '@/components/brand/WakanectLogo'
import { OrderRow } from '@/components/features/dashbord/OrderRow'

const EMPTY_STATS = {
  revenue: 0,
  revenue_today: 0,
  revenue_change: null,
  pending_validation: 0,
  orders_count: 0,
  low_stock_count: 0,
}

const PERIODS = [
  { id: 'day',   label: 'Jour',    title: "Revenu aujourd'hui",      compare: 'vs hier' },
  { id: 'week',  label: 'Semaine', title: 'Revenu — 7 derniers jours',  compare: 'vs semaine précédente' },
  { id: 'month', label: 'Mois',    title: 'Revenu — 30 derniers jours', compare: 'vs mois précédent' },
  { id: 'all',   label: 'Tous',    title: 'Revenu total',            compare: null },
]

/** Graphique en barres du revenu quotidien réel (series du backend) */
function RevenueChart({ series }) {
  if (!series || series.length === 0) return null
  const max = Math.max(...series.map(p => p.total), 1)
  const fmtDay = (iso) => {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
  const gap = series.length > 30 ? 'gap-px' : 'gap-1'

  return (
    <div className="mt-4">
      <div className={`flex items-end ${gap} h-16`}>
        {series.map(p => (
          <div
            key={p.date}
            title={`${fmtDay(p.date)} — ${formatFCFA(p.total)}`}
            className={`flex-1 rounded-t-sm min-h-[2px] ${
              p.total > 0
                ? 'bg-gradient-to-t from-orange to-amber'
                : 'bg-white/8'
            }`}
            style={{ height: p.total > 0 ? `${Math.max((p.total / max) * 100, 8)}%` : '2px' }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-white/30">{fmtDay(series[0].date)}</span>
        <span className="text-[10px] text-white/30">{fmtDay(series[series.length - 1].date)}</span>
      </div>
    </div>
  )
}

function MiniStat({ label, value, accent = 'text-white' }) {
  return (
    <div className="glass rounded-2xl px-3 py-3 flex flex-col gap-0.5 min-w-0">
      <p className={`font-display font-bold text-h3 leading-tight truncate ${accent}`}>{value}</p>
      <p className="text-micro text-white/45 leading-tight">{label}</p>
    </div>
  )
}

function ActionTile({ to, icon: Icon, label, description, badge, color = 'orange', accent }) {
  const colorMap = {
    orange: { icon: 'text-orange', bg: 'bg-orange/12', ring: 'border-orange/15' },
    amber: { icon: 'text-amber', bg: 'bg-amber/12', ring: 'border-amber/15' },
    emerald: { icon: 'text-emerald', bg: 'bg-emerald/12', ring: 'border-emerald/15' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/12', ring: 'border-blue-400/15' },
  }
  const c = colorMap[color] ?? colorMap.orange

  return (
    <Link
      to={to}
      className={`glass rounded-3xl p-4 flex flex-col gap-3 border ${c.ring} hover:bg-white/6 active:scale-[0.97] transition-all`}
    >
      <div className="relative self-start">
        <div className={`w-10 h-10 rounded-2xl ${c.bg} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-orange flex items-center justify-center px-1">
            <span className="text-[10px] font-bold text-white leading-none">{badge}</span>
          </span>
        )}
      </div>
      <div>
        <p className="text-body font-semibold text-white leading-tight">{label}</p>
        {description && (
          <p className="text-micro text-white/45 mt-0.5">{description}</p>
        )}
      </div>
    </Link>
  )
}

export function DashboardPage() {
  const { merchant } = useAuthStore()
  const [period, setPeriod] = useState('day')
  const { stats, loading } = useDashboard(period)
  const navigate = useNavigate()
  const activePeriod = PERIODS.find(p => p.id === period) ?? PERIODS[0]

  const data = stats || EMPTY_STATS
  const firstName = (merchant?.actor_name ?? merchant?.owner_name)?.split(' ')[0] ?? 'commerçant'

  // advanced_stats gate — source : plan_limits injecté au login par le backend
  const planLimits     = merchant?.plan_limits
  const advancedStats  = planLimits?.features?.advanced_stats ?? null

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <WakanectLogo variant="mark" className="h-8 w-8" />
            <span className="font-display font-bold text-white text-h3">
              Waka<span className="text-amber">nect</span>
            </span>
          </div>
          <Link
            to="/app/notifications"
            className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {data.pending_validation > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange" />
            )}
          </Link>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Vérification du numéro WhatsApp — n'apparaît que si le numéro
            Wakanect est configuré côté back ET que le numéro n'est pas vérifié */}
        {merchant?.wakanect_whatsapp_number && merchant?.phone_verified === false && merchant?.role === 'owner' && (
          <Link
            to="/app/verifier-numero"
            className="flex items-center gap-3 glass rounded-3xl px-4 py-3 border border-orange/25 hover:bg-orange/8 active:scale-[0.98] transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-orange/15 flex items-center justify-center shrink-0">
              <ShieldAlert size={16} className="text-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-white">Vérifie ton numéro WhatsApp</p>
              <p className="text-micro text-white/45">10 secondes, gratuit — envoie un code sur WhatsApp</p>
            </div>
            <ChevronRight size={16} className="text-white/30 shrink-0" />
          </Link>
        )}

        {/* Revenue hero — glass card */}
        <div className="relative overflow-hidden rounded-4xl glass p-6">
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-80" />
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-orange/8 blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-micro text-white/50 uppercase tracking-wider">
              {activePeriod.title}
            </p>
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
          <div>
            <p className={`font-display font-extrabold text-display text-white leading-none transition-opacity ${loading ? 'opacity-40' : ''}`}>
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

          {/* Revenu quotidien réel */}
          <RevenueChart series={data.series} />

          <div className="mt-4 pt-4 border-t border-white/8">
            <p className="text-label text-white/60">
              Bonjour, <span className="text-white font-semibold">{firstName}</span> 👋
            </p>
          </div>
        </div>

        {/* Mini stats — période sélectionnée */}
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

        {/* 4 action tiles — 2×2 grid */}
        <div className="grid grid-cols-2 gap-3">
          <ActionTile
            to="/app/validation"
            icon={CheckSquare}
            label="Valider un produit"
            description="Via WhatsApp"
            badge={data.pending_validation}
            color="amber"
          />
          <ActionTile
            to="/app/commandes"
            icon={ShoppingBag}
            label="Commandes"
            description={`${data.orders_count ?? 0} au total`}
            color="orange"
          />
          <ActionTile
            to="/app/catalogue"
            icon={LayoutGrid}
            label="Mon catalogue"
            description="Gérer mes produits"
            color="blue"
          />
          <ActionTile
            to="/app/profil/partager"
            icon={Share2}
            label="Partager ma boutique"
            description="Lien + QR code"
            color="emerald"
          />
        </div>

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

        {/* Stock bas alert — compact */}
        {data.low_stock_count > 0 && (
          <Link
            to="/app/stock-bas"
            className="flex items-center gap-3 glass rounded-3xl px-4 py-3 border border-amber/20 hover:bg-amber/8 active:scale-[0.98] transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-amber/15 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-amber" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-white">
                {data.low_stock_count} produit{data.low_stock_count > 1 ? 's' : ''} en stock bas
              </p>
              <p className="text-micro text-white/45">Approvisionner avant rupture</p>
            </div>
            <ChevronRight size={16} className="text-white/30 shrink-0" />
          </Link>
        )}

        {/* Comment ajouter un produit — permanent help link */}
        <Link
          to="/app/profil/comment-ajouter"
          className="flex items-center gap-3 glass rounded-3xl px-4 py-3 border border-wa-green/20 hover:bg-wa-green/8 active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-wa-green/15 flex items-center justify-center shrink-0">
            <Package size={16} className="text-wa-green" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-semibold text-white">Comment ajouter un produit ?</p>
            <p className="text-micro text-white/45">Transférez un message WhatsApp</p>
          </div>
          <ChevronRight size={16} className="text-white/30 shrink-0" />
        </Link>

        {/* Analytics avancées (top produits) — gated sur plan_limits.features.advanced_stats */}
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
              <p className="text-body font-semibold text-white/50">Analytics avancées</p>
              <Link to="/abonnement" className="text-micro text-orange underline">
                Disponible en plan Pro / Premium →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
