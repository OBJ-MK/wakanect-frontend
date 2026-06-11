import { ChevronLeft, Bell, Package, ShoppingBag, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '@/lib/formatters'

const MOCK_NOTIFS = [
  {
    id: '1',
    type: 'order',
    title: 'Nouvelle commande',
    body: 'Aminata Diallo a passé une commande de 45 000 FCFA',
    to: '/app/commandes',
    read: false,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '2',
    type: 'validation',
    title: 'Produit à valider',
    body: 'Un nouveau produit a été détecté via WhatsApp : Robe Wax Ankara',
    to: '/app/validation',
    read: false,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '3',
    type: 'stock',
    title: 'Stock bas',
    body: 'Sneakers Air Force One — seulement 3 en stock',
    to: '/app/stock-bas',
    read: true,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    type: 'order',
    title: 'Commande confirmée',
    body: 'Moussa Traoré a confirmé sa commande de 28 500 FCFA',
    to: '/app/commandes',
    read: true,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
]

const ICON_MAP = {
  order: { Icon: ShoppingBag, bg: 'bg-orange/12', color: 'text-orange' },
  validation: { Icon: Package, bg: 'bg-amber/12', color: 'text-amber' },
  stock: { Icon: AlertTriangle, bg: 'bg-red-500/12', color: 'text-red-400' },
}

function NotifRow({ notif }) {
  const { Icon, bg, color } = ICON_MAP[notif.type] ?? ICON_MAP.order
  return (
    <Link
      to={notif.to}
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
  const unread = MOCK_NOTIFS.filter(n => !n.read)

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
        </div>
      </div>

      <div className="page-container py-4">
        {MOCK_NOTIFS.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Bell size={28} className="text-white/20" />
            </div>
            <p className="text-body font-semibold text-white/60">Aucune notification</p>
            <p className="text-label text-white/35 mt-1">Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            {MOCK_NOTIFS.map(n => <NotifRow key={n.id} notif={n} />)}
          </div>
        )}
      </div>
    </div>
  )
}
