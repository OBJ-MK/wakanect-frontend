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

export const PAYMENT_METHODS = [
  { id: 'wave', label: 'Wave', icon: '🌊' },
  { id: 'orange_money', label: 'Orange Money', icon: '🟠' },
  { id: 'proof', label: "J'ai déjà payé — envoyer une preuve", icon: '📎' },
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
