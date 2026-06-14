import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ActiverNotificationsPage() {
  const navigate = useNavigate()
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleActivate() {
    if (!('Notification' in window)) {
      setEnabled(true)
      return
    }
    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setEnabled(true)
        setTimeout(() => navigate(-1), 900)
      }
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
          <button
            type="button"
            onClick={() => setEnabled(e => !e)}
            role="switch"
            aria-checked={enabled}
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors shrink-0',
              enabled ? 'bg-orange' : 'bg-white/15'
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
              enabled ? 'left-6' : 'left-0.5'
            )} />
          </button>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleActivate}
            disabled={loading}
            className="py-4 rounded-2xl bg-white text-navy-deep font-bold text-body hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all"
          >
            {loading ? 'Activation…' : 'Activer les notifications'}
          </button>
          <Link
            to="/app"
            className="py-1 text-label text-white/40 hover:text-white/60 transition-colors"
          >
            Plus tard
          </Link>
        </div>
      </div>
    </div>
  )
}
