import { Link } from 'react-router-dom'
import { ChevronLeft, Zap, RefreshCw, AlertTriangle } from 'lucide-react'
import { api } from '@/services/api'
import { useAdminQuery } from '@/hooks/useAdminQuery'

const PLAN_COLOR = { free: 'text-white/60', pro: 'text-orange', premium: 'text-amber' }
const PLAN_NAME  = { free: 'Gratuit', pro: 'Pro', premium: 'Premium' }
const PERIOD_LABEL = {
  month: 'Mensuel', quarter: 'Trimestriel', semester: 'Semestriel',
  year: 'Annuel', essai: 'Essai',
}
const STATUS_DOT = {
  trial: 'bg-amber', active: 'bg-emerald', past_due: 'bg-red-400',
  canceled: 'bg-white/30', expired: 'bg-white/30', none: 'bg-white/30',
}
const STATUS_LABEL = {
  trial: 'Essai en cours',
  active: 'Abonnement actif',
  past_due: 'Paiement en retard',
  canceled: 'Abonnement annulé',
  expired: 'Abonnement expiré',
  none: 'Aucun abonnement',
}

function fmtDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function MonAbonnementPage() {
  const { data: sub, loading, error, refetch } = useAdminQuery(
    () => api.get('/api/subscription/status'),
    [],
  )

  const plan    = sub?.plan   ?? 'free'
  const period  = sub?.period ?? 'essai'
  const status  = sub?.status ?? 'none'
  const endsAt  = fmtDate(sub?.ends_at)
  const quota   = sub?.scans_quota ?? 0

  const planColor  = PLAN_COLOR[plan]  ?? 'text-orange'
  const planName   = PLAN_NAME[plan]   ?? plan
  const periodTxt  = PERIOD_LABEL[period] ?? period
  const statusDot  = STATUS_DOT[status]   ?? 'bg-white/30'
  const statusTxt  = STATUS_LABEL[status] ?? status

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app/profil"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Mon abonnement</h1>
          {!loading && (
            <button
              onClick={refetch}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Rafraîchir"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Error */}
        {error && (
          <div className="glass rounded-3xl p-5 border border-red-500/20 flex flex-col items-center gap-3 text-center">
            <AlertTriangle size={20} className="text-red-400" />
            <p className="text-label text-white/60">Impossible de charger l'abonnement</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-label hover:bg-white/15 transition-colors"
            >
              <RefreshCw size={14} />
              Réessayer
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="relative overflow-hidden glass rounded-4xl p-6 animate-pulse h-40" />
        )}

        {/* Plan actuel */}
        {!loading && !error && (
          <div className="relative overflow-hidden glass rounded-4xl p-6">
            <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-70" />
            <p className="text-micro text-white/45 uppercase tracking-wider mb-2">Plan actuel</p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className={`font-display font-bold text-display ${planColor}`}>{planName}</p>
                <p className="text-label text-white/50 mt-1">{periodTxt}</p>
              </div>
              {quota > 0 && (
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-h2 text-white">
                    {quota.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-micro text-white/35">scans/mois</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusDot} shrink-0`} />
              <p className="text-label text-white/60">
                {statusTxt}
                {endsAt && ` · jusqu'au ${endsAt}`}
              </p>
            </div>
          </div>
        )}

        {/* CTA upgrade */}
        <Link
          to="/abonnement"
          className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
        >
          <Zap size={18} />
          {plan === 'free' ? 'Choisir un plan' : 'Gérer mon abonnement'}
        </Link>

        {/* Historique */}
        <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-2">
          <p className="text-body font-semibold text-white/40">Aucun paiement</p>
          <p className="text-label text-white/25">Votre historique de paiement apparaîtra ici</p>
        </div>
      </div>
    </div>
  )
}
