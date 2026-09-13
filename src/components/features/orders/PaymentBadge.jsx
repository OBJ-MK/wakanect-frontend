import { cn } from '@/lib/utils'
import { CheckCircle2, Clock } from 'lucide-react'

export function PaymentBadge({ status }) {
  const paid = status === 'Payée'
  const Icon = paid ? CheckCircle2 : Clock
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[14px] font-semibold',
        paid
          ? 'text-emerald-700 dark:text-emerald'
          : 'text-red-600 dark:text-red-400',
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  )
}