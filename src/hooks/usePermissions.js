import { useAuthStore } from '@/store/authStore'
import { can, NO_PERMISSION_MESSAGE } from '@/lib/permissions'

/**
 * Permissions de l'acteur connecté (UX uniquement — le serveur reste la barrière).
 *
 * - can(key)    → true si owner, sinon si la permission est accordée
 * - ensure(key) → comme can(), mais affiche le message d'interdiction si refusé
 *                 (à utiliser au clic sur une action sensible)
 * - isOwner     → true pour owner / superadmin
 */
export function usePermissions() {
  const merchant = useAuthStore((s) => s.merchant)

  const canDo = (key) => can(merchant, key)

  const ensure = (key) => {
    if (canDo(key)) return true
    window.alert(NO_PERMISSION_MESSAGE)
    return false
  }

  return {
    can: canDo,
    ensure,
    isOwner: merchant?.role !== 'employee',
  }
}
