import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronDown, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const WAKANECT_SUPPORT = '+221770000000'

const FAQ = [
  {
    q: 'Comment ajouter un produit à mon catalogue ?',
    a: "Transférez simplement votre message WhatsApp décrivant le produit (nom, prix, quantité) au numéro Wakanect. L'IA le détectera et vous proposera de le valider.",
  },
  {
    q: 'Comment mes clients passent-ils commande ?',
    a: "Partagez le lien de votre boutique (depuis l'écran « Partager ma boutique »). Les clients y accèdent, choisissent leurs articles, et confirment la commande en ligne.",
  },
  {
    q: 'Comment fonctionne le paiement des commandes ?',
    a: 'Le client vous paie directement sur Wave. Une fois reçu, vous marquez la commande comme « Payée » dans l\'app.',
  },
  {
    q: 'Qu\'est-ce que le numéro Wakanect ?',
    a: "C'est un numéro WhatsApp Wakanect dédié. Vous y transférez vos messages produits et l'IA extrait automatiquement les informations.",
  },
  {
    q: 'Qu\'est-ce que l\'essai gratuit ?',
    a: 'Vous bénéficiez de 14 jours d\'essai gratuit avec toutes les fonctionnalités. Aucune carte bancaire requise au départ.',
  },
  {
    q: 'Comment modifier ou supprimer un produit ?',
    a: "Depuis « Mon catalogue », appuyez sur l'icône crayon sur la carte produit pour modifier. La suppression est disponible dans l'écran de modification.",
  },
  {
    q: 'Puis-je avoir plusieurs employés ?',
    a: 'La gestion des employés avec des accès séparés sera disponible prochainement dans une prochaine version.',
  },
]

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/6 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/3 active:bg-white/6 transition-colors"
      >
        <p className="flex-1 text-body font-medium text-white">{item.q}</p>
        <ChevronDown
          size={16}
          className={cn('text-white/35 shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-label text-white/60 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  )
}

export function AidePage() {
  const supportLink = `https://wa.me/${WAKANECT_SUPPORT.replace(/\D/g, '')}?text=${encodeURIComponent("Bonjour, j'ai besoin d'aide avec Wakanect.")}`

  return (
    <div className="min-h-screen bg-navy-deep">
      <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/app/profil"
            className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-display font-bold text-h3 text-white flex-1">Aide & support</h1>
        </div>
      </div>

      <div className="page-container py-5 flex flex-col gap-5">
        {/* FAQ */}
        <div>
          <p className="text-micro text-white/40 uppercase tracking-wider mb-3 px-1">Questions fréquentes</p>
          <div className="glass rounded-3xl overflow-hidden">
            {FAQ.map((item, i) => <FaqItem key={i} item={item} />)}
          </div>
        </div>

        {/* Contact support */}
        <div className="glass rounded-3xl p-5 flex flex-col items-center gap-4 text-center border border-wa-green/15">
          <div className="w-12 h-12 rounded-2xl bg-wa-green/15 flex items-center justify-center">
            <MessageCircle size={22} className="text-wa-green" />
          </div>
          <div>
            <p className="font-display font-semibold text-h3 text-white">Une autre question ?</p>
            <p className="text-label text-white/50 mt-1">Notre équipe vous répond sur WhatsApp en moins de 24h</p>
          </div>
          <a
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-wa-green text-white font-semibold text-body hover:opacity-90 active:scale-95 transition-all w-full justify-center"
          >
            <MessageCircle size={18} />
            Nous écrire sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
