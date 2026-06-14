/**
 * AdminBadge — badges sémantiques pour l'admin console.
 * Distinct de StatusBadge (marchand) — ici : plan, statut boutique, niveau alerte,
 * tier de parsing, statut paiement.
 */
const VARIANTS = {
  // Plans
  pro:       'bg-orange/10 text-orange border-orange/20',
  business:  'bg-navy/10 text-navy border-navy/20',
  trial:     'bg-amber/20 text-amber-700 border-amber/30',
  free:      'bg-admin-fill text-admin-ink-2 border-admin-line',

  // Statuts boutique
  active:    'bg-wa-green/10 text-green-700 border-wa-green/20',
  suspended: 'bg-danger/10 text-danger border-danger/20',
  dormant:   'bg-admin-fill text-admin-muted border-admin-line',

  // Niveaux alerte
  error:   'bg-danger/10 text-danger border-danger/20',
  warning: 'bg-amber/20 text-amber-700 border-amber/30',
  info:    'bg-navy/8 text-navy border-navy/15',

  // Parsing tiers
  regex:      'bg-admin-fill text-admin-ink-2 border-admin-line',
  cloudflare: 'bg-amber/20 text-amber-700 border-amber/30',
  haiku:      'bg-orange/10 text-orange border-orange/20',
  failed:     'bg-danger/10 text-danger border-danger/20',

  // Paiement
  paid:    'bg-wa-green/10 text-green-700 border-wa-green/20',
  pending: 'bg-amber/20 text-amber-700 border-amber/30',
  overdue: 'bg-danger/10 text-danger border-danger/20',

  // Fallback
  default: 'bg-admin-fill text-admin-ink-2 border-admin-line',
}

const LABELS = {
  pro: 'Pro', business: 'Business', trial: 'Essai', free: 'Gratuit',
  active: 'Active', suspended: 'Suspendue', dormant: 'Inactive',
  error: 'Erreur', warning: 'Attention', info: 'Info',
  regex: 'Regex', cloudflare: 'Cloudflare', haiku: 'Haiku', failed: 'Échec',
  paid: 'Payé', pending: 'En attente', overdue: 'Impayé',
}

export function AdminBadge({ variant, label, className = '' }) {
  const cls = VARIANTS[variant] || VARIANTS.default
  const text = label ?? LABELS[variant] ?? variant

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-micro font-medium rounded-md border ${cls} ${className}`}>
      {text}
    </span>
  )
}
