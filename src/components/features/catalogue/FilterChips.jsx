import { cn } from '@/lib/utils'

export function FilterChips({ categories = [], active, onChange, compact = false, sidebar = false }) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto no-scrollbar pb-1',
        // Colonne latérale desktop (voir CataloguePage) : les puces passent
        // à la ligne au lieu de défiler horizontalement dans ~260px.
        sidebar && 'lg:flex-wrap lg:overflow-x-visible lg:pb-0',
      )}
      role="group"
      aria-label="Filtres par catégorie"
    >
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            cn(
              'flex-shrink-0 font-semibold transition-colors whitespace-nowrap',
              compact
                ? 'px-4 py-2 rounded-full text-label lg:px-2.5 lg:py-1.5 lg:rounded-md lg:text-[12px]'
                : 'px-4 py-2 rounded-full text-label'
            ),
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
