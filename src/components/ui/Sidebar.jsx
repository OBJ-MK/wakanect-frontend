import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAV_ITEMS } from '@/lib/appNav'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

// Visible uniquement à partir de lg: — BottomNav (mobile/tablette) est
// masquée à ce même point de rupture, jamais les deux en même temps.
export function Sidebar() {
  const { stats } = useDashboard('day')
  const { merchant, handleLogout } = useAuth()

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col border-r border-white/8 bg-navy-deep">
      <div className="flex items-center gap-2.5 px-5 h-[4.5rem] border-b border-white/8">
        <WakanectLogo variant="mark" className="h-7 w-7" />
        <span className="font-display font-bold text-body-lg text-white">Wakanect</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4" aria-label="Navigation principale">
        {APP_NAV_ITEMS.map((item) => {
          const badge = item.badgeKey ? stats?.[item.badgeKey] : null
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-body font-medium transition-colors',
                  isActive
                    ? 'bg-orange/12 text-orange'
                    : 'text-white/55 hover:text-white hover:bg-white/6',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span className="min-w-[19px] h-[19px] rounded-full bg-orange flex items-center justify-center px-1">
                      <span className="text-[10px] font-bold text-white leading-none">{badge}</span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/8 flex flex-col gap-1">
        <div className="px-3 py-2 flex flex-col">
          <span className="text-label font-semibold text-white truncate">
            {merchant?.businessName || 'Ma boutique'}
          </span>
          <span className="text-micro text-white/40 truncate">
            {merchant?.slug ? `/boutique/${merchant.slug}` : ''}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-body text-white/50 hover:text-white hover:bg-white/6 transition-colors"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}