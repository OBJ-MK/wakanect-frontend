import { useParams, Link } from 'react-router-dom'
import { Package, CheckCircle, Truck, Clock, MessageCircle } from 'lucide-react'
import { formatFCFA } from '@/lib/formatters'
import { buildWhatsAppLink } from '@/lib/utils'


const STATUS_STEPS = [
  { key: 'Nouvelle', label: 'Commande reçue', icon: Clock },
  { key: 'Confirmée', label: 'Confirmée par le vendeur', icon: CheckCircle },
  { key: 'Livrée', label: 'Livrée', icon: Truck },
]

const STATUS_ORDER = ['Nouvelle', 'Confirmée', 'Livrée']

export function OrderTrackingPage() {
  const { slug, orderId } = useParams()
  const order = null

  if (!order) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep flex flex-col items-center justify-center px-5 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-navy/8 dark:bg-white/8 flex items-center justify-center">
          <Package size={28} className="text-navy/30 dark:text-white/25" />
        </div>
        <p className="font-display font-bold text-h3 text-navy dark:text-white">Commande introuvable</p>
        <p className="text-label text-navy/50 dark:text-white/40">
          Ce lien de suivi n'est plus valide ou la commande n'existe pas.
        </p>
        <Link
          to={`/boutique/${slug}`}
          className="mt-2 px-5 py-2.5 rounded-2xl bg-orange text-white text-label font-semibold hover:bg-orange-hi transition-all"
        >
          Retour à la boutique
        </Link>
      </div>
    )
  }

  const currentStep = STATUS_ORDER.indexOf(order.status)
  const isPaid = order.payment_status === 'Payée'

  const waMsg = `Bonjour, je voudrais des nouvelles de ma commande ${order.id}.`
  const waLink = order.whatsapp_number
    ? buildWhatsAppLink(order.whatsapp_number, waMsg)
    : null

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      {/* Header */}
      <div className="bg-white/80 dark:bg-navy/80 backdrop-blur-glass border-b border-navy/8 dark:border-white/8 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <p className="text-micro text-navy/40 dark:text-white/40 uppercase tracking-wider">Suivi de commande</p>
          <h1 className="font-display font-bold text-h2 text-navy dark:text-white mt-0.5">{order.id}</h1>
          <p className="text-label text-navy/50 dark:text-white/40">{order.shop_name}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 flex flex-col gap-5">
        {/* Status stepper */}
        <div className="bg-white dark:glass rounded-3xl p-5 shadow-card dark:shadow-none">
          <div className="flex flex-col gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      done ? 'bg-emerald/15 text-emerald' : 'bg-navy/8 dark:bg-white/8 text-navy/30 dark:text-white/25'
                    }`}>
                      <step.icon size={17} strokeWidth={active ? 2.5 : 1.8} />
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 mb-1 rounded-full ${done ? 'bg-emerald/40' : 'bg-navy/10 dark:bg-white/10'}`} />
                    )}
                  </div>
                  <div className="pt-2 pb-4">
                    <p className={`text-body font-semibold ${done ? 'text-navy dark:text-white' : 'text-navy/40 dark:text-white/35'}`}>
                      {step.label}
                    </p>
                    {active && (
                      <p className="text-label text-emerald mt-0.5">En cours</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment status */}
        <div className={`rounded-3xl p-4 flex items-center gap-3 ${
          isPaid
            ? 'bg-emerald/10 border border-emerald/20'
            : 'bg-amber/10 border border-amber/20'
        }`}>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isPaid ? 'bg-emerald/15' : 'bg-amber/15'}`}>
            <Package size={17} className={isPaid ? 'text-emerald' : 'text-amber'} />
          </div>
          <div className="flex-1">
            <p className={`text-body font-semibold ${isPaid ? 'text-emerald' : 'text-amber'}`}>
              {isPaid ? 'Paiement reçu' : 'En attente de paiement'}
            </p>
            {!isPaid && (
              <p className="text-label text-navy/50 dark:text-white/45 mt-0.5">
                Payez directement sur Wave au vendeur ({formatFCFA(order.total)})
              </p>
            )}
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white dark:glass rounded-3xl overflow-hidden shadow-card dark:shadow-none">
          <p className="text-micro text-navy/40 dark:text-white/40 uppercase tracking-wider px-4 pt-4 pb-2">Articles commandés</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-navy/6 dark:border-white/6 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-navy dark:text-white">{item.name}</p>
                <p className="text-micro text-navy/40 dark:text-white/40">
                  {[item.color, item.size && `Taille ${item.size}`, `×${item.quantity}`].filter(Boolean).join(' · ')}
                </p>
              </div>
              <p className="text-label font-bold text-navy dark:text-white">{formatFCFA(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-navy/3 dark:bg-white/3">
            <p className="text-body font-semibold text-navy dark:text-white">Total</p>
            <p className="font-display font-bold text-h3 text-orange">{formatFCFA(order.total)}</p>
          </div>
        </div>

        {/* Contact vendor */}
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 rounded-3xl border border-wa-green/30 text-wa-green font-semibold text-body hover:bg-wa-green/8 active:scale-[0.98] transition-all"
          >
            <MessageCircle size={18} />
            Contacter le vendeur sur WhatsApp
          </a>
        )}

        {/* Back to boutique */}
        <Link
          to={`/boutique/${slug}`}
          className="text-center text-label text-navy/40 dark:text-white/35 hover:text-navy/60 dark:hover:text-white/55 transition-colors"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  )
}
