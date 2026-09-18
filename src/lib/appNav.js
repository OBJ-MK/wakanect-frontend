import { Home, ShoppingBag, LayoutGrid, BarChart2, User } from 'lucide-react'
import { PERM } from '@/lib/permissions'

// Source unique pour BottomNav (mobile) et Sidebar (desktop) — évite que les
// deux dérivent l'une de l'autre au fil des changements.
// `perm` est optionnel : sans lui, l'item reste visible pour tout le monde.
export const APP_NAV_ITEMS = [
  { to: '/app', label: 'Accueil', icon: Home, exact: true },
  { to: '/app/commandes', label: 'Commandes', icon: ShoppingBag, badgeKey: 'pending_orders_count' },
  { to: '/app/catalogue', label: 'Catalogue', icon: LayoutGrid },
  { to: '/app/stats', label: 'Stats', icon: BarChart2, perm: PERM.DASHBOARD_VIEW },
  { to: '/app/profil', label: 'Profil', icon: User },
]
