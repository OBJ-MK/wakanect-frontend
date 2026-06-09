import { Badge } from './Badge'

const STATUS_STYLES = {
  Nouvelle: 'amber',
  Confirmée: 'orange',
  Livrée: 'emerald',
  Payée: 'emerald',
  'En attente de paiement': 'red',
}

export function StatusBadge({ status }) {
  const variant = STATUS_STYLES[status] || 'default'
  return <Badge variant={variant}>{status}</Badge>
}
