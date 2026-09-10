import { cn } from '@/lib/utils'

const variants = {
  default: '', // par defaut, pas de style particulier
  orange: 'text-orange',
  amber: 'text-amber-700 dark:text-amber',
  emerald: ' text-emerald-700 dark:text-emerald',
  red: 'text-red-600 dark:text-red-400',
  'wa-green': 'text-green-700 dark:text-wa-green',
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
