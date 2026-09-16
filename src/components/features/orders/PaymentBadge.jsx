import { cn } from '@/lib/utils'
import { CheckCircle2, Clock } from 'lucide-react'

export function PaymentBadge({ status, compact = false }) {
  const paid = status === 'Payée'
  const Icon = paid ? CheckCircle2 : Clock
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold',
        compact ? 'text-[12px]' : 'text-[14px]',
        paid
          ? 'text-emerald-700 dark:text-emerald'
          : 'text-amber-700 dark:text-amber',
      )}
    >
      <Icon className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {status}
    </span>
  )
}