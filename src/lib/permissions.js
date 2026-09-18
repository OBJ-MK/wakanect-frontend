// Clés de permission employé — miroir de GRANTABLE_PERMISSIONS côté backend.
// Le propriétaire (role 'owner' ou 'superadmin') a tout, toujours, implicitement.
// La vraie barrière est le serveur (403) — ceci ne sert qu'à l'UX (masquage/gardes).

export const PERM = {
  DASHBOARD_VIEW: 'dashboard.view',
  PRODUCTS_SEND: 'products.send',
  PRODUCTS_PUBLISH: 'products.publish',
  PRODUCTS_EDIT: 'products.edit',
  STOCK_EDIT: 'stock.edit',
  ORDERS_CONFIRM: 'orders.confirm',
  ORDERS_CANCEL: 'orders.cancel',
  ORDERS_MARK_PAID: 'orders.markPaid',
  SHOP_MANAGE: 'shop.manage',
  TEAM_MANAGE: 'team.manage',
  BILLING_MANAGE: 'billing.manage',
}

export const NO_PERMISSION_MESSAGE = "Vous n'avez pas la permission pour cette action"

// Permissions accordables à un employé (formulaires Ajouter/Fiche employé).
export const ALL_PERMS_KEYS = [
  'dashboard.view', 'products.send', 'products.publish', 'products.edit',
  'stock.edit', 'orders.confirm', 'orders.cancel', 'orders.markPaid',
]

export const PERMISSION_GROUPS = [
  {
    group: 'Tableau de bord',
    items: [{ key: 'dashboard.view', label: 'Voir le tableau de bord', hint: '(par défaut)' }],
  },
  {
    group: 'Produits',
    items: [
      { key: 'products.send',    label: 'Envoyer des produits' },
      { key: 'products.publish', label: 'Publier des produits' },
      { key: 'products.edit',    label: 'Modifier des produits' },
    ],
  },
  {
    group: 'Stock',
    items: [{ key: 'stock.edit', label: 'Modifier le stock' }],
  },
  {
    group: 'Commandes',
    items: [
      { key: 'orders.confirm',  label: 'Confirmer une commande' },
      { key: 'orders.cancel',   label: 'Annuler une commande' },
      { key: 'orders.markPaid', label: 'Marquer une commande payée' },
    ],
  },
]

/**
 * true si l'acteur peut effectuer l'action.
 * - owner / superadmin → toujours true
 * - employé → la clé doit figurer dans merchant.permissions
 */
export function can(merchant, key) {
  if (!merchant) return false
  if (merchant.role !== 'employee') return true
  return (merchant.permissions || []).includes(key)
}
