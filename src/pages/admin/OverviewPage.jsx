import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Store, DollarSign, Zap, TrendingUp } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { KpiCard } from '@/components/admin/KpiCard'
import { KpiSkeleton } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { AlertsPanel } from '@/components/admin/AlertsPanel'
import { RangeSelector } from '@/components/admin/RangeSelector'

function fmt(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} k`
  return String(n)
}

function fmtCurrency(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-admin-line rounded-xl shadow-card px-3 py-2 text-label">
      <p className="text-admin-muted mb-1">{label}</p>
      <p className="text-navy font-semibold tabular-nums">{payload[0].value} messages parsés</p>
    </div>
  )
}

export default function OverviewPage() {
  const [range, setRange] = useState('7d')
  const { data, loading, error, refetch } = useAdminQuery(() => adminApi.overview(range), [range])

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const shops  = data?.shops ?? {}
  const alerts = data?.alerts ?? []

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-h2 font-display font-bold text-navy">Vue d'ensemble</h2>
          <p className="text-body text-admin-muted">Tableau de bord opérateur</p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* KPI row */}
      {loading ? (
        <KpiSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Boutiques actives"
            value={fmt(shops.active)}
            sub={`${shops.trial ?? 0} en essai`}
            icon={Store}
          />
          <KpiCard
            label="MRR"
            value={fmtCurrency(data?.mrr)}
            icon={TrendingUp}
          />
          <KpiCard
            label="Messages parsés / 24h"
            value={fmt(data?.parsed24h)}
            sub={`${fmt(data?.parsedPerShop)} / boutique`}
            icon={Zap}
          />
          <KpiCard
            label="Coût Haiku aujourd'hui"
            value={fmtCurrency(data?.haikuCostToday)}
            sub={`Proj. mois : ${fmtCurrency(data?.haikuCostMonthProj)}`}
            variant="accent"
            icon={DollarSign}
          />
        </div>
      )}

      {/* Statut boutiques (pills) */}
      {!loading && (
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Payant',   value: shops.paying,   color: 'bg-wa-green/10 text-green-700' },
            { label: 'Essai',    value: shops.trial,    color: 'bg-amber/20 text-amber-700' },
            { label: 'Inactif', value: shops.dormant,  color: 'bg-admin-fill text-admin-muted' },
            { label: 'Suspendu', value: shops.suspended, color: 'bg-danger/10 text-danger' },
          ].map(item => (
            <div key={item.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-label font-medium ${item.color}`}>
              <span className="tabular-nums font-bold">{item.value ?? 0}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Graphique + alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Courbe activité 14 j */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-admin-card p-4">
          <h3 className="text-h3 font-semibold text-navy mb-4">Activité de parsing</h3>
          {loading ? (
            <div className="h-48 bg-admin-fill rounded-lg motion-safe:animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data?.activitySeries ?? []} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EC5E2A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EC5E2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E7E9EE" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A909E' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A909E' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#EC5E2A"
                  strokeWidth={2}
                  fill="url(#actGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#EC5E2A' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-xl shadow-admin-card p-4">
          <h3 className="text-h3 font-semibold text-navy mb-4">
            Alertes
            {alerts.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-danger text-white text-micro font-bold">
                {alerts.length}
              </span>
            )}
          </h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-admin-fill rounded-lg motion-safe:animate-pulse" />)}
            </div>
          ) : (
            <AlertsPanel alerts={alerts} />
          )}
        </div>
      </div>
    </div>
  )
}
