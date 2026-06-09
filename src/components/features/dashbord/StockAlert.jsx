import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function StockAlert({ count }) {
  if (!count || count === 0) return null

  return (
    <Link
      to="/app/stock"
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber/10 border border-amber/20 hover:bg-amber/15 transition-colors"
    >
      <AlertTriangle size={18} className="text-amber shrink-0" />
      <div className="flex-1">
        <p className="text-label font-semibold text-amber">
          {count} produit{count > 1 ? 's' : ''} en stock bas
        </p>
        <p className="text-micro text-amber/70">Pensez à réapprovisionner</p>
      </div>
    </Link>
  )
}
