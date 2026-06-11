import { useNavigate } from 'react-router-dom'
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

const WAKANECT_SUPPORT = '221770000000'

export function AbonnementEchecPage() {
  const navigate = useNavigate()

  const supportLink = `https://wa.me/${WAKANECT_SUPPORT}?text=${encodeURIComponent("Bonjour, mon paiement a échoué sur Wakanect. Pouvez-vous m'aider ?")}`

  return (
    <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-fade-up">
        <WakanectLogo variant="mark" className="h-12 w-12" />

        <div className="w-24 h-24 rounded-full bg-red-500/15 flex items-center justify-center">
          <XCircle size={44} className="text-red-400" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display font-bold text-h1 text-white">Paiement échoué</h1>
          <p className="text-body text-white/55 mt-2 leading-relaxed">
            Votre paiement n'a pas pu être traité. Vérifiez votre solde ou essayez un autre mode de paiement.
          </p>
        </div>

        <div className="glass rounded-3xl p-4 w-full border border-red-500/20">
          <p className="text-label text-white/55 leading-relaxed">
            Si le problème persiste, contactez notre support. Votre boutique reste accessible le temps de régler le problème.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
          >
            <RefreshCw size={18} />
            Réessayer le paiement
          </button>
          <a
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3.5 rounded-3xl glass border border-white/15 text-white font-semibold text-body hover:bg-white/8 active:scale-[0.98] transition-all"
          >
            <MessageCircle size={18} />
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  )
}
