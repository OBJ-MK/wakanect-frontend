import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODES } from '@/lib/constants'

/**
 * Champ téléphone avec sélecteur d'indicatif pays séparé du numéro local.
 * Le parent reçoit `dialCode` (ex: '+221') et `number` (ex: '77 000 00 00')
 * séparément — c'est lui qui les recombine au submit (voir RegisterPage).
 */
export function PhoneInput({
  label,
  dialCode,
  onDialCodeChange,
  number,
  onNumberChange,
  error,
  hint,
  required,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-label font-semibold text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <select
            value={dialCode}
            onChange={(e) => onDialCodeChange(e.target.value)}
            aria-label="Indicatif du pays"
            className={cn(
              'h-full appearance-none rounded-2xl pl-3 pr-8 py-3 text-body cursor-pointer',
              'bg-[var(--bg-surface)] border border-[var(--border-default)]',
              'text-[var(--text-primary)]',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange',
              'dark:bg-navy/60 dark:border-white/10',
            )}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.dial} value={c.dial}>
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
        </div>

        <input
          type="tel"
          inputMode="tel"
          placeholder="77 000 00 00"
          value={number}
          onChange={(e) => onNumberChange(e.target.value.replace(/[^\d\s]/g, ''))}
          required={required}
          className={cn(
            'flex-1 min-w-0 rounded-2xl px-4 py-3 text-body',
            'bg-[var(--bg-surface)] border border-[var(--border-default)]',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange',
            'dark:bg-navy/60 dark:border-white/10',
            error && 'border-red-400 focus:ring-red-400/30 focus:border-red-400',
          )}
        />
      </div>
      {error && <p className="text-label text-red-400">{error}</p>}
      {hint && !error && <p className="text-micro text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}