import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, RefreshCw, AlertTriangle, Zap, Star, Crown, CalendarX, RotateCcw } from 'lucide-react'
import { subscriptionService } from '@/services/subscriptionService'
import { useAdminQuery } from '@/hooks/useAdminQuery'

const PLAN_COLOR = { free: 'text-white/60', pro: 'text-orange', premium: 'text-amber' }
const PLAN_ICON  = { free: Zap, pro: Star, premium: Crown }
const PLAN_NAME  = { free: 'Gratuit', pro: 'Pro', premium: 'Premium' }

const PERIOD_LABEL = {
  month: 'Mensuel', quarter: 'Trimestriel',
  semester: 'Semestriel', year: 'Annuel', essai: 'Essai',
}

const STATUS_DOT = {
  essai: 'bg-amber', actif: 'bg-emerald', expiré: 'bg-white/30',
}
const STATUS_LABEL = {
  essai: 'Essai en cours', actif: 'Abonnement actif', expiré: 'Abonnement expiré',
}

function fmtDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtAmount(amount) {
  return amount?.toLocaleString('fr-FR') ?? '—'
}

export function MonAbonnementPage() {
  const [cancelling, setCancelling]     = useState(false)
  const [reactivating, setReactivating] = useState(false)
  const [actionError, setActionError]   = useState(null)

  const {
    data: sub,
    loading: subLoading,
    error: subError,
    refetch: refetchSub,
  } = useAdminQuery(() => subscriptionService.getSubscription(), [])

  const {
    data: paymentsData,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useAdminQuery(() => subscriptionService.getPayments(), [])

  const plan   = sub?.plan   ?? 'free'
  const status = sub?.status ?? 'expiré'
  const endsAt = fmtDate(sub?.endsAt)
  const period = sub?.period ?? null
  const cancelAtPeriodEnd = sub?.cancelAtPeriodEnd ?? false

  const PlanIcon  = PLAN_ICON[plan] ?? Zap
  const planColor = PLAN_COLOR[plan] ?? 'text-orange'
  const planName  = PLAN_NAME[plan] ?? plan
  const periodTxt = PERIOD_LABEL[period] ?? period ?? 'Essai'
  const statusDot = STATUS_DOT[status] ?? 'bg-white/30'
  const statusTxt = STATUS_LABEL[status] ?? status

  async function handleCancel() {
    if (!window.confirm('Confirmer la résiliation ? Votre accès reste actif jusqu\'à la fin de la période.')) return
    setActionError(null)
    setCancelling(true)
    try {
      await subscriptionService.cancel()
      await refetchSub()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setCancelling(false)
    }
  }

  async function handleReactivate() {
    setActionError(null)
    setReactivating(true)
    try {
      await subscriptionService.reactivate()
      await refetchSub()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setReactivating(false)
    }
  }

  function refetchAll() {
    refetchSub()
    refetchPayments()
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app/profil"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Mon abonnement</h1>
          {!subLoading && (
            <button
              onClick={refetchAll}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Rafraîchir"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Error chargement */}
        {subError && (
          <div className="glass rounded-3xl p-5 border border-red-500/20 flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={20} className="text-red-400" />
            <p className="text-label text-white/60">Impossible de charger l'abonnement</p>
            <button
              onClick={refetchSub}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-label hover:bg-white/15 transition-colors"
            >
              <RefreshCw size={14} />
              Réessayer
            </button>
          </div>
        )}

        {/* Error action cancel/reactivate */}
        {actionError && (
          <div className="glass rounded-2xl px-4 py-3 border border-red-500/20">
            <p className="text-label text-red-400 text-center">{actionError}</p>
          </div>
        )}

        {/* Skeleton */}
        {subLoading && (
          <div className="relative overflow-hidden glass rounded-4xl p-6 animate-pulse h-40" />
        )}

        {/* Plan actuel */}
        {!subLoading && !subError && (
          <div className="relative overflow-hidden glass rounded-4xl p-6">
            <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-70" />

            <p className="text-micro text-white/45 uppercase tracking-wider mb-3">Plan actuel</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange/15 flex items-center justify-center shrink-0">
                <PlanIcon size={20} className={planColor} />
              </div>
              <div>
                <p className={`font-display font-bold text-h2 ${planColor}`}>{planName}</p>
                {period && <p className="text-label text-white/50">{periodTxt}</p>}
              </div>
            </div>

            {/* Statut + date */}
            <div className="pt-4 border-t border-white/8 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusDot} shrink-0`} />
              <p className="text-label text-white/60">
                {statusTxt}
                {endsAt && ` · renouvellement le ${endsAt}`}
              </p>
            </div>

            {/* Badge résiliation programmée */}
            {cancelAtPeriodEnd && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber/10 border border-amber/20">
                <CalendarX size={14} className="text-amber shrink-0" />
                <p className="text-label text-amber">
                  Résiliation programmée · accès jusqu'au {endsAt ?? '—'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!subLoading && !subError && (
          <div className="flex flex-col gap-3">
            <Link
              to="/abonnement"
              className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
            >
              <Zap size={18} />
              {plan === 'free' ? 'Choisir un plan' : 'Changer de formule · période'}
            </Link>

            {/* Résiliation / Réactivation */}
            {status === 'actif' && (
              cancelAtPeriodEnd ? (
                <button
                  onClick={handleReactivate}
                  disabled={reactivating}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-3xl glass border border-emerald/25 text-emerald font-semibold text-body hover:bg-emerald/8 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  <RotateCcw size={16} />
                  {reactivating ? 'Réactivation…' : 'Réactiver l\'abonnement'}
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-3xl glass border border-white/12 text-white/50 font-semibold text-body hover:text-white/70 hover:bg-white/5 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  <CalendarX size={16} />
                  {cancelling ? 'Résiliation…' : 'Annuler l\'abonnement'}
                </button>
              )
            )}
          </div>
        )}

        {/* Historique des paiements */}
        <div className="glass rounded-3xl p-6 flex flex-col gap-4">
          <p className="font-display font-semibold text-h3 text-white">Historique des paiements</p>

          {paymentsLoading && (
            <div className="animate-pulse flex flex-col gap-3">
              {[0, 1].map(i => <div key={i} className="h-12 rounded-2xl bg-white/5" />)}
            </div>
          )}

          {paymentsError && (
            <div className="flex flex-col items-center gap-2 text-center py-2">
              <p className="text-label text-white/40">Impossible de charger l'historique</p>
              <button
                onClick={refetchPayments}
                className="text-label text-orange hover:text-orange-hi transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {!paymentsLoading && !paymentsError && (paymentsData?.payments ?? []).length === 0 && (
            <div className="text-center py-2">
              <p className="text-body font-semibold text-white/40">Aucun paiement</p>
              <p className="text-label text-white/25 mt-1">Votre historique apparaîtra ici</p>
            </div>
          )}

          {!paymentsLoading && !paymentsError && (paymentsData?.payments ?? []).map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-3 border-t border-white/6 first:border-0 first:pt-0"
            >
              <div>
                <p className="text-label font-semibold text-white capitalize">
                  {PLAN_NAME[p.plan] ?? p.plan} · {PERIOD_LABEL[p.period] ?? p.period}
                </p>
                <p className="text-micro text-white/40">
                  {new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-label font-semibold text-white">{fmtAmount(p.amount)} FCFA</p>
                <p className={`text-micro ${p.status === 'completed' ? 'text-emerald' : 'text-red-400'}`}>
                  {p.status === 'completed' ? 'Payé' : 'Échoué'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
