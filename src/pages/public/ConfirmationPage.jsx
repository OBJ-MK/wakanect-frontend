import { useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { CheckCircle, MessageCircle, ArrowLeft, MapPin, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usePageDuration } from '@/hooks/usePageDuration'

export function ConfirmationPage() {
  const { slug } = useParams()
  const { state } = useLocation()
  const trackingCode = state?.trackingCode
  const [copied, setCopied] = useState(false)
  usePageDuration(slug, 'confirmation')

  const trackingUrl = trackingCode
    ? `${window.location.origin}/boutique/${slug}/suivi/${trackingCode}`
    : null

  const handleCopy = async () => {
    if (!trackingUrl) return
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API indisponible (vieux navigateur / contexte non-https) —
      // le lien reste sélectionnable manuellement dans le champ affiché.
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-scale-in">
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald/15 flex items-center justify-center">
            <CheckCircle size={48} className="text-emerald" strokeWidth={1.5} />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-emerald/20 animate-ping" />
        </div>

        <h1 className="font-display font-extrabold text-h1 text-navy dark:text-white mb-2">
          Commande confirmée !
        </h1>
        <p className="text-body text-navy/60 dark:text-white/60 mb-2">
          Votre commande a bien été transmise au commerçant.
        </p>
        <p className="text-label text-navy/40 dark:text-white/40 mb-8">
          Il vous contactera sous peu sur WhatsApp pour confirmer les détails et convenir du paiement.
        </p>

        {/* Notification note */}
        <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-wa-green/10 border border-wa-green/20 mb-6">
          <MessageCircle size={18} className="text-wa-green shrink-0" />
          <p className="text-label text-navy dark:text-white/80 text-left">
            Le commerçant a été notifié de votre commande
          </p>
        </div>

        {trackingCode && (
          <>
            <Link to={`/boutique/${slug}/suivi/${trackingCode}`} className="w-full mb-3">
              <Button variant="primary" size="lg" fullWidth>
                <MapPin size={16} /> Suivre ma commande
              </Button>
            </Link>

            {/* Lien copiable — pour que le client puisse le coller dans ses
                notes/WhatsApp et revenir suivre sa commande plus tard */}
            <div className="w-full flex items-center gap-2 mb-1">
              <div className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10">
                <p className="text-micro text-navy/50 dark:text-white/40 truncate text-left">
                  {trackingUrl}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="shrink-0 w-10 h-10 rounded-xl bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 flex items-center justify-center hover:bg-navy/10 dark:hover:bg-white/10 active:scale-95 transition-all"
                aria-label="Copier le lien de suivi"
              >
                {copied
                  ? <Check size={16} className="text-emerald" />
                  : <Copy size={16} className="text-navy/50 dark:text-white/50" />}
              </button>
            </div>
            <p className="text-micro text-navy/40 dark:text-white/35 mb-6">
              {copied ? 'Copié !' : 'Gardez ce lien pour suivre votre commande plus tard'}
            </p>
          </>
        )}

        <Link to={`/boutique/${slug}`} className="w-full">
          <Button variant="outline" size="lg" fullWidth>
            <ArrowLeft size={16} /> Retour à la boutique
          </Button>
        </Link>
      </div>
    </div>
  )
}