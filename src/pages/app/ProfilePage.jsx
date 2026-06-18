import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Store, Moon, Sun, Bell,
  LogOut, ChevronRight, Share2, HelpCircle,
  Package, CreditCard, Users, Smartphone
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'
import { PUBLIC_BASE } from '@/lib/constants'

function useDarkMode() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('waka_theme', next ? 'dark' : 'light')
  }

  return [dark, toggle]
}

function SettingRow({ icon: Icon, label, description, action, danger = false, to }) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 last:border-0">
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-white/8'}`}>
        <Icon size={17} className={danger ? 'text-red-400' : 'text-white/60'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-body font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</p>
        {description && <p className="text-micro text-white/40">{description}</p>}
      </div>
      {action}
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block hover:bg-white/4 transition-colors">
        {inner}
      </Link>
    )
  }

  return inner
}

export function ProfilePage() {
  const { handleLogout } = useAuth()
  const { merchant } = useAuthStore()
  const [dark, toggleDark] = useDarkMode()

  const boutiqueUrl = merchant?.slug
    ? `${PUBLIC_BASE}/boutique/${merchant.slug}`.replace(/^https?:\/\//, '')
    : null

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header / profile card */}
      <div className="glass border-b border-white/6 px-4 pt-safe pt-4 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-h2 text-white mb-5">Profil</h1>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange to-amber flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-h2 text-white">
                {getInitials(merchant?.owner_name ?? 'W')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-h3 text-white">
                {merchant?.shop_name ?? 'Ma boutique'}
              </p>
              <p className="text-label text-white/55 mt-0.5">
                {merchant?.owner_name ?? ''}
              </p>
              {boutiqueUrl && (
                <p className="text-micro text-orange truncate mt-1">{boutiqueUrl}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-4">
        {/* Boutique */}
        <div className="glass rounded-3xl overflow-hidden">
          <p className="text-micro text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">Boutique</p>
          <SettingRow
            icon={Store}
            label="Informations boutique"
            description="Logo, nom, lien, numéro, adresse"
            to="/app/profil/boutique"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
          <SettingRow
            icon={Share2}
            label="Partager ma boutique"
            description="QR code + lien"
            to="/app/profil/partager"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
          <SettingRow
            icon={Package}
            label="Comment ajouter un produit"
            description="Numéro Wakanect + 3 étapes"
            to="/app/profil/comment-ajouter"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
          <SettingRow
            icon={Users}
            label="Mon équipe"
            description="Employés · accès & permissions"
            to="/app/equipe"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
        </div>

        {/* Abonnement */}
        <div className="glass rounded-3xl overflow-hidden">
          <p className="text-micro text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">Abonnement</p>
          <SettingRow
            icon={CreditCard}
            label="Mon abonnement"
            description="Plan actuel · Facturation"
            to="/app/profil/abonnement"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
        </div>

        {/* Preferences */}
        <div className="glass rounded-3xl overflow-hidden">
          <p className="text-micro text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">Préférences</p>
          <SettingRow
            icon={dark ? Moon : Sun}
            label="Mode nuit"
            description={dark ? 'Activé' : 'Désactivé'}
            action={
              <button
                onClick={toggleDark}
                className={`relative w-11 h-6 rounded-full transition-colors ${dark ? 'bg-orange' : 'bg-white/20'}`}
                role="switch"
                aria-checked={dark}
                aria-label="Mode nuit"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${dark ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            }
          />
          <SettingRow
            icon={Smartphone}
            label="Installer l'app"
            description="Ajouter à l'écran d'accueil"
            to="/app/profil/installer"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
          <SettingRow
            icon={Bell}
            label="Activer les notifications"
            description="Commandes, alertes stock"
            to="/app/notifications/activer"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
        </div>

        {/* Help */}
        <div className="glass rounded-3xl overflow-hidden">
          <SettingRow
            icon={HelpCircle}
            label="Aide & support"
            description="FAQ · Nous écrire"
            to="/app/profil/aide"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
        </div>

        {/* Logout */}
        <div className="glass rounded-3xl overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-500/8 active:bg-red-500/15 transition-colors"
          >
            <div className="w-9 h-9 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
              <LogOut size={17} className="text-red-400" />
            </div>
            <p className="text-body font-medium text-red-400">Se déconnecter</p>
          </button>
        </div>

        <p className="text-micro text-white/20 text-center">
          Wakanect v0.1.0 — Fait avec ❤️ pour les commerçants africains
        </p>
      </div>
    </div>
  )
}
