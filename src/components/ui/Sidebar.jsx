import { NavLink } from 'react-router-dom'
import { LogOut, PanelLeftClose, PanelLeftOpen, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAV_ITEMS } from '@/lib/appNav'

// Sidebar desktop uniquement. La navigation mobile reste portée par BottomNav.
export function Sidebar({ collapsed = false, onToggle }) {
  const { stats } = useDashboard('day')
  const { merchant, handleLogout } = useAuth()

  return (
    <aside
      className={cn(
        'hidden lg:flex fixed inset-y-4 left-4 z-40 flex-col',
        'bg-navy/95 backdrop-blur-glass shadow-lift ring-1 ring-white/8 rounded-2xl overflow-visible',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[4.5rem]' : 'w-60',
      )}
      aria-label="Navigation de l’espace marchand"
    >
      <div className={cn(
        'relative flex items-center h-[4.5rem] shrink-0',
        collapsed ? 'justify-center px-2' : 'gap-3 px-4',
      )}>
        <img
          src="/icon-192.png"
          alt="Wakanect"
          className="h-9 w-9 rounded-[10px] shrink-0"
        />

        {!collapsed && (
          <span className="font-display font-bold text-body-lg text-white truncate">
            Wakanect
          </span>
        )}

        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex items-center justify-center rounded-lg text-white/40',
            'hover:text-white hover:bg-white/8 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/60',
            collapsed
              ? 'absolute -right-3 top-[1.4rem] h-6 w-6 bg-navy border border-white/10 shadow-card'
              : 'ml-auto h-8 w-8',
          )}
          aria-label={collapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
          title={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={17} />}
        </button>
      </div>

      <nav
        className={cn(
          'flex-1 flex flex-col gap-1 py-5 overflow-y-auto overflow-x-hidden',
          collapsed ? 'px-2' : 'px-3',
        )}
        aria-label="Navigation principale"
      >
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
            Principal
          </p>
        )}

        {APP_NAV_ITEMS.map((item) => {
          const badge = item.badgeKey ? stats?.[item.badgeKey] : null
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center rounded-xl text-body font-medium transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/60',
                  collapsed
                    ? 'justify-center h-11 w-11 mx-auto'
                    : 'gap-3 px-3 py-2.5 min-h-11',
                  isActive
                    ? 'bg-orange/12 text-orange'
                    : 'text-white/55 hover:text-white hover:bg-white/6',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {badge > 0 && (
                    <span className={cn(
                      'min-w-[19px] h-[19px] rounded-full bg-orange flex items-center justify-center px-1',
                      collapsed ? 'absolute -right-0.5 -top-0.5' : 'shrink-0',
                    )}>
                      <span className="text-[10px] font-bold text-white leading-none">{badge}</span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}

        <div className={cn('mt-4 pt-4', collapsed ? 'mx-1' : 'mx-1')}>
          <NavLink
            to={merchant?.slug ? `/boutique/${merchant.slug}` : '/app'}
            title={collapsed ? 'Ma boutique' : undefined}
            className={({ isActive }) => cn(
              'flex items-center rounded-xl text-body font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/60',
              collapsed ? 'justify-center h-11 w-11 mx-auto' : 'gap-3 px-3 py-2.5 min-h-11',
              isActive
                ? 'bg-orange/12 text-orange'
                : 'text-white/55 hover:text-white hover:bg-white/6',
            )}
          >
            <Store size={19} strokeWidth={1.8} />
            {!collapsed && <span className="truncate">Ma boutique</span>}
          </NavLink>
        </div>
      </nav>

      <div className={cn('shrink-0 mt-2', collapsed ? 'p-2' : 'p-3')}>
        {!collapsed && (
          <div className="px-3 py-2.5 mb-1">
            <span className="block text-label font-semibold text-white truncate">
              {merchant?.businessName || 'Ma boutique'}
            </span>
            <span className="block text-micro text-white/40 truncate mt-0.5">
              {merchant?.slug ? `/boutique/${merchant.slug}` : ''}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Déconnexion' : undefined}
          className={cn(
            'flex items-center rounded-xl text-body text-white/50',
            'hover:text-white hover:bg-white/6 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/60',
            collapsed ? 'justify-center h-11 w-11 mx-auto' : 'gap-3 px-3 py-2.5 w-full',
          )}
        >
          <LogOut size={17} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  )
}
