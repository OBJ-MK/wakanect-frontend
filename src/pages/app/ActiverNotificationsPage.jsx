import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/services/api'

// Convertit une clé VAPID base64url en Uint8Array (requis par applicationServerKey)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

async function subscribeToPush() {
  // 1. Service worker prêt
  const reg = await navigator.serviceWorker.ready
  // 2. Réutiliser un abonnement existant, sinon en créer un
  let subscription = await reg.pushManager.getSubscription()
  if (!subscription) {
    const { publicKey } = await api.get('/api/push/vapid-public-key')
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  }
  // 3. Envoyer au backend (token injecté automatiquement par api)
  await api.post('/api/push/subscribe', { subscription })
  return subscription
}

export function ActiverNotificationsPage() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleActivate() {
    setError('')

    // Garde de support
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setError("Ton navigateur ne supporte pas les notifications push.")
      return
    }

    setLoading(true)
    try {
      const permission = await Notification.requestPermission()

      if (permission === 'denied') {
        setError("Tu as bloqué les notifications. Pour les activer, va dans les réglages de ton navigateur.")
        setEnabled(false)
        return
      }
      if (permission !== 'granted') {
        // 'default' : l'utilisateur a fermé la demande sans choisir
        setEnabled(false)
        return
      }

      // Permission accordée -> créer et enregistrer l'abonnement
      await subscribeToPush()
      setEnabled(true)
    } catch (err) {
      console.error('[push] échec abonnement:', err)
      setError("Activation impossible. Vérifie ta connexion et réessaie.")
      setEnabled(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        {/* Illustration */}
        <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/20 bg-white/4 flex items-center justify-center">
          <Bell size={36} className="text-white/40" />
        </div>
        <div>
          <h1 className="font-display font-bold text-h2 text-white">Ne rate aucune commande</h1>
          <p className="text-label text-white/55 mt-2 leading-relaxed">
            Active les notifications pour être prévenu dès qu'un client commande, même app fermée.
          </p>
        </div>
        {/* Carte toggle */}
        <div className="glass rounded-3xl p-4 w-full flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/8 flex items-center justify-center shrink-0">
            <Bell size={18} className="text-white/60" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-semibold text-white">Notifications</p>
            <p className="text-micro text-white/40">Commandes &amp; alertes de stock</p>
          </div>
          <button type="button" disabled aria-checked={enabled} role="switch"
            className={cn('relative w-12 h-6 rounded-full transition-colors shrink-0',
              enabled ? 'bg-orange' : 'bg-white/15')}>
            <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
              enabled ? 'left-6' : 'left-0.5')} />
          </button>
        </div>

        {error && (
          <p className="text-micro text-orange/90 leading-relaxed">{error}</p>
        )}

        <div className="flex flex-col gap-3 w-full">
          {enabled ? (
            <Link to="/app"
              className="py-4 rounded-2xl bg-white text-navy-deep font-bold text-body hover:opacity-90 active:scale-95 transition-all text-center">
              Notifications activées ✓
            </Link>
          ) : (
            <button onClick={handleActivate} disabled={loading}
              className="py-4 rounded-2xl bg-white text-navy-deep font-bold text-body hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all">
              {loading ? 'Activation…' : 'Activer les notifications'}
            </button>
          )}
          <Link to="/app" className="py-1 text-label text-white/40 hover:text-white/60 transition-colors">
            {enabled ? 'Retour' : 'Plus tard'}
          </Link>
        </div>
      </div>
    </div>
  )
}
