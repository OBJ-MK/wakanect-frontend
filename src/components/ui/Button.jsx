import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-gradient-to-r from-orange to-orange-hi text-white shadow-orange-glow hover:shadow-lg active:scale-[0.98]',
  secondary: 'bg-white/10 text-white border border-white/15 hover:bg-white/15 active:scale-[0.98]',
  ghost: 'text-white/80 hover:text-white hover:bg-white/8 active:scale-[0.98]',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 active:scale-[0.98]',
  'wa-green': 'bg-wa-green text-white hover:bg-green-500 shadow-sm active:scale-[0.98]',
  light: 'bg-navy text-white hover:bg-navy-light active:scale-[0.98]',
  outline: 'border border-navy/20 text-navy hover:bg-navy/5 dark:border-white/15 dark:text-white dark:hover:bg-white/8 active:scale-[0.98]',
}

const sizes = {
  sm: 'h-8 px-3 text-label rounded-xl gap-1.5',
  md: 'h-11 px-5 text-body rounded-2xl gap-2',
  lg: 'h-13 px-6 text-body-lg font-semibold rounded-2xl gap-2',
  xl: 'h-14 px-8 text-body-lg font-semibold rounded-3xl gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading = false,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-display font-semibold',
        'transition-all duration-150 focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none select-none tap-highlight-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : children}
    </button>
  )
}
