import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, Loader2, RefreshCw, Clock } from 'lucide-react'
import { WakanectLogo } from '@/components/brand/WakanectLogo'
import { subscriptionService } from '@/services/subscriptionService'

const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS  = 15_000

export function AbonnementSuccesPage() {
  const navigate              = useNavigate()
  const [activated, setActivated] = useState(false)
  const [timedOut, setTimedOut]   = useState(false)
  const startRef              = useRef(Date.now())
  const timerRef              = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      if (cancelled) return
      try {
        const sub = await subscriptionService.getSubscription()
        if (sub?.status === 'actif') {
          setActivated(true)
          return
        }
      } catch {
        // ignore, on continue à poller
      }

      if (Date.now() - startRef.current >= POLL_TIMEOUT_MS) {
        setTimedOut(true)
        return
      }

      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
    }

    poll()

    return () => {
      cancelled = true
      clearTimeout(timerRef.current)
    }
  }, [])

  if (activated) {
    return (
      <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-scale-in">
          <WakanectLogo variant="mark" className="h-12 w-12" />

          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald/15 flex items-center justify-center">
              <CheckCircle size={44} className="text-emerald" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald/10 blur-xl" />
          </div>

          <div>
            <h1 className="font-display font-bold text-h1 text-white">Abonnement activé !</h1>
            <p className="text-body text-white/55 mt-2 leading-relaxed">
              Votre boutique est maintenant pleinement opérationnelle.
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

  if (timedOut) {
    return (
      <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-fade-up">
          <WakanectLogo variant="mark" className="h-12 w-12" />

          <div className="w-24 h-24 rounded-full bg-amber/15 flex items-center justify-center">
            <Clock size={44} className="text-amber" strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="font-display font-bold text-h1 text-white">Paiement reçu</h1>
            <p className="text-body text-white/55 mt-2 leading-relaxed">
              L'activation est en cours — cela peut prendre quelques instants.
            </p>
          </div>

          <div className="glass rounded-3xl p-4 w-full border border-amber/20">
            <p className="text-label text-white/60 leading-relaxed">
              Si votre abonnement n'apparaît pas dans quelques minutes, rafraîchissez ou contactez le support.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-orange text-white font-semibold text-body hover:bg-orange-hi active:scale-[0.98] transition-all shadow-orange-glow"
            >
              <RefreshCw size={18} />
              Rafraîchir
            </button>
            <button
              onClick={() => navigate('/app')}
              className="text-label text-white/40 hover:text-white/60 transition-colors py-2"
            >
              Accéder au tableau de bord
            </button>
          </div>
        </div>
      </div>
    )
  }

  // En cours de polling
  return (
    <div className="min-h-dvh bg-navy-deep flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        <WakanectLogo variant="mark" className="h-12 w-12" />
        <Loader2 size={40} className="text-orange animate-spin" />
        <div>
          <h1 className="font-display font-bold text-h1 text-white">Paiement reçu</h1>
          <p className="text-body text-white/55 mt-2">Activation de votre abonnement en cours…</p>
        </div>
      </div>
    </div>
  )
}
