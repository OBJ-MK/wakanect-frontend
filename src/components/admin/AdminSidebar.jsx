import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Zap, FileText, Store, Users,
  CreditCard, Settings2, Activity, Shield,
} from 'lucide-react'

const NAV = [
  { to: '/admin',                  label: 'Vue d\'ensemble',  icon: LayoutDashboard, end: true },
  { to: '/admin/parsing',          label: 'Parsing & Haiku',  icon: Zap },
  { to: '/admin/parsing/journal',  label: 'Journal parsing',  icon: FileText },
  { to: '/admin/boutiques',        label: 'Boutiques',        icon: Store },
  { to: '/admin/employes',         label: 'Employés',         icon: Users },
  { to: '/admin/abonnements',      label: 'Abonnements',      icon: CreditCard },
  { to: '/admin/plans',            label: 'Plans tarifaires', icon: Settings2 },
  { to: '/admin/sante',            label: 'Santé système',    icon: Activity },
  { to: '/admin/audit',            label: 'Journal d\'audit', icon: Shield },
]

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[240px] bg-navy shadow-sidebar z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="text-label text-white/50 uppercase tracking-widest mb-0.5">Wakanect</div>
        <div className="text-h3 font-display text-white font-bold">Admin</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-body transition-colors ${
                isActive
                  ? 'bg-orange text-white font-medium'
                  : 'text-white/70 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/8">
        <p className="text-micro text-white/40">Super-admin · v1.0</p>
      </div>
    </aside>
  )
}
