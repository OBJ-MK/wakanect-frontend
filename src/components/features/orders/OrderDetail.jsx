import { formatFCFA, formatDate } from '@/lib/formatters'
import { OrderStatusStepper } from './OrderStatusStepper'
import { PaymentBadge } from './PaymentBadge'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, MessageCircle, Package } from 'lucide-react'

export function OrderDetail({ order, onStatusUpdate, onMarkPaid, loading }) {
  if (!order) return null

  const status = order.status
  const isPaid = order.payment_status === 'Payée'

  const canConfirm = status === 'Nouvelle'
  const canDeliver = status === 'Confirmée'
  const canCancel  = status !== 'Livrée' && status !== 'Annulée'
  const canMarkPaid = !isPaid && status !== 'Annulée'
  const hasActionBar = canConfirm || canDeliver || canMarkPaid || canCancel

  return (
    <div className="flex flex-col gap-4">
      {/* Status stepper */}
      <div className="glass rounded-3xl p-5">
        <p className="text-micro text-white/45 uppercase tracking-wider mb-4">Statut commande</p>
        <OrderStatusStepper
          status={status}
          onUpdate={onStatusUpdate}
          loading={loading}
        />
      </div>

      {/* Payment */}
      <div className="glass rounded-3xl p-5 flex items-center justify-between">
        <div>
          <p className="text-micro text-white/45 uppercase tracking-wider mb-1">Paiement</p>
          <PaymentBadge status={order.payment_status} />
        </div>
        <p className="text-h2 font-display font-bold text-amber">{formatFCFA(order.total)}</p>
      </div>

      {/* Customer info */}
      <div className="glass rounded-3xl p-5 flex flex-col gap-3">
        <p className="text-micro text-white/45 uppercase tracking-wider">Client</p>
        <div className="flex items-center gap-2 text-body text-white">
          <Phone size={15} className="text-white/40 shrink-0" />
          {order.customer_name}
        </div>
        {order.customer_phone && (
          <a
            href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-body text-wa-green"
          >
            <MessageCircle size={15} className="shrink-0" />
            {order.customer_phone}
          </a>
        )}
        {order.delivery_address && (
          <div className="flex items-start gap-2 text-body text-white/70">
            <MapPin size={15} className="text-white/40 shrink-0 mt-0.5" />
            {order.delivery_address}
          </div>
        )}
        {order.note && (
          <p className="text-label text-white/45 italic border-t border-white/8 pt-3 mt-1">
            « {order.note} »
          </p>
        )}
      </div>

      {/* Items */}
      <div className="glass rounded-3xl overflow-hidden">
        <p className="text-micro text-white/45 uppercase tracking-wider px-5 pt-5 pb-3">Articles</p>
        {(order.items || []).map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 border-t border-white/6">
            <div className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center shrink-0">
              <Package size={16} className="text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body text-white truncate">{item.name}</p>
              {item.color && (
                <p className="text-micro text-white/45">Couleur : {item.color}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-label text-white/60">×{item.quantity}</p>
              <p className="text-label font-semibold text-amber">{formatFCFA(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-between px-5 py-4 border-t border-white/10">
          <p className="text-body font-semibold text-white">Total</p>
          <p className="text-body font-bold text-amber">{formatFCFA(order.total)}</p>
        </div>
      </div>

      <p className="text-micro text-white/30 text-center">
        Commandé le {formatDate(order.created_at)}
      </p>

      {/* Fixed action bar */}
      {hasActionBar && (
        <div className="fixed bottom-20 inset-x-0 z-30 glass border-t border-white/8 px-4 pt-3 pb-4">
          <div className="max-w-lg mx-auto flex flex-col gap-2.5">
            {(canConfirm || canDeliver) && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onClick={() => onStatusUpdate(canConfirm ? 'Confirmée' : 'Livrée')}
              >
                {canConfirm ? 'Confirmer la commande' : 'Marquer comme livrée'}
              </Button>
            )}
            {canMarkPaid && (
              <Button
                variant="secondary"
                size="md"
                fullWidth
                loading={loading}
                onClick={onMarkPaid}
              >
                Marquer comme payée
              </Button>
            )}
            {canCancel && (
              <button
                onClick={() => onStatusUpdate('Annulée')}
                disabled={loading}
                className="text-center text-label text-red-400/80 hover:text-red-400 transition-colors py-1 disabled:opacity-40"
              >
                Annuler la commande
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
