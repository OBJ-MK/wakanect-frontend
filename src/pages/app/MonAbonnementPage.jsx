import { Link } from 'react-router-dom'
import { ChevronLeft, Zap } from 'lucide-react'

const PLAN_COLOR = {
  Gratuit: 'text-white/60',
  Pro: 'text-orange',
  Premium: 'text-amber',
}

export function MonAbonnementPage() {
  const sub = { plan: 'Gratuit', period: 'Essai 14 jours', status: 'trial', next_billing: null, price: 0, history: [] }
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
              <p className="font-display font-bold text-h2 text-white">0 <span className="text-h3 font-medium text-white/50">FCFA</span></p>
              <p className="text-micro text-white/35">gratuit</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber" />
            <p className="text-label text-white/60">
              Essai en cours · Passez à un plan payant pour continuer après l'essai
            </p>
          </div>
        </div>

        {/* CTA upgrade */}
        <Link
          to="/abonnement"
          className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
        >
          <Zap size={18} />
          Choisir un plan
        </Link>

        {/* Historique vide */}
        <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-2">
          <p className="text-body font-semibold text-white/40">Aucun paiement</p>
          <p className="text-label text-white/25">Votre historique de paiement apparaîtra ici</p>
        </div>
      </div>
    </div>
  )
}
