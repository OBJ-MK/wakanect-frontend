export const API_BASE = import.meta.env.VITE_API_URL
import { Banknote, Paperclip } from 'lucide-react';

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
  { id: 'wave', label: 'Wave', icon: '/images/waveicon.jpeg', isImage: true, requiresProof: true },
  { id: 'orange_money', label: 'Orange Money', icon: '/images/orangelogo.png', isImage: true, requiresProof: true },
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

// Indicatifs pays pour le sélecteur téléphone (inscription, réglages…).
// Miroir exact de backend/src/constants/countries.js (source de vérité des pays
// supportés par Wakanect) — mêmes pays, même ordre, on ajoute juste le drapeau
// et le "+" pour l'affichage. Si un pays est ajouté/retiré côté backend,
// reporter le changement ici.
export const COUNTRY_CODES = [
  // AFRIQUE DE L'OUEST
  { dial: '+229', flag: '🇧🇯', name: 'Bénin' },
  { dial: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { dial: '+238', flag: '🇨🇻', name: 'Cap-Vert' },
  { dial: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { dial: '+220', flag: '🇬🇲', name: 'Gambie' },
  { dial: '+233', flag: '🇬🇭', name: 'Ghana' },
  { dial: '+224', flag: '🇬🇳', name: 'Guinée' },
  { dial: '+245', flag: '🇬🇼', name: 'Guinée-Bissau' },
  { dial: '+231', flag: '🇱🇷', name: 'Libéria' },
  { dial: '+223', flag: '🇲🇱', name: 'Mali' },
  { dial: '+222', flag: '🇲🇷', name: 'Mauritanie' },
  { dial: '+227', flag: '🇳🇪', name: 'Niger' },
  { dial: '+234', flag: '🇳🇬', name: 'Nigéria' },
  { dial: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { dial: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
  { dial: '+228', flag: '🇹🇬', name: 'Togo' },
  // AFRIQUE CENTRALE
  { dial: '+244', flag: '🇦🇴', name: 'Angola' },
  { dial: '+257', flag: '🇧🇮', name: 'Burundi' },
  { dial: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { dial: '+236', flag: '🇨🇫', name: 'Centrafrique' },
  { dial: '+242', flag: '🇨🇬', name: 'Congo-Brazzaville' },
  { dial: '+243', flag: '🇨🇩', name: 'Congo-Kinshasa (RDC)' },
  { dial: '+241', flag: '🇬🇦', name: 'Gabon' },
  { dial: '+240', flag: '🇬🇶', name: 'Guinée équatoriale' },
  { dial: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { dial: '+239', flag: '🇸🇹', name: 'Sao Tomé-et-Principe' },
  { dial: '+235', flag: '🇹🇩', name: 'Tchad' },
]