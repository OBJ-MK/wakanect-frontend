import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Store } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { DataTable } from '@/components/admin/DataTable'
import { AdminBadge } from '@/components/admin/AdminBadge'
import { LoadingState } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { EmptyState } from '@/components/admin/EmptyState'

const PLAN_OPTIONS   = ['', 'pro', 'business', 'trial', 'free']
const STATUS_OPTIONS = ['', 'active', 'suspended', 'dormant']
const PLAN_LABELS    = { '': 'Tous les plans', pro: 'Pro', business: 'Business', trial: 'Essai', free: 'Gratuit' }
const STATUS_LABELS  = { '': 'Tous statuts', active: 'Active', suspended: 'Suspendue', dormant: 'Inactive' }

const COLUMNS = [
  { key: 'name',         label: 'Boutique' },
  { key: 'country',      label: 'Pays' },
  { key: 'plan',         label: 'Plan' },
  { key: 'status',       label: 'Statut' },
  { key: 'products',     label: 'Produits' },
  { key: 'haikuUsage',   label: 'Haiku / j' },
  { key: 'lastActivity', label: 'Dernière activité' },
]

function fmtDate(s) {
  if (!s) return '—'
  return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
    Math.round((new Date(s) - Date.now()) / 86_400_000),
    'day',
  )
}

export default function BoutiquesPage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')

  const fetchFn = useCallback(
    () => adminApi.boutiques({ q, plan, status }),
    [q, plan, status],
  )
  const { data, loading, error, refetch } = useAdminQuery(fetchFn, [q, plan, status])

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const rows = data?.rows ?? []

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div>
        <h2 className="text-h2 font-display font-bold text-navy">Boutiques</h2>
        <p className="text-body text-admin-muted">{rows.length} boutique{rows.length !== 1 ? 's' : ''} trouvée{rows.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Nom, slug, pays…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-admin-line rounded-xl text-body text-admin-ink placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
          />
        </div>

        {/* Chip plan */}
        <div className="flex gap-1.5 flex-wrap">
          {PLAN_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`px-3 py-2 text-label rounded-xl border transition-colors ${
                plan === p
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-admin-ink-2 border-admin-line hover:border-navy/30'
              }`}
            >
              {PLAN_LABELS[p]}
            </button>
          ))}
        </div>

        {/* Chip statut */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 text-label rounded-xl border transition-colors ${
                status === s
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-admin-ink-2 border-admin-line hover:border-navy/30'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
        {loading ? (
          <div className="p-4"><LoadingState rows={8} /></div>
        ) : (
          <DataTable
            columns={COLUMNS.map(col => ({
              ...col,
              render: col.key === 'plan'
                ? (val) => <AdminBadge variant={val} />
                : col.key === 'status'
                ? (val) => <AdminBadge variant={val} />
                : col.key === 'haikuUsage'
                ? (val) => <span className="tabular-nums">{val ?? 0}</span>
                : col.key === 'lastActivity'
                ? (val) => <span className="text-admin-muted">{fmtDate(val)}</span>
                : undefined,
            }))}
            rows={rows}
            onRowClick={row => navigate(`/admin/boutiques/${row.slug}`)}
            emptyNode={
              <EmptyState
                icon={Store}
                title="Aucune boutique trouvée"
                description="Modifiez vos critères de filtre ou de recherche."
                className="py-12"
              />
            }
          />
        )}
      </div>
    </div>
  )
}
