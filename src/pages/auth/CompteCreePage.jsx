import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy, MessageCircle, ChevronRight } from 'lucide-react'

const WAKANECT_NUMBER = '+221 77 XXX XX XX'
const WAKANECT_RAW = '221770000000'

export function CompteCreePage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  function copyNumber() {
    navigator.clipboard.writeText(WAKANECT_NUMBER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass rounded-4xl p-6 animate-fade-up flex flex-col gap-6">
      {/* Success header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-emerald/15 flex items-center justify-center">
          <Check size={30} className="text-emerald" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display text-h2 font-bold text-white">Compte créé !</h1>
          <p className="text-label text-white/55 mt-1">
            Votre boutique est prête. Voici la prochaine étape.
          </p>
        </div>
      </div>

      {/* Wakanect number highlight */}
      <div className="flex flex-col gap-3 glass rounded-3xl p-4 border border-wa-green/20">
        <p className="text-micro text-white/45 uppercase tracking-wider text-center">
          Votre numéro Wakanect
        </p>
        <p className="font-display font-bold text-h1 text-white text-center">
          {WAKANECT_NUMBER}
        </p>
        <p className="text-label text-white/55 text-center leading-relaxed">
          Transférez-y vos messages WhatsApp décrivant vos produits. L'IA les ajoutera à votre catalogue automatiquement.
        </p>
        <button
          onClick={copyNumber}
          className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/10 text-white text-label font-semibold hover:bg-white/18 active:scale-95 transition-all"
        >
          {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
          {copied ? 'Numéro copié !' : 'Copier le numéro'}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <a
          href={`https://wa.me/${WAKANECT_RAW}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-wa-green text-white font-semibold text-body hover:opacity-90 active:scale-95 transition-all"
        >
          <MessageCircle size={18} />
          Ouvrir WhatsApp
        </a>

        <button
          onClick={() => navigate('/app')}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-95 transition-all"
        >
          Accéder à mon tableau de bord
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
