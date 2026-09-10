import { Badge } from './Badge'
import { Sparkles } from 'lucide-react'

const STATUS_STYLES = {
  Nouvelle: 'amber',
  Confirmée: 'orange',
  Livrée: 'emerald',
  Payée: 'emerald',
  'En attente de paiement': 'red',
}

export function StatusBadge({ status }) {
  const variant = STATUS_STYLES[status] || 'default'
  return <Badge variant={variant}>{status.Nouvelle ?? <Sparkles className="w-3.5 h-3.5" />}</Badge>
}
