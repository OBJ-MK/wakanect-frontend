import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LineActionBar({ onConfirm, onReject, loading }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-white/10">
      <Button
        variant="danger"
        size="md"
        onClick={onReject}
        disabled={loading}
        className="flex-1"
      >
        <X size={16} /> Rejeter
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onConfirm}
        loading={loading}
        className="flex-1"
      >
        <Check size={16} /> Confirmer et publier
      </Button>
    </div>
  )
}
