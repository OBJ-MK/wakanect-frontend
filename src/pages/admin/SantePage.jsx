import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { KpiSkeleton } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'

function StatusKpi({ label, value, status }) {
  const styles = {
    ok:      { ring: 'ring-wa-green/30', bg: 'bg-wa-green/10', text: 'text-green-700', icon: CheckCircle,    dot: 'bg-wa-green' },
    warning: { ring: 'ring-amber/30',    bg: 'bg-amber/10',    text: 'text-amber-700', icon: AlertTriangle,  dot: 'bg-amber' },
    error:   { ring: 'ring-danger/20',   bg: 'bg-danger/10',   text: 'text-danger',    icon: XCircle,        dot: 'bg-danger' },
    unknown: { ring: 'ring-admin-line',  bg: 'bg-admin-fill',  text: 'text-admin-muted', icon: Clock,         dot: 'bg-admin-muted' },
  }[status ?? 'unknown']
  const Icon = styles.icon

  return (
    <div className={`bg-white rounded-xl shadow-admin-card p-4 ring-1 ${styles.ring}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
        <span className="text-label text-admin-muted font-medium">{label}</span>
      </div>
      <div className={`flex items-center gap-2 ${styles.text}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-h3 font-semibold tabular-nums">{value ?? '—'}</span>
      </div>
    </div>
  )
}

function ErrorRate({ label, pct }) {
  const color = pct > 5 ? 'bg-danger' : pct > 1 ? 'bg-amber' : 'bg-wa-green'
  const textColor = pct > 5 ? 'text-danger' : pct > 1 ? 'text-amber-700' : 'text-green-700'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-label">
        <span className="text-admin-ink-2">{label}</span>
        <span className={`font-semibold tabular-nums ${textColor}`}>{pct ?? 0}%</span>
      </div>
      <div className="h-1.5 bg-admin-fill rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
        />
      </div>
    </div>
  )
}

function fmtDate(s) {
  if (!s) return ''
  return new Date(s).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function SantePage() {
  const { data, loading, error, refetch } = useAdminQuery(adminApi.sante)

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const wh  = data?.webhook ?? {}
  const q   = data?.parseQueue ?? {}
  const r2  = data?.r2 ?? {}
  const err = data?.errorRates ?? {}
  const logs = data?.logs ?? []

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-h2 font-display font-bold text-navy">Santé système</h2>
        <p className="text-body text-admin-muted">Dépendances, latence et erreurs en temps réel</p>
      </div>

      {/* 4 KPIs d'état */}
      {loading ? (
        <KpiSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatusKpi
            label="Webhook WhatsApp"
            value={wh.status ?? 'Inconnu'}
            status={wh.status === 'ok' ? 'ok' : wh.status ? 'error' : 'unknown'}
          />
          <StatusKpi
            label="Messages reçus / 24h"
            value={wh.received24h}
            status={wh.signatureErrors > 0 ? 'warning' : 'ok'}
          />
          <StatusKpi
            label="Latence parsing"
            value={data?.avgLatencyMs ? `${data.avgLatencyMs} ms` : '—'}
            status={data?.avgLatencyMs > 3000 ? 'error' : data?.avgLatencyMs > 1000 ? 'warning' : 'ok'}
          />
          <StatusKpi
            label="Stockage R2"
            value={r2.mb ? `${r2.mb} Mo` : '—'}
            status="ok"
          />
        </div>
      )}

      {/* Taux d'erreur par dépendance */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-admin-card p-5">
          <h3 className="text-h3 font-semibold text-navy mb-4">Taux d'erreur par dépendance</h3>
          <div className="space-y-3">
            <ErrorRate label="Haiku AI"     pct={err.haiku} />
            <ErrorRate label="Cloudflare"   pct={err.cloudflare} />
            <ErrorRate label="R2 Storage"   pct={err.r2} />
            <ErrorRate label="IPN Paiement" pct={err.ipn} />
          </div>
          {wh.signatureErrors > 0 && (
            <p className="mt-4 text-label text-amber-700 bg-amber/10 rounded-lg px-3 py-2 border border-amber/20">
              ⚠️ {wh.signatureErrors} erreur{wh.signatureErrors > 1 ? 's' : ''} de signature webhook détectée{wh.signatureErrors > 1 ? 's' : ''}.
            </p>
          )}
        </div>
      )}

      {/* Logs récents */}
      {!loading && logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
          <div className="px-4 py-3.5 border-b border-admin-line">
            <h3 className="text-h3 font-semibold text-navy">Logs récents</h3>
          </div>
          <div className="divide-y divide-admin-line">
            {logs.map((log, i) => {
              const levelColor = log.level === 'error' ? 'text-danger' : log.level === 'warn' ? 'text-amber-700' : 'text-admin-muted'
              return (
                <div key={i} className="flex gap-3 px-4 py-3">
                  <span className={`text-micro font-semibold uppercase shrink-0 mt-0.5 w-10 ${levelColor}`}>
                    {log.level}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-admin-ink">{log.message}</p>
                    <p className="text-micro text-admin-muted mt-0.5">
                      {log.slug && <span className="mr-2">/{log.slug}</span>}
                      {fmtDate(log.at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
