import { Link } from 'react-router-dom'
import { ShieldOff, ChevronLeft } from 'lucide-react'
import { usePermissions } from '@/hooks/usePermissions'

/**
 * Garde de page par permission employé.
 * Le contenu interdit n'est JAMAIS rendu (pas de flash) : écran "Accès non
 * autorisé" à la place. UX uniquement — le serveur renvoie 403 de toute façon.
 *
 * Usage : <RequirePermission perm="team.manage"><MonEquipePage /></RequirePermission>
 */
export function RequirePermission({ perm, children }) {
  const { can } = usePermissions()

  if (can(perm)) return children

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
        <ShieldOff size={28} className="text-red-400" />
      </div>
      <h1 className="font-display font-bold text-h2 text-white mb-2">Accès non autorisé</h1>
      <p className="text-body text-white/55 max-w-sm mb-8">
        Vous n'avez pas la permission pour cette action. Contactez le propriétaire
        de la boutique si vous pensez qu'il s'agit d'une erreur.
      </p>
      <Link
        to="/app"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange text-white text-body font-semibold hover:bg-orange/90 transition-colors"
      >
        <ChevronLeft size={18} />
        Retour à l'accueil
      </Link>
    </div>
  )
}
