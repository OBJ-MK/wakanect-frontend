import { useState, useEffect } from 'react'
import { ChevronLeft, Bell, Package, ShoppingBag, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '@/lib/formatters'
import { notificationService } from '@/services/notificationService'

const ICON_MAP = {
  order: { Icon: ShoppingBag, bg: 'bg-orange/12', color: 'text-orange' },
  validation: { Icon: Package, bg: 'bg-amber/12', color: 'text-amber' },
  stock: { Icon: AlertTriangle, bg: 'bg-red-500/12', color: 'text-red-400' },
}

function NotifRow({ notif, onOpen }) {
  const { Icon, bg, color } = ICON_MAP[notif.type] ?? ICON_MAP.order
  return (
    <Link
      to={notif.to || '/app'}
      onClick={() => onOpen(notif)}
      className={`flex items-start gap-3 px-4 py-4 border-b border-white/6 last:border-0 hover:bg-white/4 active:bg-white/8 transition-colors ${!notif.read ? 'bg-white/3' : ''}`}
    >
      <div className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={17} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-body font-semibold text-white">{notif.title}</p>
          {!notif.read && (
            <span className="w-2 h-2 rounded-full bg-orange shrink-0" />
          )}
        </div>
        <p className="text-label text-white/55 mt-0.5 leading-snug">{notif.body}</p>
        <p className="text-micro text-white/35 mt-1">{formatRelativeTime(notif.created_at)}</p>
      </div>
    </Link>
  )
}

export function NotificationsPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    notificationService.list()
      .then(data => { if (!cancelled) setNotifs(data.notifications || []) })
      .catch(() => { if (!cancelled) setNotifs([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const unread = notifs.filter(n => !n.read)

  function handleOpen(notif) {
    if (notif.read) return
    setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
    notificationService.markRead(notif.id).catch(() => {})
  }

  function handleMarkAllRead() {
    if (!unread.length) return
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    notificationService.markAllRead().catch(() => {})
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-h3 text-white">Notifications</h1>
            {unread.length > 0 && (
              <p className="text-micro text-white/45">{unread.length} non lu{unread.length > 1 ? 'es' : 'e'}</p>
            )}
          </div>
          {unread.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-label font-semibold text-orange px-2 py-1 -mr-2"
            >
              Tout marquer lu
            </button>
          )}
        </div>
      </div>

      <div className="page-container py-4">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-2xl bg-white/4 animate-pulse" />
            ))}
          </div>
        ) : notifs.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Bell size={28} className="text-white/20" />
            </div>
            <p className="text-body font-semibold text-white/60">Aucune notification</p>
            <p className="text-label text-white/35 mt-1">Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            {notifs.map(n => <NotifRow key={n.id} notif={n} onOpen={handleOpen} />)}
          </div>
        )}
      </div>
    </div>
  )
}