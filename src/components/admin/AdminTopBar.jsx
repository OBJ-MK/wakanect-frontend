import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, X, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

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
  const menuRef = useRef(null)

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

        {/* Cloche alertes */}
        <button
          className="relative p-2 text-white/60 hover:text-white hover:bg-white/8 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
          aria-label="Alertes"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full" />
        </button>

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
