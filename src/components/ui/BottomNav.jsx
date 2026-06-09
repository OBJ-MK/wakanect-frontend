import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, Package, User, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { to: '/app', label: 'Accueil', icon: Home, exact: true },
  { to: '/app/commandes', label: 'Commandes', icon: ShoppingBag },
  { to: null, label: 'WhatsApp', icon: MessageCircle, fab: true },
  { to: '/app/stock', label: 'Stock', icon: Package },
  { to: '/app/profil', label: 'Profil', icon: User },
]

export function BottomNav() {
  const { merchant } = useAuthStore()

  const waPhone = merchant?.whatsapp_number || ''
  const waLink = waPhone
    ? `https://wa.me/${waPhone.replace(/\D/g, '')}`
    : 'https://wa.me'

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t border-white/8 safe-bottom"
      aria-label="Navigation principale"
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          if (item.fab) {
            return (
              <a
                key="whatsapp"
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex flex-col items-center gap-0.5 -mt-5',
                  'w-14 h-14 rounded-full bg-wa-green shadow-lg',
                  'flex items-center justify-center',
                  'active:scale-95 transition-transform',
                )}
                aria-label="Ouvrir WhatsApp"
              >
                <item.icon size={24} className="text-white" />
              </a>
            )
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-[48px]',
                  isActive
                    ? 'text-orange'
                    : 'text-white/45 hover:text-white/70',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-micro">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
