import { useState } from 'react'
import { formatFCFA, formatDate } from '@/lib/formatters'
import { OrderStatusStepper } from './OrderStatusStepper'
import { PaymentBadge } from './PaymentBadge'
import { CancelReasonModal } from './CancelReasonModal'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, MessageCircle, Package } from 'lucide-react'
import { PerformedBy } from '@/components/ui/PerformedBy'

const CANCEL_REASON_LABELS = {
  stock_epuise:          'Stock épuisé',
  variante_indisponible: 'Couleur / taille non disponible',
  client_injoignable:    'Client injoignable',
  autre:                 null, // affiche cancel_reason_detail directement
}

export function OrderDetail({ order, onStatusUpdate, onCancel, onMarkPaid, onNotifyLinkOpened, onNotifyConfirm, loading }) {
  const [showCancelModal, setShowCancelModal] = useState(false)

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
      <div className="glass rounded-3xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-micro text-white/45 uppercase tracking-wider mb-1">Paiement</p>
            <PaymentBadge status={order.payment_status} />
          </div>
          <p className="text-h2 font-display font-bold text-amber">{formatFCFA(order.total)}</p>
        </div>
        {order.payment_proof_url && (
          <div className="border-t border-white/8 pt-3">
            <p className="text-micro text-white/45 uppercase tracking-wider mb-2">
              Preuve de paiement envoyée par le client
            </p>
            <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer">
              <img
                src={order.payment_proof_url}
                alt="Preuve de paiement"
                className="w-32 h-32 object-cover rounded-2xl border border-white/10 hover:opacity-80 transition-opacity"
              />
            </a>
            <p className="text-micro text-white/40 mt-1.5">
              Vérifiez le montant avant de marquer la commande comme payée.
            </p>
          </div>
        )}
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

      <div className="flex flex-col items-center gap-1">
        <p className="text-micro text-white/30 text-center">
          Commandé le {formatDate(order.created_at)}
        </p>
        <PerformedBy actor={order.performed_by} prefix="Traité par" className="text-white/30" />
      </div>

      {/* Actions dans le flux */}
      {hasActionBar && (
        <div className="flex flex-col gap-3 pt-2 pb-6">
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
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={onMarkPaid}
              className="!bg-white/10 !text-white hover:!bg-white/15 border border-white/20"
            >
              Marquer comme payée
            </Button>
          )}
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={loading}
              className="text-center text-label text-red-400/80 hover:text-red-400 transition-colors py-1.5 disabled:opacity-40"
            >
              Annuler la commande
            </button>
          )}
        </div>
      )}

      {status === 'Annulée' && order.cancel_reason && (
        <div className="glass rounded-3xl p-4 border border-red-500/15 flex flex-col gap-3">
          <div>
            <p className="text-micro text-white/45 uppercase tracking-wider mb-1">Raison de l'annulation</p>
            <p className="text-body text-white/80">
              {CANCEL_REASON_LABELS[order.cancel_reason] || order.cancel_reason_detail}
            </p>
          </div>

          {order.whatsapp_cancel_link && (
            <div className="border-t border-white/8 pt-3 flex flex-col gap-2.5">
              <p className="text-micro text-white/45 uppercase tracking-wider">Prévenir le client</p>
              <a
              
                href={order.whatsapp_cancel_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNotifyLinkOpened}
                className="flex items-center gap-2.5 rounded-2xl bg-wa-green/10 border border-wa-green/25 px-3.5 py-3 hover:bg-wa-green/15 active:scale-[0.98] transition-all"
              >
                <MessageCircle size={16} className="text-wa-green shrink-0" />
                <span className="text-label font-semibold text-white flex-1">
                  {order.wa_link_opened_at ? 'Rouvrir le message WhatsApp' : 'Ouvrir WhatsApp avec le message pré-rempli'}
                </span>
              </a>

              {order.wa_link_opened_at && (
                <p className="text-micro text-white/40">
                  Lien ouvert le {formatDate(order.wa_link_opened_at)}
                  {!order.customer_notified_at && ' — a-t-il bien été envoyé ?'}
                </p>
              )}

              {order.customer_notified_at ? (
                <p className="flex items-center gap-1.5 text-label font-medium text-emerald-400">
                  ✓ Client notifié le {formatDate(order.customer_notified_at)}
                </p>
              ) : (
                <button
                  onClick={onNotifyConfirm}
                  disabled={loading}
                  className="text-label font-semibold text-white/60 hover:text-white text-left disabled:opacity-40"
                >
                  Marquer comme envoyé au client
                </button>
              )}

              <p className="text-micro text-white/30 leading-snug">
                On ne peut pas confirmer automatiquement l'envoi ou la lecture — WhatsApp ne le permet
                pas pour ce type de lien. C'est à toi de confirmer une fois le message envoyé.
              </p>
            </div>
          )}
        </div>
      )}

      <CancelReasonModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        loading={loading}
        onConfirm={(reason, detail) => {
          setShowCancelModal(false)
          onCancel(reason, detail)
        }}
      />
    </div>
  )
}