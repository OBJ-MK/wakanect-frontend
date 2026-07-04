import { UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_LABELS = { owner: 'propriétaire', employee: 'employé' }

/**
 * Affiche l'auteur d'une action (performed_by du backend : { name, phone, type }).
 * Rend null si l'info est absente — utilisable partout sans garde côté appelant.
 */
export function PerformedBy({ actor, prefix = 'par', className }) {
  if (!actor || (!actor.name && !actor.phone)) return null

  const who = actor.name || actor.phone
  const typeLabel = TYPE_LABELS[actor.type]

  return (
    <span className={cn('inline-flex items-center gap-1 text-micro text-white/40', className)}>
      <UserRound size={11} className="shrink-0" />
      {prefix} {who}{typeLabel ? ` (${typeLabel})` : ''}
    </span>
  )
}
