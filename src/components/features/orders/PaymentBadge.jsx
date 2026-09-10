import { cn } from '@/lib/utils'

export function PaymentBadge({ status }) {
  const paid = status === 'Payée'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[14px] font-semibold',
        paid
          ? 'text-emerald-700 dark:text-emerald'
          : 'text-red-600 dark:text-red-400',
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', paid ? 'bg-emerald' : 'bg-red-400')} />
      {status}
    </span>
  )
}
