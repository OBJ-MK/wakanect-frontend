import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, X, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { adminApi } from '@/services/adminApi'
import { useAdminQuery } from '@/hooks/useAdminQuery'
import { AlertsPanel } from '@/components/admin/AlertsPanel'

const TITLES = {
  '/admin':                 'Vue d\'ensemble',
  '/admin/parsing':         'Parsing & Haiku',
  '/admin/parsing/journal': 'Journal de parsing',
  '/admin/boutiques':       'Boutiques',
  '/admin/employes':        'Employés',
  '/admin/abonnements':     'Abonnements',
  '/admin/sante':           'Santé système',
  '/admin/audit':           'Journal d\'audit',
}

export function AdminTopBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { merchant, logout } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const menuRef = useRef(null)
  const alertsRef = useRef(null)

  // Alertes réelles — mêmes données que l'Overview (getAlerts backend)
  const { data: overviewData } = useAdminQuery(() => adminApi.overview('7d'), [])
  const alerts = overviewData?.alerts ?? []
  const dangerCount = alerts.filter(a => a.level === 'danger' || a.level === 'error').length

  const title = Object.entries(TITLES)
    .filter(([path]) => pathname.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? 'Admin'

  const initials = merchant?.owner_name
    ? merchant.owner_name.slice(0, 2).toUpperCase()
    : merchant?.shop_name
    ? merchant.shop_name.slice(0, 2).toUpperCase()
    : 'SA'

  // Fermer le menu si clic hors
  useEffect(() => {
    if (!menuOpen) return
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  // Fermer le panneau alertes si clic hors
  useEffect(() => {
    if (!alertsOpen) return
    function onClickOutside(e) {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setAlertsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [alertsOpen])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-14 bg-navy/85 backdrop-blur-glass border-b border-white/8 flex items-center px-4 gap-3">
      {/* Titre de page */}
      {searchOpen ? (
        <input
          autoFocus
          type="search"
          placeholder="Rechercher une boutique, un slug…"
          className="flex-1 bg-white/10 text-white placeholder:text-white/40 rounded-lg px-3 py-1.5 text-body outline-none focus:ring-1 focus:ring-orange"
          onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
        />
      ) : (
        <h1 className="flex-1 text-h3 font-display text-white font-semibold truncate">{title}</h1>
      )}

      <div className="flex items-center gap-1 shrink-0">
        {/* Recherche */}
        <button
          onClick={() => setSearchOpen(v => !v)}
          className="p-2 text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
          aria-label="Rechercher"
        >
          {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>

        {/* Cloche alertes — badge = alertes danger réelles, masqué si 0 */}
        <div className="relative" ref={alertsRef}>
          <button
            onClick={() => setAlertsOpen(v => !v)}
            className="relative p-2 text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
            aria-label="Alertes"
            aria-expanded={alertsOpen}
          >
            <Bell className="w-4 h-4" />
            {dangerCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-danger rounded-full text-[10px] font-bold text-white flex items-center justify-center tabular-nums">
                {dangerCount}
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className="absolute right-0 top-10 w-80 max-w-[calc(100vw-2rem)] bg-white border border-admin-line rounded-xl shadow-modal overflow-hidden">
              <div className="px-4 py-3 border-b border-admin-line flex items-center justify-between">
                <p className="text-label font-semibold text-navy">Alertes</p>
                {alerts.length > 0 && (
                  <span className="text-micro text-admin-muted tabular-nums">{alerts.length}</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto p-3">
                <AlertsPanel alerts={alerts} />
              </div>
              <button
                onClick={() => { setAlertsOpen(false); navigate('/admin') }}
                className="w-full px-4 py-2.5 text-label font-medium text-orange hover:bg-admin-fill border-t border-admin-line transition-colors"
              >
                Tout voir
              </button>
            </div>
          )}
        </div>

        {/* Avatar + menu déconnexion */}
        <div className="relative ml-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-7 h-7 rounded-full bg-orange flex items-center justify-center text-micro font-bold text-white hover:bg-orange-hi transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
            aria-label="Menu compte"
            aria-expanded={menuOpen}
          >
            {initials}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 w-44 bg-navy border border-white/10 rounded-xl shadow-modal overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-label text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
