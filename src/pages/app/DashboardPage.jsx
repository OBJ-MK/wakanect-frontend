import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, CheckSquare,
  Bell, ChevronRight, AlertTriangle, ShieldAlert
} from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/authStore'
import { formatFCFA } from '@/lib/formatters'
import { WakanectLogo } from '@/components/brand/WakanectLogo'
import { RevenueChart } from '@/components/features/dashbord/RevenueChart'
import { notificationService } from '@/services/notificationService'

const EMPTY_STATS = {
  revenue: 0,
  revenue_today: 0,
  revenue_change: null,
  pending_validation: 0,
  pending_orders_count: 0,
  orders_count: 0,
  low_stock_count: 0,
}

const PERIODS = [
  { id: 'day',   label: 'Jour',    title: "Revenu aujourd'hui",      compare: 'vs hier' },
  { id: 'week',  label: 'Semaine', title: 'Revenu — 7 derniers jours',  compare: 'vs semaine précédente' },
  { id: 'month', label: 'Mois',    title: 'Revenu — 30 derniers jours', compare: 'vs mois précédent' },
  { id: 'all',   label: 'Tous',    title: 'Revenu total',            compare: null },
]


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
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-orange flex items-center justify-center px-1">
                <span className="text-[9px] font-bold text-white leading-none">{unreadNotifs}</span>
              </span>
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

        {/* Action dashboard-spécifique : les autres (Commandes, Catalogue) sont
            déjà à 1 tap via la bottom nav, pas besoin de les redupliquer ici. */}
        <Link
          to="/app/validation"
          className="flex items-center gap-3 glass rounded-3xl px-4 py-3 border border-amber/20 hover:bg-amber/8 active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-amber/15 flex items-center justify-center shrink-0">
            <CheckSquare size={16} className="text-amber" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-semibold text-white">Valider un produit</p>
            <p className="text-micro text-white/45">Via WhatsApp</p>
          </div>
          {data.pending_validation > 0 && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-amber flex items-center justify-center">
              <span className="text-[10px] font-bold text-navy-deep leading-none">{data.pending_validation}</span>
            </span>
          )}
          <ChevronRight size={16} className="text-white/30 shrink-0" />
        </Link>

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

      </div>
    </div>
  )
}