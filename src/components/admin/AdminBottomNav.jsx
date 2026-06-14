import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Zap, Store, CreditCard,
  MoreHorizontal, Users, Activity, Shield, FileText, X,
} from 'lucide-react'

const MAIN_NAV = [
  { to: '/admin',             label: 'Aperçu',     icon: LayoutDashboard, end: true },
  { to: '/admin/parsing',     label: 'Parsing',    icon: Zap },
  { to: '/admin/boutiques',   label: 'Boutiques',  icon: Store },
  { to: '/admin/abonnements', label: 'Abonnements', icon: CreditCard },
]

const MORE_NAV = [
  { to: '/admin/parsing/journal', label: 'Journal parsing',  icon: FileText },
  { to: '/admin/employes',        label: 'Employés',         icon: Users },
  { to: '/admin/sante',           label: 'Santé système',    icon: Activity },
  { to: '/admin/audit',           label: 'Journal d\'audit', icon: Shield },
]

const linkClass = (isActive) =>
  `flex flex-col items-center gap-0.5 px-1 py-1.5 min-w-[52px] text-micro transition-colors ${
    isActive ? 'text-orange' : 'text-white/50'
  }`

export function AdminBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* Nav basse */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-navy border-t border-white/8 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]">
        {MAIN_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => linkClass(isActive)}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center gap-0.5 px-1 py-1.5 min-w-[52px] text-micro text-white/50 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>Plus</span>
        </button>
      </nav>

      {/* Drawer "Plus" */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-navy rounded-t-2xl shadow-glass motion-safe:animate-bottom-sheet pb-[env(safe-area-inset-bottom,1rem)]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8">
              <span className="text-h3 font-semibold text-white">Plus</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1.5 text-white/50 hover:text-white rounded-lg"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {MORE_NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-body transition-colors ${
                      isActive
                        ? 'bg-orange text-white font-medium'
                        : 'text-white/70 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
