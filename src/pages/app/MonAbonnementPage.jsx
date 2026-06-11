import { Link } from 'react-router-dom'
import { ChevronLeft, Check, CreditCard, Calendar, ChevronRight } from 'lucide-react'

const MOCK_SUB = {
  plan: 'Pro',
  period: 'Mensuel',
  status: 'active',
  next_billing: '2026-07-11',
  price: 8500,
  history: [
    { date: '2026-06-11', amount: 8500, plan: 'Pro Mensuel', status: 'Payé' },
    { date: '2026-05-11', amount: 8500, plan: 'Pro Mensuel', status: 'Payé' },
  ],
}

const PLAN_COLOR = {
  Gratuit: 'text-white/60',
  Pro: 'text-orange',
  Premium: 'text-amber',
}

export function MonAbonnementPage() {
  const sub = MOCK_SUB
  const planColor = PLAN_COLOR[sub.plan] ?? 'text-orange'

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
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* Plan actuel */}
        <div className="relative overflow-hidden glass rounded-4xl p-6">
          <div className="absolute top-0 left-0 right-0 h-0.5 gradient-thread opacity-70" />
          <p className="text-micro text-white/45 uppercase tracking-wider mb-2">Plan actuel</p>
          <div className="flex items-end justify-between">
            <div>
              <p className={`font-display font-bold text-display ${planColor}`}>{sub.plan}</p>
              <p className="text-label text-white/50 mt-1">{sub.period}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-h2 text-white">
                {sub.price.toLocaleString('fr-FR')} <span className="text-h3 font-medium text-white/50">FCFA</span>
              </p>
              <p className="text-micro text-white/35">par mois</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald" />
            <p className="text-label text-white/60">
              Actif · Prochain renouvellement le <span className="text-white font-semibold">{sub.next_billing}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="glass rounded-3xl overflow-hidden">
          <p className="text-micro text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">Gérer</p>
          <Link
            to="/abonnement"
            className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 hover:bg-white/4 transition-colors"
          >
            <div className="w-9 h-9 rounded-2xl bg-orange/10 flex items-center justify-center">
              <CreditCard size={16} className="text-orange" />
            </div>
            <p className="flex-1 text-body font-medium text-white">Changer de formule</p>
            <ChevronRight size={16} className="text-white/30" />
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/4 transition-colors text-left">
            <div className="w-9 h-9 rounded-2xl bg-white/8 flex items-center justify-center">
              <Calendar size={16} className="text-white/60" />
            </div>
            <p className="flex-1 text-body font-medium text-white">Changer la période</p>
            <ChevronRight size={16} className="text-white/30" />
          </button>
        </div>

        {/* Historique */}
        {sub.history.length > 0 && (
          <div>
            <p className="text-micro text-white/40 uppercase tracking-wider mb-3 px-1">Historique de paiement</p>
            <div className="glass rounded-3xl overflow-hidden">
              {sub.history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-white font-medium">{h.plan}</p>
                    <p className="text-micro text-white/40">{h.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-label font-bold text-white">{h.amount.toLocaleString('fr-FR')} FCFA</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Check size={10} className="text-emerald" />
                      <span className="text-micro text-emerald">{h.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancel */}
        <button className="text-center text-label text-white/30 hover:text-red-400 transition-colors">
          Annuler l'abonnement
        </button>
      </div>
    </div>
  )
}
