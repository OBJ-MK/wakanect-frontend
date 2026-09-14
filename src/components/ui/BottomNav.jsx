import { NavLink } from 'react-router-dom'
import { Home, ShoppingBag, LayoutGrid, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/hooks/useDashboard'

const NAV_ITEMS = [
  { to: '/app', label: 'Accueil', icon: Home, exact: true },
  { to: '/app/commandes', label: 'Commandes', icon: ShoppingBag, badgeKey: 'pending_orders_count' },
  { to: '/app/catalogue', label: 'Catalogue', icon: LayoutGrid },
  { to: '/app/profil', label: 'Profil', icon: User },
]

export function BottomNav() {
  // pending_orders_count est un compteur absolu (pas scopé sur une période),
  // donc n'importe quel argument de période convient ici.
  const { stats } = useDashboard('day')

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass bottom-nav-bg border-t border-white/8 safe-bottom"
      aria-label="Navigation principale"
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const badge = item.badgeKey ? stats?.[item.badgeKey] : null
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-[48px]',
                  isActive
                    ? 'text-orange'
                    : 'text-white/45 hover:text-white/70',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                    {badge > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] rounded-full bg-orange flex items-center justify-center px-0.5">
                        <span className="text-[8px] font-bold text-white leading-none">{badge}</span>
                      </span>
                    )}
                  </div>
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