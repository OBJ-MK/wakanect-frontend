import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Ban, Clock, RefreshCw, KeyRound, LogIn, RefreshCcw,
  User, Phone, Package, Activity,
} from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { useAdmin } from './AdminApp'
import { KpiCard } from '@/components/admin/KpiCard'
import { KpiSkeleton } from '@/components/admin/LoadingState'
import { ErrorState } from '@/components/admin/ErrorState'
import { AdminBadge } from '@/components/admin/AdminBadge'
import { BottomSheet } from '@/components/admin/BottomSheet'

function ActionButton({ icon: Icon, label, onClick, variant = 'default', disabled }) {
  const base = 'flex items-center gap-2 px-3 py-2.5 text-label font-medium rounded-xl border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange disabled:opacity-40'
  const cls = {
    default:  'bg-white text-navy border-admin-line hover:bg-admin-fill',
    danger:   'bg-danger/5 text-danger border-danger/20 hover:bg-danger/10',
    primary:  'bg-orange text-white border-orange hover:bg-orange-hi',
  }[variant]
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${cls}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}

export default function BoutiqueFichePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { setImpersonating } = useAdmin()

  const { data, loading, error, refetch } = useAdminQuery(
    () => adminApi.boutique(slug),
    [slug],
  )
  const boutique = data

  const [actionSheet, setActionSheet] = useState(false)
  const [busy, setBusy] = useState(null)

  async function runAction(label, fn) {
    setBusy(label)
    try {
      await fn()
      refetch()
    } finally {
      setBusy(null)
      setActionSheet(false)
    }
  }

  async function handleImpersonate() {
    setBusy('impersonate')
    try {
      await adminApi.impersonate(boutique.id)
      setImpersonating({ id: boutique.id, slug: boutique.slug, name: boutique.name })
      setActionSheet(false)
    } finally {
      setBusy(null)
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  const sub = boutique?.subscription ?? {}
  const stats = boutique?.stats ?? {}

  return (
    <div className="space-y-5">
      {/* Retour */}
      <button
        onClick={() => navigate('/admin/boutiques')}
        className="flex items-center gap-1.5 text-label text-admin-muted hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Boutiques
      </button>

      {/* En-tête identité */}
      {loading ? (
        <div className="h-20 bg-admin-fill rounded-xl motion-safe:animate-pulse" />
      ) : (
        <div className="bg-white rounded-xl shadow-admin-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-white font-bold text-h3 shrink-0">
                {boutique?.name?.slice(0, 1) ?? '?'}
              </div>
              <div>
                <h2 className="text-h2 font-display font-bold text-navy">{boutique?.name}</h2>
                <p className="text-body text-admin-muted">/{boutique?.slug} · {boutique?.country}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <AdminBadge variant={boutique?.plan} />
                  <AdminBadge variant={boutique?.status} />
                </div>
              </div>
            </div>

            {/* Actions desktop */}
            <div className="hidden md:flex flex-wrap gap-2">
              <ActionButton
                icon={LogIn}
                label="Se connecter en tant que"
                onClick={handleImpersonate}
                variant="primary"
                disabled={busy === 'impersonate'}
              />
              <ActionButton
                icon={Ban}
                label="Suspendre"
                onClick={() => runAction('suspend', () => adminApi.suspend(boutique.id))}
                variant="danger"
                disabled={!!busy}
              />
              <ActionButton
                icon={Clock}
                label="Prolonger essai"
                onClick={() => runAction('extend', () => adminApi.extendTrial(boutique.id))}
                disabled={!!busy}
              />
              <ActionButton
                icon={KeyRound}
                label="Reset mdp"
                onClick={() => runAction('reset', () => adminApi.resetPassword(boutique.id))}
                disabled={!!busy}
              />
              <ActionButton
                icon={RefreshCcw}
                label="Re-parsing"
                onClick={() => runAction('reparsing', () => adminApi.changePlan(boutique.id, boutique.plan))}
                disabled={!!busy}
              />
            </div>

            {/* Actions mobile → bottom sheet */}
            <button
              onClick={() => setActionSheet(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-orange text-white text-label font-medium rounded-xl"
            >
              <RefreshCw className="w-4 h-4" />
              Actions admin
            </button>
          </div>
        </div>
      )}

      {/* KPIs */}
      {loading ? (
        <KpiSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard label="Produits" value={boutique?.products ?? '—'} icon={Package} />
          <KpiCard label="Appels Haiku / j" value={stats.haikuPerDay ?? '—'} icon={Activity} />
          <KpiCard label="Renouvellement" value={sub.renewal ?? '—'} sub={sub.plan} />
        </div>
      )}

      {/* Informations + numéros + employés */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Infos boutique */}
          <div className="bg-white rounded-xl shadow-admin-card p-5 space-y-3">
            <h3 className="text-h3 font-semibold text-navy">Informations</h3>
            {[
              ['ID',          boutique?.id],
              ['Plan',        boutique?.plan],
              ['Statut',      boutique?.status],
              ['Pays',        boutique?.country],
              ['Créée le',    boutique?.createdAt],
              ['Abonnement',  sub.period],
              ['Paiement',    sub.paymentStatus],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-4 text-body">
                <span className="text-admin-muted">{label}</span>
                <span className="text-navy font-medium tabular-nums">{val ?? '—'}</span>
              </div>
            ))}

            {/* Numéros autorisés */}
            {boutique?.authorizedNumbers?.length > 0 && (
              <div>
                <p className="text-label text-admin-muted mb-1.5">Numéros autorisés</p>
                <div className="flex flex-wrap gap-1.5">
                  {boutique.authorizedNumbers.map(n => (
                    <span key={n} className="inline-flex items-center gap-1 px-2 py-0.5 bg-admin-fill rounded-md text-micro text-admin-ink">
                      <Phone className="w-3 h-3" />
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Employés */}
          <div className="bg-white rounded-xl shadow-admin-card p-5">
            <h3 className="text-h3 font-semibold text-navy mb-3">Employés</h3>
            {boutique?.employees?.length ? (
              <div className="space-y-2">
                {boutique.employees.map((emp, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-admin-line last:border-0">
                    <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-navy truncate">{emp.name}</p>
                      <p className="text-micro text-admin-muted">{emp.phone}</p>
                    </div>
                    <span className="text-micro text-admin-muted tabular-nums">{emp.productsSent ?? 0} produits</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body text-admin-muted">Aucun employé enregistré.</p>
            )}
          </div>
        </div>
      )}

      {/* Bottom sheet actions (mobile) */}
      <BottomSheet open={actionSheet} onClose={() => setActionSheet(false)} title="Actions admin">
        <div className="space-y-2">
          <ActionButton
            icon={LogIn}
            label="Se connecter en tant que"
            onClick={handleImpersonate}
            variant="primary"
            disabled={busy === 'impersonate'}
          />
          <ActionButton
            icon={Ban}
            label="Suspendre la boutique"
            onClick={() => runAction('suspend', () => adminApi.suspend(boutique.id))}
            variant="danger"
            disabled={!!busy}
          />
          <ActionButton
            icon={Clock}
            label="Prolonger l'essai"
            onClick={() => runAction('extend', () => adminApi.extendTrial(boutique.id))}
            disabled={!!busy}
          />
          <ActionButton
            icon={KeyRound}
            label="Reset mot de passe"
            onClick={() => runAction('reset', () => adminApi.resetPassword(boutique.id))}
            disabled={!!busy}
          />
          <ActionButton
            icon={RefreshCcw}
            label="Déclencher re-parsing"
            onClick={() => runAction('reparsing', () => adminApi.changePlan(boutique.id, boutique.plan))}
            disabled={!!busy}
          />
        </div>
      </BottomSheet>
    </div>
  )
}
