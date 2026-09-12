export const API_BASE = import.meta.env.VITE_API_URL

export const PUBLIC_BASE =
  import.meta.env.VITE_PUBLIC_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')

export const ORDER_STATUSES = {
  NEW: 'Nouvelle',
  CONFIRMED: 'Confirmée',
  DELIVERED: 'Livrée',
}

export const PAYMENT_STATUSES = {
  PAID: 'Payée',
  PENDING: 'En attente de paiement',
}

export const DELIVERY_MODES = {
  DELIVERY: 'Livraison',
  PICKUP: 'Retrait',
}

// requiresProof : le client paie hors-app (Wave/OM, avant ou après la commande)
// donc on lui demande une capture d'écran, obligatoire, pour que le marchand
// puisse vérifier le paiement avant de confirmer.
export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Paiement à la livraison', icon: '💵', requiresProof: false },
  { id: 'wave', label: 'Wave', icon: '🌊', requiresProof: true },
  { id: 'orange_money', label: 'Orange Money', icon: '🟠', requiresProof: true },
  { id: 'proof', label: "J'ai déjà payé — envoyer une preuve", icon: '📎', requiresProof: true },
]

export const CATEGORIES = [
  'Tout',
  'Vêtements',
  'Chaussures',
  'Accessoires',
  'Électronique',
  'Alimentation',
  'Beauté',
  'Maison',
  'Autre',
]