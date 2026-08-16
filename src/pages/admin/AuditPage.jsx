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
  { key: 'details',    label: 'Détails' },
  { key: 'success',    label: 'Résultat' },
  { key: 'target',     label: 'Cible' },
  { key: 'slug',       label: 'Boutique' },
]

const STATUS_LABELS_FR = {
  pending: 'Nouvelle', confirmed: 'Confirmée', delivered: 'Livrée', cancelled: 'Annulée',
  preparing: 'En préparation', ready: 'Prête',
  unpaid: 'Non payée', partial: 'Partiel', paid: 'Payée',
}

const CANCEL_REASON_LABELS_FR = {
  stock_epuise: 'Stock épuisé',
  variante_indisponible: 'Couleur/taille indisponible',
  client_injoignable: 'Client injoignable',
  autre: 'Autre',
}

const FAILURE_REASON_LABELS_FR = {
  transition_invalide: 'Transition de statut invalide',
  raison_annulation_manquante: "Raison d'annulation manquante",
  stock_insuffisant: 'Stock insuffisant',
  valeur_invalide: 'Valeur invalide',
  mot_de_passe_invalide: 'Mot de passe invalide',
  compte_introuvable_ou_inactif: 'Compte introuvable ou inactif',
  boutique_introuvable: 'Boutique introuvable',
  employe_introuvable_ou_inactif: 'Employé introuvable ou inactif',
}

// Traduit les métadonnées brutes (JSON) en résumé lisible, spécifique à chaque
// type d'action — évite d'avoir à décoder du JSON pour comprendre une ligne.
function summarizeDetails(row) {
  const m = row.metadata || {}
  const parts = []

  if (m.previousStatus || m.newStatus || m.attemptedStatus) {
    const from = STATUS_LABELS_FR[m.previousStatus] || m.previousStatus
    const to = STATUS_LABELS_FR[m.newStatus || m.attemptedStatus] || m.newStatus || m.attemptedStatus
    if (from && to) parts.push(`${from} → ${to}`)
  }
  if (m.previousPaymentStatus || m.newPaymentStatus) {
    const from = STATUS_LABELS_FR[m.previousPaymentStatus] || m.previousPaymentStatus
    const to = STATUS_LABELS_FR[m.newPaymentStatus] || m.newPaymentStatus
    parts.push(`Paiement : ${from} → ${to}`)
  }
  if (m.cancelReason) {
    parts.push(`Raison : ${CANCEL_REASON_LABELS_FR[m.cancelReason] || m.cancelReason}${m.cancelReasonDetail ? ` (${m.cancelReasonDetail})` : ''}`)
  }
  if (m.reason) {
    parts.push(FAILURE_REASON_LABELS_FR[m.reason] || m.reason)
  }
  if (m.detail) parts.push(m.detail)
  if (m.orderNumber) parts.push(`Commande ${m.orderNumber}`)
  if (m.openCount) parts.push(`Ouvert ${m.openCount}×`)
  if (m.created !== undefined || m.updated !== undefined) {
    parts.push(`${m.created || 0} créé(s), ${m.updated || 0} mis à jour`)
  }
  if (Array.isArray(m.errors) && m.errors.length) parts.push(`${m.errors.length} erreur(s)`)
  if (m.name) parts.push(m.name)
  if (m.price !== undefined) parts.push(`${m.price} FCFA`)
  if (m.changes) parts.push(`Modifié : ${Object.keys(m.changes).join(', ')}`)
  if (m.boutiqueSlug) parts.push(m.boutiqueSlug)
  if (m.previousPlan || m.newPlan) parts.push(`Plan : ${m.previousPlan} → ${m.newPlan}`)
  if (m.days) parts.push(`+${m.days}j`)

  return parts.length ? parts.join(' · ') : null
}

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
                : col.key === 'details'
                ? (_val, row) => (
                    <span className="text-label text-admin-ink-2">{summarizeDetails(row) ?? '—'}</span>
                  )
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