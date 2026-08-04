import { Link, useParams, useLocation, Navigate } from 'react-router-dom'
import { CheckCircle, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatFCFA } from '@/lib/formatters'
import { buildWhatsAppLink } from '@/lib/utils'

export function ConfirmationPage() {
  const { slug } = useParams()
  const { state } = useLocation()
  const order = state?.order

  // Arrivée directe sans commande (refresh, lien partagé…) → retour boutique
  if (!order) {
    return <Navigate to={`/boutique/${slug}`} replace />
  }

  const payLink = buildWhatsAppLink(
    order.merchantWhatsapp,
    `Bonjour, je viens de payer la commande ${order.orderNumber} (${formatFCFA(order.totalAmount)}) sur Wave.`
  )

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-scale-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald/15 flex items-center justify-center">
            <CheckCircle size={48} className="text-emerald" strokeWidth={1.5} />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-emerald/20 animate-ping" />
        </div>

        <h1 className="font-display font-extrabold text-h1 text-navy dark:text-white mb-2">
          Commande enregistrée
        </h1>
        <p className="text-body text-navy/60 dark:text-white/60 mb-6">
          Dernière étape : payez le vendeur pour finaliser votre commande.
        </p>

        {/* Montant à payer + numéro Wave du vendeur */}
        <div className="w-full rounded-2xl border-2 border-navy dark:border-white/80 bg-white/60 dark:bg-navy-light/40 p-4 mb-4 text-left">
          <p className="text-micro text-navy/50 dark:text-white/45 uppercase tracking-wider mb-1">
            Montant à payer · Wave du vendeur
          </p>
          <p className="font-display font-bold text-h3 text-navy dark:text-white">
            {formatFCFA(order.totalAmount)} → {order.merchantWhatsapp}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-navy/10 dark:border-white/10 p-4 mb-6 text-left flex flex-col gap-2">
          <div className="flex justify-between text-label">
            <span className="text-navy/50 dark:text-white/50">Commande</span>
            <span className="font-semibold text-navy dark:text-white">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-label">
            <span className="text-navy/50 dark:text-white/50">Statut</span>
            <span className="font-semibold text-orange">En attente de paiement</span>
          </div>
        </div>

        <div className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-wa-green/10 border border-wa-green/20 mb-6">
          <MessageCircle size={18} className="text-wa-green shrink-0" />
          <p className="text-label text-navy dark:text-white/80 text-left">
            Reçu envoyé par WhatsApp — vérifiez vos messages
          </p>
        </div>

        <a href={payLink} target="_blank" rel="noopener noreferrer" className="w-full mb-3">
          <Button variant="primary" size="lg" fullWidth>
            <MessageCircle size={16} /> J'ai payé — prévenir le vendeur
          </Button>
        </a>

        <Link to={`/boutique/${slug}`} className="w-full">
          <Button variant="outline" size="lg" fullWidth>
            <ArrowLeft size={16} /> Retour à la boutique
          </Button>
        </Link>
      </div>
    </div>
  )
}