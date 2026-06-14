import { useEffect } from 'react'
import { X } from 'lucide-react'

export function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 motion-safe:animate-fade-up"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-glass motion-safe:animate-bottom-sheet max-h-[85dvh] flex flex-col">
        {/* Handle + header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-admin-line shrink-0">
          <div className="w-10 h-1 rounded-full bg-admin-line absolute top-2 left-1/2 -translate-x-1/2" />
          <span className="font-semibold text-navy pt-2">{title}</span>
          <button
            onClick={onClose}
            className="p-1.5 text-admin-muted hover:text-navy rounded-lg transition-colors mt-2"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 pb-[env(safe-area-inset-bottom,1rem)]">
          {children}
        </div>
      </div>
    </div>
  )
}
