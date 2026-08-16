import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

const REASONS = [
  { value: 'stock_epuise',          label: 'Stock épuisé' },
  { value: 'variante_indisponible', label: 'Couleur / taille non disponible' },
  { value: 'client_injoignable',    label: "Client injoignable" },
  { value: 'autre',                 label: 'Autre raison' },
]

export function CancelReasonModal({ isOpen, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState(null)
  const [detail, setDetail] = useState('')

  function handleClose() {
    setReason(null)
    setDetail('')
    onClose()
  }

  function handleConfirm() {
    if (!reason) return
    if (reason === 'autre' && !detail.trim()) return
    onConfirm(reason, reason === 'autre' ? detail.trim() : null)
  }

  const canConfirm = reason && (reason !== 'autre' || detail.trim())

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Pourquoi annuler ?">
      <p className="text-label text-[var(--text-muted)] mb-4">
        Cette raison sera enregistrée et pourra être partagée au client.
      </p>
      <div className="flex flex-col gap-2">
        {REASONS.map(r => (
          <button
            key={r.value}
            onClick={() => setReason(r.value)}
            className={`text-left px-4 py-3 rounded-2xl border text-body transition-colors ${
              reason === r.value
                ? 'border-orange bg-orange/10 text-[var(--text-primary)] font-semibold'
                : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {reason === 'autre' && (
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Précise la raison..."
          rows={3}
          className="w-full mt-3 px-4 py-3 rounded-2xl border border-[var(--border-default)] bg-transparent text-body text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-orange"
        />
      )}

      <div className="flex gap-2 mt-5">
        <Button variant="secondary" size="md" fullWidth onClick={handleClose}>
          Retour
        </Button>
        <Button
          variant="danger"
          size="md"
          fullWidth
          disabled={!canConfirm}
          loading={loading}
          onClick={handleConfirm}
        >
          Confirmer l'annulation
        </Button>
      </div>
    </Modal>
  )
}