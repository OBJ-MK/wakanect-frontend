import { cn } from '@/lib/utils'

export function Input({
  label,
  error,
  hint,
  icon,
  suffix,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-label font-semibold text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={cn(
            'w-full rounded-2xl px-4 py-3 text-body',
            'bg-[var(--bg-surface)] border border-[var(--border-default)]',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange',
            'dark:bg-navy/60 dark:border-white/10',
            icon && 'pl-10',
            suffix && 'pr-20',
            error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-label text-[var(--text-muted)] pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-label text-red-400">{error}</p>}
      {hint && !error && <p className="text-micro text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}
