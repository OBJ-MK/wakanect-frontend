import { useState, useEffect } from 'react'
import {
  Store, Moon, Sun, Bell, MessageSquare,
  LogOut, ChevronRight, ExternalLink, Copy
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

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

function SettingRow({ icon: Icon, label, description, action, danger = false }) {
  return (
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
}

export function ProfilePage() {
  const { handleLogout } = useAuth()
  const { merchant } = useAuthStore()
  const [dark, toggleDark] = useDarkMode()
  const [copied, setCopied] = useState(false)

  const boutiqueUrl = merchant?.slug ? `wakanect.com/boutique/${merchant.slug}` : null

  function copyLink() {
    if (boutiqueUrl) {
      navigator.clipboard.writeText(`https://${boutiqueUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      {/* Header */}
      <div className="glass border-b border-white/6 px-4 pt-safe pt-4 pb-6">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display font-bold text-h2 text-white mb-5">Profil</h1>

          {/* Avatar */}
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
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="text-micro text-orange truncate">{boutiqueUrl}</p>
                  <button
                    onClick={copyLink}
                    className="shrink-0 text-white/40 hover:text-white transition-colors"
                    aria-label="Copier le lien"
                  >
                    <Copy size={13} />
                  </button>
                  {copied && <span className="text-micro text-emerald">Copié !</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-4">
        {/* Boutique settings */}
        <div className="glass rounded-3xl overflow-hidden">
          <p className="text-micro text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">
            Boutique
          </p>
          <SettingRow
            icon={Store}
            label="Informations boutique"
            description="Nom, slug, WhatsApp"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
          {boutiqueUrl && (
            <SettingRow
              icon={ExternalLink}
              label="Voir ma boutique"
              description={boutiqueUrl}
              action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
            />
          )}
        </div>

        {/* Appearance & notifications */}
        <div className="glass rounded-3xl overflow-hidden">
          <p className="text-micro text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">
            Préférences
          </p>
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
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${dark ? 'left-5.5' : 'left-0.5'}`}
                />
              </button>
            }
          />
          <SettingRow
            icon={Bell}
            label="Notifications"
            description="Nouvelles commandes, alertes stock"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
          <SettingRow
            icon={MessageSquare}
            label="Réponse auto WhatsApp"
            description="Message de bienvenue automatique"
            action={<ChevronRight size={16} className="text-white/30 shrink-0" />}
          />
        </div>

        {/* Danger zone */}
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
