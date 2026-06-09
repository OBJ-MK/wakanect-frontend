import { cn } from '@/lib/utils'

export function Card({ className, glass = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl',
        glass
          ? 'glass'
          : 'bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
