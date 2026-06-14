import { AlertCircle } from 'lucide-react'

export function ErrorState({ message = 'Erreur de chargement', onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-danger" />
      </div>
      <p className="font-semibold text-navy">Erreur de chargement</p>
      <p className="text-body text-admin-muted mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-navy text-white text-label font-medium rounded-lg hover:bg-navy-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
