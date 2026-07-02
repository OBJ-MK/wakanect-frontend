import { useNavigate } from 'react-router-dom'
import { XCircle, Zap } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo' 

export function AbonnementAnnulePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-fade-up">
        <WakanectLogo variant="mark" className="h-12 w-12" />

        <div className="w-24 h-24 rounded-full bg-white/8 flex items-center justify-center">
          <XCircle size={44} className="text-white/40" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display font-bold text-h1 text-white">Paiement annulé</h1>
          <p className="text-body text-white/55 mt-2 leading-relaxed">
            Vous avez annulé le paiement. Votre abonnement n'a pas été modifié.
          </p>
        </div>

        <button
          onClick={() => navigate('/abonnement')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
        >
          <Zap size={18} />
          Revoir les formules
        </button>
      </div>
    </div>
  )
}
