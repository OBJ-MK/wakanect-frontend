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
