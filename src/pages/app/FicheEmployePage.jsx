import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, RotateCcw } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const ALL_PERMS_KEYS = [
  'view_dashboard', 'send_products', 'publish_products', 'edit_products',
  'edit_stock', 'confirm_order', 'cancel_order', 'mark_paid',
]

const PERMISSION_GROUPS = [
  {
    group: 'Tableau de bord',
    items: [{ key: 'view_dashboard', label: 'Voir le tableau de bord' }],
  },
  {
    group: 'Produits',
    items: [
      { key: 'send_products', label: 'Envoyer des produits' },
      { key: 'publish_products', label: 'Publier des produits' },
      { key: 'edit_products', label: 'Modifier des produits' },
    ],
  },
  {
    group: 'Stock',
    items: [{ key: 'edit_stock', label: 'Modifier le stock' }],
  },
  {
    group: 'Commandes',
    items: [
      { key: 'confirm_order', label: 'Confirmer une commande' },
      { key: 'cancel_order', label: 'Annuler une commande' },
      { key: 'mark_paid', label: 'Marquer une commande payée' },
    ],
  },
]

// Mock — à remplacer par API
const MOCK_EMPLOYEES = {
  '1': {
    id: '1', name: 'Moussa Sow', phone: '+221 77 555 11 22', active: true,
    permissions: ['view_dashboard', 'send_products', 'publish_products', 'edit_stock', 'confirm_order'],
  },
  '2': {
    id: '2', name: 'Fatou Ba', phone: '+221 77 444 99 00', active: false,
    permissions: ['view_dashboard', 'send_products', 'confirm_order'],
  },
}

export function FicheEmployePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const raw = MOCK_EMPLOYEES[id]

  const [active, setActive] = useState(raw?.active ?? true)
  const [perms, setPerms] = useState(() => new Set(raw?.permissions ?? ['view_dashboard']))
  const [showRemove, setShowRemove] = useState(false)

  if (!raw) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <p className="text-white/40 text-body">Employé introuvable</p>
      </div>
    )
  }

  function togglePerm(key) {
    if (key === 'view_dashboard') return
    setPerms(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function handleRemove() {
    // TODO: appel API
    navigate('/app/equipe')
  }

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/app/equipe" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">{raw.name}</h1>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-4">
        {/* En-tête employé */}
        <div className="glass rounded-3xl p-4 flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold',
            active ? 'bg-white/12 text-white' : 'bg-white/5 text-white/30'
          )}>
            {getInitials(raw.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body font-semibold text-white">{raw.name}</p>
            <p className="text-micro text-white/40">{raw.phone}</p>
          </div>
          <span className="flex items-center gap-1.5">
            <span className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-emerald-400' : 'bg-white/20')} />
            <span className={cn('text-micro font-semibold', active ? 'text-emerald-400' : 'text-white/30')}>
              {active ? 'Actif' : 'Désactivé'}
            </span>
          </span>
        </div>

        {/* Toggle compte actif */}
        <div className="glass rounded-3xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-body font-semibold text-white">Compte actif</p>
            <p className="text-micro text-white/40 mt-0.5 leading-snug">
              Désactiver bloque la connexion et l'envoi de produits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActive(a => !a)}
            role="switch"
            aria-checked={active}
            className={cn('relative w-12 h-6 rounded-full transition-colors shrink-0', active ? 'bg-emerald-500' : 'bg-white/15')}
          >
            <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', active ? 'left-6' : 'left-0.5')} />
          </button>
        </div>

        {/* Permissions */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-micro text-white/40 uppercase tracking-wider">Permissions</p>
            <span className="text-micro font-bold text-white/60 bg-white/8 rounded-full px-2.5 py-1">
              {perms.size}/{ALL_PERMS_KEYS.length} accès
            </span>
          </div>
          <div className="glass rounded-3xl overflow-hidden">
            {PERMISSION_GROUPS.map((group, gi) => (
              <div key={gi}>
                <p className="text-micro text-white/30 uppercase tracking-wider px-4 pt-4 pb-1">{group.group}</p>
                {group.items.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => togglePerm(item.key)}
                    disabled={item.key === 'view_dashboard'}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/6 last:border-0 text-left transition-colors',
                      item.key !== 'view_dashboard' && 'hover:bg-white/4 active:bg-white/8'
                    )}
                  >
                    <span className="flex-1 text-body text-white">{item.label}</span>
                    <div className={cn(
                      'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors',
                      perms.has(item.key) ? 'bg-white border-white' : 'border-white/20 bg-transparent'
                    )}>
                      {perms.has(item.key) && <Check size={14} className="text-navy-deep" />}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <button className="flex items-center justify-center gap-2 py-4 rounded-2xl glass border border-white/15 text-white/70 font-semibold text-body hover:text-white transition-colors">
          <RotateCcw size={16} />
          Réinitialiser le mot de passe
        </button>

        <button
          onClick={() => setShowRemove(true)}
          className="py-2 text-red-400 font-semibold text-body hover:text-red-300 transition-colors text-center"
        >
          Retirer de l'équipe
        </button>
      </div>

      {/* Modale B5 : confirmation retrait */}
      {showRemove && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowRemove(false)}
        >
          <div
            className="w-full max-w-lg glass rounded-3xl p-6 animate-fade-up"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-display font-bold text-h3 text-white mb-2">
              Retirer {raw.name} ?
            </h2>
            <p className="text-label text-white/55 leading-relaxed">
              Il perdra immédiatement tout accès. Les produits et commandes qu'il a traités
              restent enregistrés à son nom.
            </p>
            <div className="flex flex-col gap-3 mt-5">
              <button
                onClick={handleRemove}
                className="py-4 rounded-2xl bg-red-500 text-white font-bold text-body hover:bg-red-400 active:scale-95 transition-all"
              >
                Retirer
              </button>
              <button
                onClick={() => setShowRemove(false)}
                className="py-4 rounded-2xl glass border border-white/15 text-white/70 font-semibold text-body hover:text-white transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
