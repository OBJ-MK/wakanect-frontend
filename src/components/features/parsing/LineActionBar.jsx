import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LineActionBar({ onPublish, onIgnore, loading }) {
  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
      <Button
        variant="primary"
        size="md"
        onClick={onPublish}
        loading={loading}
        className="w-full"
      >
        <Check size={16} /> Publier
      </Button>
      <button
        type="button"
        onClick={onIgnore}
        disabled={loading}
        className="text-center text-label text-white/40 hover:text-white/60 transition-colors disabled:opacity-40"
      >
        Ignorer ce message
      </button>
    </div>
  )
}
