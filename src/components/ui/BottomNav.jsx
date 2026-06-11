import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, LayoutGrid, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/app', label: 'Accueil', icon: Home, exact: true },
  { to: '/app/commandes', label: 'Commandes', icon: ShoppingBag },
  { to: '/app/catalogue', label: 'Catalogue', icon: LayoutGrid },
  { to: '/app/profil', label: 'Profil', icon: User },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t border-white/8 safe-bottom"
      aria-label="Navigation principale"
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => (
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
        ))}
      </div>
    </nav>
  )
}
