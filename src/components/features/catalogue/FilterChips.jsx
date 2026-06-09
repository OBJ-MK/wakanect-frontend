import { cn } from '@/lib/utils'

export function FilterChips({ categories = [], active, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
      role="group"
      aria-label="Filtres par catégorie"
    >
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-label font-semibold transition-colors whitespace-nowrap',
            active === cat
              ? 'bg-orange text-white shadow-orange-glow'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-orange/40',
          )}
          aria-pressed={active === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
