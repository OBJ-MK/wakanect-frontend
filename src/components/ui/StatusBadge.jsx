import { Badge } from './Badge'
import { Sparkles, CheckCircle2, PackageCheck, XCircle } from 'lucide-react'

// Une icône + couleur par statut de commande (le paiement est géré à part, voir PaymentBadge).
const STATUS_CONFIG = {
  Nouvelle:  { variant: 'amber',   icon: Sparkles },
  Confirmée: { variant: 'orange',  icon: CheckCircle2 },
  Livrée:    { variant: 'emerald', icon: PackageCheck },
  Annulée:   { variant: 'red',     icon: XCircle },
}

export function StatusBadge({ status }) {
  const { variant = 'default', icon: Icon } = STATUS_CONFIG[status] ?? {}
  return (
    <Badge variant={variant}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {status}
    </Badge>
  )
}
