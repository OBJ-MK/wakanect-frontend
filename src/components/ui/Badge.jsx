import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-navy/10 text-navy dark:bg-white/10 dark:text-white/80',
  orange: 'bg-orange/15 text-orange',
  amber: 'bg-amber/15 text-amber-700 dark:text-amber',
  emerald: 'bg-emerald/15 text-emerald-700 dark:text-emerald',
  red: 'bg-red-500/15 text-red-600 dark:text-red-400',
  'wa-green': 'bg-wa-green/15 text-green-700 dark:text-wa-green',
}

export function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
