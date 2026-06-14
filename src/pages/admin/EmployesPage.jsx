import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { DataTable } from '@/components/admin/DataTable'
import { LoadingState } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { EmptyState } from '@/components/admin/EmptyState'

const EMP_COLS = [
  { key: 'name',           label: 'Nom' },
  { key: 'phone',          label: 'Téléphone' },
  { key: 'slug',           label: 'Boutique' },
  { key: 'productsSent',   label: 'Produits envoyés', className: 'text-right' },
  { key: 'ordersAccepted', label: 'Commandes acc.',   className: 'text-right' },
  { key: 'lastAction',     label: 'Dernière action' },
]

const LOG_COLS = [
  { key: 'at',     label: 'Horodatage' },
  { key: 'author', label: 'Auteur' },
  { key: 'action', label: 'Action' },
  { key: 'slug',   label: 'Boutique' },
]

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function EmployesPage() {
  const [q, setQ] = useState('')

  const { data, loading, error, refetch } = useAdminQuery(
    () => adminApi.employes(q),
    [q],
  )

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const rows   = data?.rows ?? []
  const recent = data?.recent ?? []

  return (
    <div className="space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-h2 font-display font-bold text-navy">Employés</h2>
          <p className="text-body text-admin-muted">Vue transversale de tous les comptes employés</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Nom, boutique…"
            className="pl-9 pr-4 py-2.5 bg-white border border-admin-line rounded-xl text-body text-admin-ink placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tableau employés */}
      <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
        <div className="px-4 py-3.5 border-b border-admin-line">
          <h3 className="text-h3 font-semibold text-navy">Tous les employés</h3>
        </div>
        {loading ? (
          <div className="p-4"><LoadingState rows={6} /></div>
        ) : (
          <DataTable
            columns={EMP_COLS.map(col => ({
              ...col,
              render: col.key === 'lastAction'
                ? (val) => <span className="text-admin-muted">{fmtDate(val)}</span>
                : col.key === 'productsSent' || col.key === 'ordersAccepted'
                ? (val) => <span className="tabular-nums">{val ?? 0}</span>
                : undefined,
            }))}
            rows={rows}
            emptyNode={
              <EmptyState
                icon={Users}
                title="Aucun employé trouvé"
                description="Aucun compte employé ne correspond à votre recherche."
                className="py-10"
              />
            }
          />
        )}
      </div>

      {/* Journal d'actions récentes */}
      {!loading && recent.length > 0 && (
        <div className="bg-white rounded-xl shadow-admin-card overflow-hidden">
          <div className="px-4 py-3.5 border-b border-admin-line">
            <h3 className="text-h3 font-semibold text-navy">Actions récentes</h3>
          </div>
          <DataTable
            columns={LOG_COLS.map(col => ({
              ...col,
              render: col.key === 'at'
                ? (val) => <span className="text-admin-muted tabular-nums">{fmtDate(val)}</span>
                : undefined,
            }))}
            rows={recent}
          />
        </div>
      )}
    </div>
  )
}
