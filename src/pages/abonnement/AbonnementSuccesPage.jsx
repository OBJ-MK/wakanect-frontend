import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

export function AbonnementSuccesPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-scale-in">
        <WakanectLogo variant="mark" className="h-12 w-12" />

        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald/15 flex items-center justify-center">
            <CheckCircle size={44} className="text-emerald" strokeWidth={1.5} />
          </div>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald/10 blur-xl" />
        </div>

        <div>
          <h1 className="font-display font-bold text-h1 text-white">Abonnement activé !</h1>
          <p className="text-body text-white/55 mt-2 leading-relaxed">
            Votre boutique est maintenant pleinement opérationnelle. Commencez à partager votre lien et à recevoir des commandes.
          </p>
        </div>

        <button
          onClick={() => navigate('/app')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
        >
          Aller à mon tableau de bord
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
