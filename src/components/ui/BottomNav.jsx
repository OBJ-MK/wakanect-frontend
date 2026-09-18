import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAppSummary } from '@/hooks/useAppSummary'
import { useAuthStore } from '@/store/authStore'
import { can } from '@/lib/permissions'
import { APP_NAV_ITEMS } from '@/lib/appNav'

export function BottomNav() {
  const { summary } = useAppSummary()
  const merchant = useAuthStore((s) => s.merchant)
  const navItems = APP_NAV_ITEMS.filter((item) => !item.perm || can(merchant, item.perm))

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass bottom-nav-bg border-t border-white/8 safe-bottom lg:hidden"
      aria-label="Navigation principale"
    >
      <div className="flex items-end px-1 pt-2 pb-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const badge = item.badgeKey ? summary?.[item.badgeKey] : null
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-1 flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-colors min-w-[44px] min-h-[44px] justify-center',
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