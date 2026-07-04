import { ChevronRight } from 'lucide-react'
import { formatFCFA, formatRelativeTime } from '@/lib/formatters'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PerformedBy } from '@/components/ui/PerformedBy'
import { cn } from '@/lib/utils'

export function OrderRow({ order, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3.5',
        'border-b border-white/5 last:border-0',
        'hover:bg-white/4 active:bg-white/8 transition-colors',
        'text-left',
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-body font-semibold text-white truncate">{order.customer_name}</p>
        <p className="text-label text-white/45 mt-0.5">{formatRelativeTime(order.created_at)}</p>
        <PerformedBy actor={order.performed_by} className="mt-0.5" />
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p className="text-label font-bold text-amber">{formatFCFA(order.total)}</p>
        <StatusBadge status={order.status} />
      </div>
      <ChevronRight size={16} className="text-white/30 shrink-0" />
    </button>
  )
}
