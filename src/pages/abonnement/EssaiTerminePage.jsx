import { useNavigate } from 'react-router-dom'
import { Clock, Zap } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

export function EssaiTerminePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-fade-up">
        <WakanectLogo variant="mark" className="h-12 w-12" />

        <div className="w-20 h-20 rounded-full bg-amber/15 flex items-center justify-center">
          <Clock size={36} className="text-amber" />
        </div>

        <div>
          <h1 className="font-display font-bold text-h1 text-white">Essai terminé</h1>
          <p className="text-body text-white/55 mt-2 leading-relaxed">
            Vos 14 jours d'essai gratuit sont écoulés. Choisissez un plan pour continuer à utiliser Wakanect sans interruption.
          </p>
        </div>

        <div className="glass rounded-3xl p-4 w-full border border-amber/20">
          <p className="text-label text-white/60 leading-relaxed">
            Vos produits et commandes sont <span className="text-white font-semibold">conservés</span>.
            Votre boutique sera de nouveau visible dès que vous souscrivez.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate('/abonnement')}
            className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
          >
            <Zap size={18} />
            Choisir mon plan
          </button>
          <button
            onClick={() => navigate('/app')}
            className="text-label text-white/40 hover:text-white/60 transition-colors py-2"
          >
            Accéder quand même (lecture seule)
          </button>
        </div>
      </div>
    </div>
  )
}
