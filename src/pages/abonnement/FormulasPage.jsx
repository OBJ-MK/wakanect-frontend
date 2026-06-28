import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Star, Crown, ChevronLeft, RefreshCw, Loader2, Clock } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'
import { usePlans } from '@/hooks/usePlans'
import { subscriptionService } from '@/services/subscriptionService'
import { cn } from '@/lib/utils'

const PLAN_VISUAL = {
  free:    { icon: Zap,   iconBg: 'bg-white/10',  iconColor: 'text-white/60', cta: 'Commencer gratuitement' },
  pro:     { icon: Star,  iconBg: 'bg-orange/15', iconColor: 'text-orange',   cta: 'Choisir Pro' },
  premium: { icon: Crown, iconBg: 'bg-amber/15',  iconColor: 'text-amber',    cta: 'Choisir Premium' },
}

const PERIOD_KEYS = [
  { key: 'month',    label: 'Mois' },
  { key: 'quarter',  label: 'Trimestre' },
  { key: 'semester', label: 'Semestre' },
  { key: 'year',     label: 'An' },
]

function PlanCard({ plan, period, currentPlan, checkingOut, onSelect }) {
  const visual      = PLAN_VISUAL[plan.key] ?? PLAN_VISUAL.pro
  const Icon        = visual.icon
  const price       = plan.prices[period] ?? 0
  const periodLabel = PERIOD_KEYS.find(p => p.key === period)?.label?.toLowerCase() ?? 'mois'
  const isCurrent   = plan.key === currentPlan
  const isLoading   = checkingOut === plan.key

  return (
    <div className={cn(
      'glass rounded-3xl p-5 flex flex-col gap-4 border transition-all',
      plan.highlight ? 'border-orange/30 shadow-orange-glow' : 'border-white/8',
    )}>
      {plan.highlight && (
        <div className="self-start px-3 py-1 rounded-full bg-orange text-white text-micro font-bold uppercase tracking-wider">
          Recommandé
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl ${visual.iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={visual.iconColor} />
        </div>
        <p className="font-display font-bold text-h3 text-white">{plan.name}</p>
      </div>

      <div>
        {price === 0 ? (
          <p className="font-display font-bold text-h1 text-white">Gratuit</p>
        ) : (
          <>
            <p className="font-display font-bold text-h1 text-white">
              {price.toLocaleString('fr-FR')}{' '}
              <span className="text-h3 text-white/50 font-medium">FCFA</span>
            </p>
            <p className="text-micro text-white/40">/ {periodLabel}</p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {plan.features.map(f => (
          <div key={f} className="flex items-start gap-2">
            <Check size={13} className="text-emerald mt-0.5 shrink-0" />
            <p className="text-label text-white/70">{f}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrent || !!checkingOut}
        className={cn(
          'w-full py-3 rounded-2xl font-semibold text-body transition-all active:scale-[0.98] flex items-center justify-center gap-2',
          isCurrent
            ? 'bg-white/5 text-white/30 cursor-default'
            : plan.highlight
              ? 'bg-orange text-white hover:bg-orange-hi shadow-orange-glow disabled:opacity-60'
              : price === 0
                ? 'bg-white/10 text-white hover:bg-white/18 disabled:opacity-60'
                : 'glass border border-white/20 text-white hover:bg-white/10 disabled:opacity-60',
        )}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {isCurrent ? 'Formule actuelle' : visual.cta}
      </button>
    </div>
  )
}

function PeriodSelector({ period, onChange, discounts }) {
  return (
    <div className="flex gap-1 glass rounded-2xl p-1">
      {PERIOD_KEYS.map(p => {
        const label = discounts?.[p.key] ?? null
        return (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={cn(
              'flex-1 flex flex-col items-center py-2 rounded-xl transition-all text-micro font-semibold',
              period === p.key ? 'bg-orange text-white' : 'text-white/50 hover:text-white/80',
            )}
          >
            {p.label}
            {label && (
              <span className={cn('text-[10px]', period === p.key ? 'text-white/80' : 'text-emerald')}>
                {label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[0, 1, 2].map(i => (
        <div key={i} className="glass rounded-3xl p-5 h-56 border border-white/8" />
      ))}
    </div>
  )
}

export function FormulasPage() {
  const [period, setPeriod]         = useState('month')
  const [checkingOut, setCheckingOut] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)
  const [sub, setSub]               = useState(null)
  const navigate                    = useNavigate()
  const { data, loading, error, refetch } = usePlans()

  useEffect(() => {
    if (!localStorage.getItem('waka_token')) return
    subscriptionService.getSubscription()
      .then(setSub)
      .catch(() => {})
  }, [])

  const trialDaysLeft = (() => {
    if (sub?.status !== 'essai' || !sub?.endsAt) return null
    const diff = new Date(sub.endsAt) - Date.now()
    return Math.max(0, Math.ceil(diff / 86_400_000))
  })()

  const currentPlan = sub?.plan ?? null

  async function selectPlan(plan) {
    if (plan.prices[period] === 0) {
      navigate('/app')
      return
    }
    setCheckoutError(null)
    setCheckingOut(plan.key)
    try {
      const { url } = await subscriptionService.createCheckout({ plan: plan.key, period })
      window.location.href = url
    } catch (err) {
      setCheckoutError(err.message ?? 'Erreur lors de la redirection vers le paiement')
      setCheckingOut(null)
    }
  }

  const trialDays = data?.trial?.days ?? 14

  return (
    <div className="min-h-dvh bg-navy-deep">
      <div className="sticky top-0 z-20 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          aria-label="Retour"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="page-container py-2 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <WakanectLogo variant="mark" className="h-10 w-10" />
          <div>
            <h1 className="font-display font-bold text-h1 text-white">Choisissez votre formule</h1>
            <p className="text-label text-white/50 mt-1">
              {trialDays} jours d'essai gratuit · Sans engagement
            </p>
          </div>
        </div>

        {/* Bandeau essai si statut trial */}
        {trialDaysLeft !== null ? (
          <div className="glass rounded-3xl px-4 py-3 border border-amber/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber/15 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-amber" />
            </div>
            <p className="text-label text-white/70 flex-1">
              <span className="text-amber font-semibold">Essai · {trialDaysLeft} jour{trialDaysLeft !== 1 ? 's' : ''} restant{trialDaysLeft !== 1 ? 's' : ''}</span>
              {' '}— abonnez-vous pour continuer sans interruption
            </p>
          </div>
        ) : (
          <div className="glass rounded-3xl px-4 py-3 border border-emerald/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald/15 flex items-center justify-center shrink-0">
              <Check size={16} className="text-emerald" />
            </div>
            <p className="text-label text-white/70 flex-1">
              <span className="text-emerald font-semibold">{trialDays} jours d'essai gratuit</span>
              {' '}— toutes fonctionnalités débloquées
            </p>
          </div>
        )}

        {/* Checkout error */}
        {checkoutError && (
          <div className="glass rounded-2xl px-4 py-3 border border-red-500/20">
            <p className="text-label text-red-400 text-center">{checkoutError}</p>
          </div>
        )}

        {/* Error plans */}
        {error && (
          <div className="glass rounded-3xl p-5 border border-red-500/20 flex flex-col items-center gap-3 text-center">
            <p className="text-label text-white/60">Impossible de charger les formules</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-label hover:bg-white/15 transition-colors"
            >
              <RefreshCw size={14} />
              Réessayer
            </button>
          </div>
        )}

        {/* Period selector */}
        {!error && (
          <PeriodSelector
            period={period}
            onChange={setPeriod}
            discounts={data?.discounts}
          />
        )}

        {/* Plans */}
        {loading && <LoadingSkeleton />}
        {!loading && !error && (
          <div className="flex flex-col gap-4 pb-6">
            {(data?.plans ?? []).map(plan => (
              <PlanCard
                key={plan.key}
                plan={plan}
                period={period}
                currentPlan={currentPlan}
                checkingOut={checkingOut}
                onSelect={selectPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
