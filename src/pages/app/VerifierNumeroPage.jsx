import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, MessageCircle, RefreshCw, ShieldCheck, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/Button'

/**
 * Vérification du numéro WhatsApp — OTP inversé (gratuit) :
 * le commerçant ENVOIE son code à 6 chiffres au numéro Wakanect via wa.me.
 * Le webhook backend valide le code et marque le numéro vérifié.
 * Page inerte tant que WAKANECT_WHATSAPP_NUMBER n'est pas configuré côté back.
 */
export function VerifierNumeroPage() {
  const { merchant, setMerchant } = useAuthStore()
  const [checking, setChecking] = useState(false)
  const [notYet, setNotYet] = useState(false)

  const code          = merchant?.phone_verification_code
  const wakaNumber    = (merchant?.wakanect_whatsapp_number || '').replace(/\D/g, '')
  const verified      = merchant?.phone_verified === true
  const waLink        = wakaNumber && code
    ? `https://wa.me/${wakaNumber}?text=${encodeURIComponent(code)}`
    : null

  async function checkStatus() {
    setChecking(true)
    setNotYet(false)
    try {
      const fresh = await authService.me() // /me renvoie le DTO directement
      setMerchant(fresh)
      if (fresh?.phone_verified !== true) setNotYet(true)
    } catch {
      setNotYet(true)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/app" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Vérifier mon numéro</h1>
        </div>
      </div>

      <div className="page-container py-6 flex flex-col gap-5 max-w-lg mx-auto">
        {verified ? (
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald/15 flex items-center justify-center">
              <ShieldCheck size={28} className="text-emerald" />
            </div>
            <p className="text-h3 font-display font-bold text-white">Numéro vérifié ✓</p>
            <p className="text-body text-white/60">
              Ton numéro WhatsApp est confirmé. Tu peux envoyer tes produits au numéro Wakanect.
            </p>
            <Link to="/app" className="text-orange underline text-label mt-1">Retour à l'accueil</Link>
          </div>
        ) : !waLink ? (
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-3">
            <ShieldCheck size={28} className="text-white/40" />
            <p className="text-body text-white/60">
              La vérification du numéro sera activée prochainement — rien à faire pour l'instant.
            </p>
          </div>
        ) : (
          <>
            <div className="glass rounded-3xl p-6 flex flex-col gap-4">
              <p className="text-body text-white/70">
                Pour confirmer que ce numéro WhatsApp est bien le tien, envoie ce code
                au numéro Wakanect — c'est gratuit et ça prend 10 secondes :
              </p>
              <p className="font-display font-extrabold text-display text-orange text-center tracking-[0.3em]">
                {code}
              </p>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" fullWidth className="!bg-wa-green hover:!bg-wa-green/90">
                  <MessageCircle size={18} />
                  Envoyer le code sur WhatsApp
                </Button>
              </a>
              <p className="text-micro text-white/40 text-center">
                Le message est pré-rempli — appuie juste sur Envoyer.
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              loading={checking}
              onClick={checkStatus}
              className="!bg-white/8 !text-white border border-white/15"
            >
              {checking ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
              J'ai envoyé le code
            </Button>
            {notYet && (
              <p className="text-label text-amber bg-amber/10 rounded-xl px-4 py-2.5 text-center">
                Pas encore reçu — envoie le code sur WhatsApp puis réessaie dans quelques secondes.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
