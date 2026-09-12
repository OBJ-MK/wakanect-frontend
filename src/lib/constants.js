export const API_BASE = import.meta.env.VITE_API_URL
import { Banknote, Paperclip } from 'lucide-react';

// Composants SVG personnalisés pour les marques locales
const WaveIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09c-2.27.42-4.4-1.04-4.83-3.31l-.22-1.16c-.14-.76.36-1.49 1.12-1.63.76-.14 1.49.36 1.63 1.12l.14.74c.14.76.85 1.25 1.61 1.11.76-.14 1.25-.85 1.11-1.61-.12-.66-.66-1.15-1.33-1.2l-1.95-.15c-2.31-.18-4.04-2.2-3.86-4.51.18-2.31 2.2-4.04 4.51-3.86l.66.05c2.27-.42 4.4 1.04 4.83 3.31l.14.74c.14.76-.36 1.49-1.12 1.63-.76.14-1.49-.36-1.63-1.12l-.06-.32c-.14-.76-.85-1.25-1.61-1.11-.76.14-1.25.85-1.11 1.61.12.66.66 1.15 1.33 1.2l1.95.15c2.31.18 4.04 2.2 3.86 4.51-.17 2.16-2.02 3.83-4.18 3.83z"/>
  </svg>
);

const OrangeMoneyIcon = ({ className = "w-5 h-5" }) => (
  <span className={`inline-block rounded-full bg-[#FF6600] ${className}`} />
);

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
  { 
    id: 'cash', 
    label: 'Paiement à la livraison', 
    icon: Banknote, 
    requiresProof: false 
  },
  { id: 'wave', label: 'Wave', icon: '/images/waveicon.jpeg', isImage: true },
  { id: 'orange_money', label: 'Orange Money', icon: '/images/orangelogo.png', isImage: true },
  { 
    id: 'proof', 
    label: "J'ai déjà payé — envoyer une preuve", 
    icon: Paperclip, 
    requiresProof: true 
  },
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