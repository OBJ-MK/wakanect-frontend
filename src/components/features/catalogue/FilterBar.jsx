import { Search, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { FilterChips } from './FilterChips'
import { cn } from '@/lib/utils'

const DEFAULT_SORT_OPTIONS = [
  { value: 'recent',     label: 'Plus récents' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
]

const selectClass = cn(
  'rounded-2xl px-3 py-2.5 text-label',
  'bg-[var(--bg-surface)] border border-[var(--border-default)]',
  'text-[var(--text-primary)]',
  'focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange',
  'dark:bg-navy/60 dark:border-white/10',
)

/**
 * Barre de filtres server-side : recherche (débouncée dans le hook appelant),
 * catégorie (options figées au premier fetch non filtré), prix min/max, tri,
 * réinitialisation et compteur de résultats. Ne déclenche que des setState.
 */
export function FilterBar({
  filters,
  onChange,
  onReset,
  categories = null,
  defaultCategory = 'Tout',
  total = null,
  showPrice = true,
  sortOptions = DEFAULT_SORT_OPTIONS,
  className,
}) {
  const isDirty =
    filters.search !== '' ||
    (filters.category && filters.category !== defaultCategory) ||
    filters.priceMin !== '' ||
    filters.priceMax !== '' ||
    filters.sort !== sortOptions[0].value

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Input
        icon={<Search size={16} />}
        type="search"
        placeholder="Rechercher..."
        value={filters.search}
        onChange={e => onChange({ search: e.target.value })}
        className="py-2.5"
      />

      {categories && categories.length > 1 && (
        <FilterChips
          categories={categories}
          active={filters.category}
          onChange={category => onChange({ category })}
        />
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {showPrice && (
          <>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="Prix min"
              aria-label="Prix minimum"
              value={filters.priceMin}
              onChange={e => onChange({ priceMin: e.target.value })}
              className={cn(selectClass, 'w-24 placeholder:text-[var(--text-muted)]')}
            />
            <input
              type="number"
              inputMode="numeric"
              min="0"
              placeholder="Prix max"
              aria-label="Prix maximum"
              value={filters.priceMax}
              onChange={e => onChange({ priceMax: e.target.value })}
              className={cn(selectClass, 'w-24 placeholder:text-[var(--text-muted)]')}
            />
          </>
        )}

        <select
          aria-label="Trier"
          value={filters.sort}
          onChange={e => onChange({ sort: e.target.value })}
          className={selectClass}
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {isDirty && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-label font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-orange/40 transition-colors"
          >
            <RotateCcw size={13} />
            Réinitialiser
          </button>
        )}

        {total !== null && (
          <span className="text-micro text-[var(--text-muted)] ml-auto" aria-live="polite">
            {total} résultat{total > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
