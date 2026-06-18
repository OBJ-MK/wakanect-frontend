import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, MessageCircle, Copy } from 'lucide-react'
import { cn, buildWhatsAppLink } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { employeeService } from '@/services/employeeService'

const ALL_PERMS_KEYS = [
  'dashboard.view', 'products.send', 'products.publish', 'products.edit',
  'stock.edit', 'orders.confirm', 'orders.cancel', 'orders.markPaid',
]

const PERMISSION_GROUPS = [
  {
    group: 'Tableau de bord',
    items: [{ key: 'dashboard.view', label: 'Voir le tableau de bord', hint: '(par défaut)' }],
  },
  {
    group: 'Produits',
    items: [
      { key: 'products.send',    label: 'Envoyer des produits' },
      { key: 'products.publish', label: 'Publier des produits' },
      { key: 'products.edit',    label: 'Modifier des produits' },
    ],
  },
  {
    group: 'Stock',
    items: [{ key: 'stock.edit', label: 'Modifier le stock' }],
  },
  {
    group: 'Commandes',
    items: [
      { key: 'orders.confirm',  label: 'Confirmer une commande' },
      { key: 'orders.cancel',   label: 'Annuler une commande' },
      { key: 'orders.markPaid', label: 'Marquer une commande payée' },
    ],
  },
]

const PRESETS = [
  { id: 'vendor',    label: 'Vendeur',           keys: ['dashboard.view', 'products.send', 'orders.confirm'] },
  { id: 'catalogue', label: 'Gestion. catalogue', keys: ['dashboard.view', 'products.send', 'products.publish', 'products.edit'] },
  { id: 'orders',    label: 'Gestion. commandes', keys: ['dashboard.view', 'orders.confirm', 'orders.cancel', 'orders.markPaid'] },
  { id: 'full',      label: 'Accès complet',      keys: ALL_PERMS_KEYS },
  { id: 'custom',    label: 'Personnalisé',        keys: null },
]

function toPermSet(keys) {
  const s = new Set(keys)
  s.add('dashboard.view')
  return s
}

function detectPreset(perms) {
  for (const p of PRESETS) {
    if (!p.keys) continue
    if (p.keys.length === perms.size && p.keys.every(k => perms.has(k))) return p.id
  }
  return 'custom'
}

function FieldGroup({ label, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-micro text-white/50 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-micro text-white/30">{hint}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="bg-white/6 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/25 text-body focus:outline-none focus:border-white/30 transition-colors"
    />
  )
}

export function AjouterEmployePage() {
  const { merchant } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [perms, setPerms] = useState(toPermSet(['dashboard.view', 'products.send', 'orders.confirm']))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const activePreset = detectPreset(perms)
  const presetLabel = PRESETS.find(p => p.id === activePreset)?.label ?? 'Personnalisé'

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  function applyPreset(p) {
    if (p.keys) setPerms(toPermSet(p.keys))
  }

  function togglePerm(key) {
    if (key === 'dashboard.view') return
    setPerms(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await employeeService.create({
        name:        form.name,
        phone:       form.phone,
        password:    form.password,
        permissions: [...perms],
      })
      setStep('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyCredentials() {
    const text = `Boutique : ${merchant?.shop_name ?? ''}\nNuméro : ${form.phone}\nMot de passe : ${form.password}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const waLink = buildWhatsAppLink(
    form.phone,
    `Voici tes identifiants Wakanect 👋\nBoutique : ${merchant?.shop_name ?? ''}\nNuméro : ${form.phone}\nMot de passe : ${form.password}\nConnecte-toi en mode « Employé ».`
  )

  // ── Écran B3 : compte créé ──────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-navy-deep">
        <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <Link to="/app/equipe" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="font-display font-bold text-h3 text-white flex-1">Compte créé</h1>
          </div>
        </div>

        <div className="page-container py-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-400 flex items-center justify-center">
            <Check size={32} className="text-emerald-400" />
          </div>

          <div className="text-center">
            <h2 className="font-display font-bold text-h2 text-white">Compte créé !</h2>
            <p className="text-label text-white/55 mt-1">
              Transmets ces infos à {form.name} pour qu'il se connecte.
            </p>
          </div>

          <div className="glass rounded-3xl p-4 w-full flex flex-col divide-y divide-white/6">
            {[
              { label: 'Nom de la boutique', value: merchant?.shop_name ?? '—' },
              { label: 'Numéro',             value: form.phone },
              { label: 'Mot de passe',        value: form.password },
              { label: 'Accès',               value: `${presetLabel} · ${perms.size}/${ALL_PERMS_KEYS.length}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3">
                <span className="text-label text-white/50">{label}</span>
                <span className="text-body font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-wa-green text-white font-semibold text-body hover:opacity-90 active:scale-95 transition-all"
            >
              <MessageCircle size={18} />
              Envoyer sur WhatsApp
            </a>
            <button
              onClick={copyCredentials}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl glass border border-white/15 text-white/70 font-semibold text-body hover:text-white transition-colors"
            >
              <Copy size={18} />
              {copied ? 'Copié !' : 'Copier les identifiants'}
            </button>
          </div>

          <Link to="/app/equipe" className="text-label text-white/35 hover:text-white/55 transition-colors">
            Retour à l'équipe
          </Link>
        </div>
      </div>
    )
  }

  // ── Écran B2 : formulaire ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/app/equipe" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Ajouter un employé</h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="page-container py-5 flex flex-col gap-5">
        {/* Informations */}
        <div className="glass rounded-3xl p-4 flex flex-col gap-4">
          <FieldGroup label="Nom">
            <TextInput required value={form.name} onChange={set('name')} placeholder="Ex : Moussa Sow" />
          </FieldGroup>
          <FieldGroup label="Numéro de téléphone" hint="Identifiant de connexion + envoi de produits.">
            <TextInput required type="tel" value={form.phone} onChange={set('phone')} placeholder="+221 …" />
          </FieldGroup>
          <FieldGroup label="Mot de passe">
            <TextInput required value={form.password} onChange={set('password')} placeholder="Définis un mot de passe" />
          </FieldGroup>
        </div>

        {/* Prérèglage */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-3 px-1">Prérèglage</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-sm font-semibold border transition-colors',
                  activePreset === p.id
                    ? 'bg-white text-navy-deep border-white'
                    : 'bg-white/6 text-white/60 border-white/15 hover:text-white hover:border-white/30'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
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
                    disabled={item.key === 'dashboard.view'}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/6 last:border-0 text-left transition-colors',
                      item.key !== 'dashboard.view' && 'hover:bg-white/4 active:bg-white/8'
                    )}
                  >
                    <span className="flex-1 text-body text-white">
                      {item.label}
                      {item.hint && <span className="text-white/30 ml-1.5 text-label">{item.hint}</span>}
                    </span>
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

        {error && (
          <p className="text-sm text-red-400 text-center px-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !form.name || !form.phone || !form.password}
          className="py-4 rounded-2xl bg-white text-navy-deep font-bold text-body hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all"
        >
          {loading ? 'Création…' : 'Créer le compte'}
        </button>
      </form>
    </div>
  )
}
