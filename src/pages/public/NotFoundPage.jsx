import { Link } from 'react-router-dom'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-4 text-center">
      <WakanectLogo variant="mark" className="h-12 w-12 mb-6 opacity-60" />
      <p className="font-display font-extrabold text-display text-white/10 mb-2">404</p>
      <h1 className="font-display font-bold text-h2 text-white mb-2">Boutique introuvable</h1>
      <p className="text-body text-white/50 mb-8 max-w-xs">
        Le lien que vous utilisez ne correspond à aucune boutique active.
      </p>
      <Link
        to="/"
        className="text-label text-orange hover:text-orange-hi underline transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
