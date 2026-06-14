import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Zap, Percent, Hash, AlertTriangle } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { KpiCard } from '@/components/admin/KpiCard'
import { KpiSkeleton } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { FunnelBar } from '@/components/admin/FunnelBar'
import { RangeSelector } from '@/components/admin/RangeSelector'

function fmtCurrency(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)
}

const CostTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-admin-line rounded-xl shadow-card px-3 py-2 text-label">
      <p className="text-admin-muted mb-1">{label}</p>
      <p className="text-orange font-semibold tabular-nums">{fmtCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function ParsingPage() {
  const [range, setRange] = useState('7d')
  const { data, loading, error, refetch } = useAdminQuery(
    () => adminApi.parsingFunnel(range),
    [range],
  )

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-h2 font-display font-bold text-navy">Parsing & Haiku</h2>
          <p className="text-body text-admin-muted">Coûts et escalade du moteur de parsing</p>
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* KPIs */}
      {loading ? (
        <KpiSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Regex seul"
            value={`${data?.pctRegexOnly ?? 0}%`}
            sub="Gratuit"
            icon={Percent}
          />
          <KpiCard
            label="Escalade Haiku"
            value={`${data?.pctEscalateHaiku ?? 0}%`}
            sub="Payant"
            icon={Zap}
          />
          <KpiCard
            label="Tokens Haiku / boutique"
            value={data?.haikuTokensPerShopAvg ? `${(data.haikuTokensPerShopAvg / 1000).toFixed(1)}k` : '—'}
            sub={`Médiane : ${data?.haikuTokensPerShopMedian ? `${(data.haikuTokensPerShopMedian / 1000).toFixed(1)}k` : '—'}`}
            icon={Hash}
          />
          <KpiCard
            label="Taux d'échec"
            value={`${data?.pctFailed ?? 0}%`}
            sub={data?.pctFailed > 2 ? 'Attention ↑' : 'Normal'}
            icon={AlertTriangle}
            variant={data?.pctFailed > 2 ? 'accent' : 'default'}
          />
        </div>
      )}

      {/* Entonnoir d'escalade */}
      <div className="bg-white rounded-xl shadow-admin-card p-5">
        <h3 className="text-h3 font-semibold text-navy mb-4">Entonnoir d'escalade</h3>
        {loading ? (
          <div className="h-20 bg-admin-fill rounded-lg motion-safe:animate-pulse" />
        ) : (
          <FunnelBar data={data} />
        )}
      </div>

      {/* Graphique coût Haiku / jour + note marge */}
      <div className="bg-white rounded-xl shadow-admin-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-h3 font-semibold text-navy">Coût Haiku / jour</h3>
          <div className="text-label text-admin-muted">
            Total période :{' '}
            <span className="font-semibold text-orange tabular-nums">
              {fmtCurrency(data?.costMonthTotal)}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-48 bg-admin-fill rounded-lg motion-safe:animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.costSeries ?? []} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid stroke="#E7E9EE" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A909E' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A909E' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CostTooltip />} />
              <Bar dataKey="fcfa" fill="#EC5E2A" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Note marge */}
        <p className="mt-3 text-micro text-admin-muted bg-amber/10 rounded-lg px-3 py-2 border border-amber/20">
          ⚠️ Ces coûts sont à comparer à vos revenus d'abonnement pour calculer la marge réelle.
          Un ratio Haiku / MRR {'>'} 15 % mérite une revue du seuil d'escalade.
        </p>
      </div>
    </div>
  )
}
