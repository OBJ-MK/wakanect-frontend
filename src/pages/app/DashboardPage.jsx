import { Link, useNavigate } from 'react-router-dom'
import {
  TrendingUp, ShoppingBag, AlertCircle, Package,
  ArrowRight, Bell, ChevronRight
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/authStore'
import { formatFCFA, formatRelativeTime } from '@/lib/formatters'
import { OrderRow } from '@/components/features/dashbord/OrderRow'
import { StockAlert } from '@/components/features/dashbord/StockAlert'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

const MOCK_STATS = {
  revenue: 1_840_000,
  revenue_change: +12.4,
  orders_count: 34,
  pending_validation: 2,
  low_stock_count: 3,
  recent_orders: [
    { id: '1', customer_name: 'Aminata Diallo', total: 45000, status: 'Nouvelle', payment_status: 'Payée', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: '2', customer_name: 'Moussa Traoré', total: 28500, status: 'Confirmée', payment_status: 'En attente de paiement', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: '3', customer_name: 'Fatou Sow', total: 67000, status: 'Livrée', payment_status: 'Payée', created_at: new Date(Date.now() - 86400000).toISOString() },
  ],
}

function SparkLine() {
  const points = [40, 65, 45, 80, 60, 90, 75, 95, 70, 100, 85, 110]
  const max = Math.max(...points)
  const w = 120, h = 40
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - (p / max) * h
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="opacity-70">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EC5E2A" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="url(#spark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DashboardPage() {
  const { merchant } = useAuthStore()
  const { stats, loading } = useDashboard()
  const navigate = useNavigate()

  const data = stats || MOCK_STATS

  const statCards = [
    {
      label: 'Commandes',
      value: data.orders_count,
      icon: ShoppingBag,
      color: 'text-orange',
      bg: 'bg-orange/10',
      to: '/app/commandes',
    },
    {
      label: 'À valider',
      value: data.pending_validation,
      icon: AlertCircle,
      color: data.pending_validation > 0 ? 'text-amber' : 'text-white/40',
      bg: data.pending_validation > 0 ? 'bg-amber/10' : 'bg-white/5',
      to: '/app/validation',
    },
    {
      label: 'Stock bas',
      value: data.low_stock_count,
      icon: Package,
      color: data.low_stock_count > 0 ? 'text-red-400' : 'text-white/40',
      bg: data.low_stock_count > 0 ? 'bg-red-500/10' : 'bg-white/5',
      to: '/app/stock',
    },
  ]

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <WakanectLogo variant="mark" className="h-8 w-8" />
          <button
            className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {data.pending_validation > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange" />
            )}
          </button>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Revenue hero — glass card */}
        <div className="relative overflow-hidden rounded-4xl glass p-6">
          {/* Orange→amber gradient thread */}
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-80" />
          {/* Subtle glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-orange/8 blur-2xl pointer-events-none" />

          <p className="text-micro text-white/50 uppercase tracking-wider mb-1">
            Revenus ce mois
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display font-extrabold text-display text-white leading-none">
                {formatFCFA(data.revenue)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp size={14} className="text-emerald" />
                <span className="text-label font-semibold text-emerald">
                  +{data.revenue_change}%
                </span>
                <span className="text-label text-white/40">vs mois dernier</span>
              </div>
            </div>
            <SparkLine />
          </div>

          {/* Greeting */}
          <div className="mt-4 pt-4 border-t border-white/8">
            <p className="text-label text-white/60">
              Bonjour, <span className="text-white font-semibold">{merchant?.owner_name?.split(' ')[0] ?? 'commerçant'}</span> 👋
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map(card => (
            <Link
              key={card.label}
              to={card.to}
              className="glass rounded-3xl p-3.5 flex flex-col gap-2 hover:bg-white/6 active:scale-[0.97] transition-all"
            >
              <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon size={16} className={card.color} />
              </div>
              <div>
                <p className={`font-display font-bold text-h2 leading-none ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-micro text-white/45 mt-0.5">{card.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Validation banner */}
        {data.pending_validation > 0 && (
          <Link
            to="/app/validation"
            className="flex items-center gap-3 glass rounded-3xl px-4 py-3.5 border border-amber/20 hover:bg-amber/8 transition-colors animate-fade-up"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber/15 flex items-center justify-center shrink-0">
              <AlertCircle size={18} className="text-amber" />
            </div>
            <div className="flex-1">
              <p className="text-body font-semibold text-white">
                {data.pending_validation} nouveau{data.pending_validation > 1 ? 'x' : ''} produit{data.pending_validation > 1 ? 's' : ''} à valider
              </p>
              <p className="text-micro text-white/45">Via WhatsApp · Tap pour valider</p>
            </div>
            <ChevronRight size={16} className="text-white/30 shrink-0" />
          </Link>
        )}

        {/* Stock alert */}
        <StockAlert count={data.low_stock_count} />

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-h3 text-white">
              Commandes récentes
            </h2>
            <Link to="/app/commandes" className="text-label text-orange flex items-center gap-1 hover:text-orange-hi">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass rounded-3xl overflow-hidden">
            {data.recent_orders?.length > 0 ? (
              data.recent_orders.map(order => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onClick={() => navigate(`/app/commandes/${order.id}`)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <ShoppingBag size={32} className="text-white/20 mb-3" />
                <p className="text-body text-white/50">Aucune commande pour l'instant</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
