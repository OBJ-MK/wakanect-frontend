import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, Star, Crown } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'
import { cn } from '@/lib/utils'

const PERIODS = [
  { key: 'month', label: 'Mois', discount: null },
  { key: 'quarter', label: 'Trimestre', discount: '-10%' },
  { key: 'semester', label: 'Semestre', discount: '-15%' },
  { key: 'year', label: 'An', discount: '-20%' },
]

const PLANS = [
  {
    key: 'free',
    name: 'Gratuit',
    icon: Zap,
    iconBg: 'bg-white/10',
    iconColor: 'text-white/60',
    prices: { month: 0, quarter: 0, semester: 0, year: 0 },
    features: [
      '1 boutique en ligne',
      'Jusqu\'à 20 produits',
      'WhatsApp → catalogue (IA)',
      'Gestion des commandes',
    ],
    missing: ['Catalogue illimité', 'Support prioritaire', 'Statistiques avancées'],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    icon: Star,
    iconBg: 'bg-orange/15',
    iconColor: 'text-orange',
    prices: { month: 8500, quarter: 23000, semester: 43000, year: 82000 },
    features: [
      '1 boutique en ligne',
      'Catalogue illimité',
      'WhatsApp → catalogue (IA)',
      'Gestion des commandes',
      'Statistiques avancées',
      'Support standard',
    ],
    missing: ['Priorité fonctionnalités'],
    cta: 'Choisir Pro',
    highlight: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    icon: Crown,
    iconBg: 'bg-amber/15',
    iconColor: 'text-amber',
    prices: { month: 14900, quarter: 40000, semester: 75000, year: 142000 },
    features: [
      'Tout ce qui est dans Pro',
      'Priorité 1 mois sur les nouvelles fonctionnalités',
      'Support prioritaire',
    ],
    missing: [],
    cta: 'Choisir Premium',
    highlight: false,
  },
]

function PlanCard({ plan, period, onSelect }) {
  const price = plan.prices[period]
  const periodLabel = PERIODS.find(p => p.key === period)?.label?.toLowerCase() ?? 'mois'

  return (
    <div className={cn(
      'glass rounded-3xl p-5 flex flex-col gap-4 border transition-all',
      plan.highlight
        ? 'border-orange/30 shadow-orange-glow'
        : 'border-white/8',
    )}>
      {plan.highlight && (
        <div className="self-start px-3 py-1 rounded-full bg-orange text-white text-micro font-bold uppercase tracking-wider">
          Recommandé
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl ${plan.iconBg} flex items-center justify-center`}>
          <plan.icon size={20} className={plan.iconColor} />
        </div>
        <p className="font-display font-bold text-h3 text-white">{plan.name}</p>
      </div>

      <div>
        {price === 0 ? (
          <p className="font-display font-bold text-h1 text-white">Gratuit</p>
        ) : (
          <div>
            <p className="font-display font-bold text-h1 text-white">
              {price.toLocaleString('fr-FR')} <span className="text-h3 text-white/50 font-medium">FCFA</span>
            </p>
            <p className="text-micro text-white/40">/ {periodLabel}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {plan.features.map(f => (
          <div key={f} className="flex items-start gap-2">
            <Check size={13} className="text-emerald mt-0.5 shrink-0" />
            <p className="text-label text-white/70">{f}</p>
          </div>
        ))}
        {plan.missing.map(f => (
          <div key={f} className="flex items-start gap-2 opacity-40">
            <div className="w-3 h-0.5 bg-white/30 mt-2 shrink-0" />
            <p className="text-label text-white/50">{f}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        className={cn(
          'w-full py-3 rounded-2xl font-semibold text-body transition-all active:scale-[0.98]',
          plan.highlight
            ? 'bg-orange text-white hover:bg-orange-hi shadow-orange-glow'
            : price === 0
              ? 'bg-white/10 text-white hover:bg-white/18'
              : 'glass border border-white/20 text-white hover:bg-white/10',
        )}
      >
        {plan.cta}
      </button>
    </div>
  )
}

export function FormulasPage() {
  const [period, setPeriod] = useState('month')
  const navigate = useNavigate()

  function selectPlan(plan) {
    if (plan.prices[period] === 0) {
      navigate('/app')
    } else {
      navigate('/abonnement/paiement', { state: { plan: plan.key, period } })
    }
  }

  return (
    <div className="min-h-dvh bg-navy-deep">
      <div className="page-container py-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center pt-4">
          <WakanectLogo variant="mark" className="h-10 w-10" />
          <div>
            <h1 className="font-display font-bold text-h1 text-white">Choisissez votre formule</h1>
            <p className="text-label text-white/50 mt-1">14 jours d'essai gratuit · Sans engagement</p>
          </div>
        </div>

        {/* Trial banner */}
        <div className="glass rounded-3xl px-4 py-3 border border-emerald/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald/15 flex items-center justify-center">
            <Check size={16} className="text-emerald" />
          </div>
          <p className="text-label text-white/70 flex-1">
            <span className="text-emerald font-semibold">14 jours d'essai gratuit</span> — toutes fonctionnalités débloquées
          </p>
        </div>

        {/* Period selector */}
        <div className="flex gap-1 glass rounded-2xl p-1">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                'flex-1 flex flex-col items-center py-2 rounded-xl transition-all text-micro font-semibold',
                period === p.key
                  ? 'bg-orange text-white'
                  : 'text-white/50 hover:text-white/80',
              )}
            >
              {p.label}
              {p.discount && (
                <span className={cn(
                  'text-[10px]',
                  period === p.key ? 'text-white/80' : 'text-emerald',
                )}>
                  {p.discount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div className="flex flex-col gap-4">
          {PLANS.map(plan => (
            <PlanCard
              key={plan.key}
              plan={plan}
              period={period}
              onSelect={selectPlan}
            />
          ))}
        </div>

        <p className="text-micro text-white/25 text-center pb-4">
          Les prix sont indiqués en FCFA. Votre pays est détecté automatiquement.
        </p>
      </div>
    </div>
  )
}
