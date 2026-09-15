import { Home, ShoppingBag, LayoutGrid, User } from 'lucide-react'

// Source unique pour BottomNav (mobile) et Sidebar (desktop) — évite que les
// deux dérivent l'une de l'autre au fil des changements.
export const APP_NAV_ITEMS = [
  { to: '/app', label: 'Accueil', icon: Home, exact: true },
  { to: '/app/commandes', label: 'Commandes', icon: ShoppingBag, badgeKey: 'pending_orders_count' },
  { to: '/app/catalogue', label: 'Catalogue', icon: LayoutGrid },
  { to: '/app/profil', label: 'Profil', icon: User },
]