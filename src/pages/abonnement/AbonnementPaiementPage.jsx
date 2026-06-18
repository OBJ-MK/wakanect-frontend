import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ChevronLeft, CreditCard, Smartphone, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

const METHODS = [
  {
    key: 'wave',
    label: 'Wave',
    description: 'Paiement instantané via Wave',
    logo: '🌊',
    color: 'text-blue-400',
    bg: 'bg-blue-500/12',
  },
  {
    key: 'orange_money',
    label: 'Orange Money',
    description: 'Paiement via Orange Money',
    logo: '🟠',
    color: 'text-orange-400',
    bg: 'bg-orange/12',
  },
  {
    key: 'card',
    label: 'Carte bancaire',
    description: 'Visa, Mastercard',
    logo: '💳',
    color: 'text-white/60',
    bg: 'bg-white/8',
  },
]

const PERIOD_LABELS = { month: 'Mensuel', quarter: 'Trimestriel', semester: 'Semestriel', year: 'Annuel' }

export function AbonnementPaiementPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const plan     = state?.plan     ?? 'pro'
  const period   = state?.period   ?? 'month'
  // Prix transmis par FormulasPage depuis /api/plans — aucune valeur en dur ici.
  const price    = state?.price    ?? 0
  const planLabel  = state?.planName ?? plan
  const periodLabel = PERIOD_LABELS[period] ?? period

  const [method, setMethod] = useState('wave')
  const [phone, setPhone]   = useState('')
  const [loading, setLoading] = useState(false)

  async function pay() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    navigate('/abonnement/succes')
  }

  return (
    <div className="min-h-dvh bg-navy-deep">
      <div className="glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/abonnement"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Paiement</h1>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Order summary */}
        <div className="glass rounded-3xl p-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-60 rounded-t-3xl" />
          <p className="text-micro text-white/45 uppercase tracking-wider mb-3">Récapitulatif</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-h3 text-white">Plan {planLabel}</p>
              <p className="text-label text-white/50">{periodLabel}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-h2 text-white">
                {price.toLocaleString('fr-FR')} <span className="text-label text-white/40">FCFA</span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-3 px-1">Mode de paiement</p>
          <div className="flex flex-col gap-2">
            {METHODS.map(m => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                className={cn(
                  'glass rounded-2xl px-4 py-3.5 flex items-center gap-3 border transition-all text-left',
                  method === m.key ? 'border-orange/40 bg-orange/8' : 'border-white/8 hover:bg-white/4',
                )}
              >
                <span className="text-2xl">{m.logo}</span>
                <div className="flex-1">
                  <p className="text-body font-semibold text-white">{m.label}</p>
                  <p className="text-micro text-white/40">{m.description}</p>
                </div>
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all',
                  method === m.key ? 'border-orange bg-orange' : 'border-white/30',
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* Phone number for mobile money */}
        {(method === 'wave' || method === 'orange_money') && (
          <div className="glass rounded-3xl p-4 flex flex-col gap-2">
            <label className="text-label font-semibold text-white/60">
              Numéro de téléphone {method === 'wave' ? 'Wave' : 'Orange Money'}
            </label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-navy/60 border border-white/10 text-white placeholder:text-white/35 text-body focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange"
              />
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center gap-2 px-2">
          <Lock size={13} className="text-white/30 shrink-0" />
          <p className="text-micro text-white/30">
            Paiement sécurisé. Vos données bancaires ne sont jamais stockées par Wakanect.
          </p>
        </div>

        {/* Pay button */}
        <button
          onClick={pay}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <CreditCard size={18} />
              Payer {price.toLocaleString('fr-FR')} FCFA
            </>
          )}
        </button>
      </div>
    </div>
  )
}
