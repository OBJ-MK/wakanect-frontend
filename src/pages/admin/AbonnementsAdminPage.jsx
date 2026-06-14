import { useState } from 'react'
import { TrendingUp, Users, AlertTriangle, Percent } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { KpiCard } from '@/components/admin/KpiCard'
import { KpiSkeleton } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { DataTable } from '@/components/admin/DataTable'
import { AdminBadge } from '@/components/admin/AdminBadge'
import { LoadingState } from '@/components/admin/LoadingState'
import { RangeSelector } from '@/components/admin/RangeSelector'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function fmtCurrency(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('fr-FR')
}

const PAYMENT_VARIANT = { Payé: 'paid', 'En attente': 'pending', Impayé: 'overdue' }

const COLS = [
  { key: 'name',          label: 'Boutique' },
  { key: 'plan',          label: 'Plan' },
  { key: 'period',        label: 'Période' },
  { key: 'paymentStatus', label: 'Paiement' },
  { key: 'renewal',       label: 'Renouvellement' },
  { key: 'amountFcfa',    label: 'Montant (XOF)', className: 'text-right' },
]

const MrrTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-admin-line rounded-xl shadow-card px-3 py-2 text-label">
      <p className="text-admin-muted mb-1">{label}</p>
      <p className="text-navy font-semibold tabular-nums">{fmtCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function AbonnementsAdminPage() {
  const [range, setRange] = useState('30d')
  const { data, loading, error, refetch } = useAdminQuery(
    () => adminApi.abonnements(range),
    [range],
  )

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const rows = data?.rows ?? []
  const mrrByCountry = data?.mrrByCountry ?? []

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-h2 font-display font-bold text-navy">Abonnements</h2>
          <p className="text-body text-admin-muted">MRR, essais, paiements</p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* KPIs */}
      {loading ? (
        <KpiSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="MRR"
            value={fmtCurrency(data?.mrr)}
            icon={TrendingUp}
            variant="accent"
          />
          <KpiCard
            label="Essais actifs"
            value={data?.trials ?? '—'}
            sub={`${data?.expiringSoon ?? 0} expirent bientôt`}
            icon={Users}
          />
          <KpiCard
            label="Paiements échoués"
            value={data?.paymentsFailed ?? '—'}
            icon={AlertTriangle}
          />
          <KpiCard
            label="Conversion essai → payant"
            value={data?.conversionPct != null ? `${data.conversionPct}%` : '—'}
            icon={Percent}
          />
        </div>
      )}

      {/* MRR par pays */}
      {!loading && mrrByCountry.length > 0 && (
        <div className="bg-white rounded-xl shadow-admin-card p-5">
          <h3 className="text-h3 font-semibold text-navy mb-4">MRR par pays</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mrrByCountry} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="#E7E9EE" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="country" tick={{ fontSize: 11, fill: '#8A909E' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A909E' }} tickLine={false} axisLine={false} />
              <Tooltip content={<MrrTooltip />} />
              <Bar dataKey="mrr" fill="#FFB347" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tableau abonnements */}
      <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
        <div className="px-4 py-3.5 border-b border-admin-line">
          <h3 className="text-h3 font-semibold text-navy">Tous les abonnements</h3>
        </div>
        {loading ? (
          <div className="p-4"><LoadingState rows={8} /></div>
        ) : (
          <DataTable
            columns={COLS.map(col => ({
              ...col,
              render: col.key === 'plan'
                ? (val) => <AdminBadge variant={val} />
                : col.key === 'paymentStatus'
                ? (val) => {
                    const v = PAYMENT_VARIANT[val] ?? 'default'
                    return <AdminBadge variant={v} label={val} />
                  }
                : col.key === 'renewal'
                ? (val) => <span className="text-admin-muted">{fmtDate(val)}</span>
                : col.key === 'amountFcfa'
                ? (val) => <span className="tabular-nums">{fmtCurrency(val)}</span>
                : undefined,
            }))}
            rows={rows}
          />
        )}
      </div>
    </div>
  )
}
