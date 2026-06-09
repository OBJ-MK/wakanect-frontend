import { cn } from '@/lib/utils'

export function PaymentBadge({ status }) {
  const paid = status === 'Payée'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold',
        paid
          ? 'bg-emerald/15 text-emerald-700 dark:text-emerald'
          : 'bg-red-500/15 text-red-600 dark:text-red-400',
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', paid ? 'bg-emerald' : 'bg-red-400')} />
      {status}
    </span>
  )
}
