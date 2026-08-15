import { useState } from 'react'
import { Shield, CheckCircle2, XCircle } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { DataTable } from '@/components/admin/DataTable'
import { LoadingState } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { EmptyState } from '@/components/admin/EmptyState'

const SCOPE_OPTIONS = [
  { value: 'all',      label: 'Tout' },
  { value: 'admin',    label: 'Actions admin' },
  { value: 'owner',    label: 'Actions propriétaires' },
  { value: 'employee', label: 'Actions employés' },
]

const RESULT_OPTIONS = [
  { value: 'all',   label: 'Tout' },
  { value: 'true',  label: 'Réussites' },
  { value: 'false', label: 'Échecs' },
]

const COLS = [
  { key: 'at',         label: 'Horodatage' },
  { key: 'author',     label: 'Auteur' },
  { key: 'authorType', label: 'Type' },
  { key: 'action',     label: 'Action' },
  { key: 'success',    label: 'Résultat' },
  { key: 'target',     label: 'Cible' },
  { key: 'slug',       label: 'Boutique' },
]

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AuditPage() {
  const [scope, setScope] = useState('all')
  const [resultFilter, setResultFilter] = useState('all')

  const { data, loading, error, refetch } = useAdminQuery(
    () => adminApi.audit(scope, resultFilter),
    [scope, resultFilter],
  )

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const rows = data?.rows ?? []

  return (
    <div className="space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-h2 font-display font-bold text-navy">Journal d'audit</h2>
          <p className="text-body text-admin-muted">
            Toutes les actions horodatées — {rows.length} entrée{rows.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtre scope */}
        <div className="flex gap-1.5">
          {SCOPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setScope(opt.value)}
              className={`px-3 py-2 text-label rounded-xl border transition-colors ${
                scope === opt.value
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-admin-ink-2 border-admin-line hover:border-navy/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre résultat */}
      <div className="flex gap-1.5">
        {RESULT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setResultFilter(opt.value)}
            className={`px-3 py-1.5 text-label rounded-lg border transition-colors ${
              resultFilter === opt.value
                ? opt.value === 'false'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-navy/10 text-navy border-navy/20'
                : 'bg-white text-admin-ink-2 border-admin-line hover:border-navy/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Note performedBy */}
      <div className="bg-navy/5 border border-admin-line rounded-xl px-4 py-3 flex items-start gap-2">
        <Shield className="w-4 h-4 text-navy shrink-0 mt-0.5" />
        <p className="text-label text-admin-ink-2">
          Chaque entrée est horodatée côté serveur et signée avec l'identité de l'auteur (<em>performedBy</em>).
          Les actions admin sont distinguées des actions employés pour faciliter les enquêtes.
        </p>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
        {loading ? (
          <div className="p-4"><LoadingState rows={10} /></div>
        ) : (
          <DataTable
            columns={COLS.map(col => ({
              ...col,
              render: col.key === 'at'
                ? (val) => <span className="tabular-nums text-admin-muted">{fmtDate(val)}</span>
                : col.key === 'authorType'
                ? (val) => (
                    <span className={`text-micro font-semibold uppercase ${
                      val === 'admin' ? 'text-orange' : 'text-admin-ink-2'
                    }`}>
                      {val}
                    </span>
                  )
                : col.key === 'action'
                ? (val) => <span className="font-mono text-micro text-admin-ink bg-admin-fill px-1.5 py-0.5 rounded">{val}</span>
                : col.key === 'success'
                ? (val) => val ? (
                    <span className="inline-flex items-center gap-1 text-micro font-medium text-green-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Réussi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-micro font-medium text-red-700">
                      <XCircle className="w-3.5 h-3.5" /> Échec
                    </span>
                  )
                : undefined,
            }))}
            rows={rows}
            emptyNode={
              <EmptyState
                icon={Shield}
                title="Aucun événement d'audit"
                description="Le journal est vide pour ce filtre."
                className="py-12"
              />
            }
          />
        )}
      </div>
    </div>
  )
}