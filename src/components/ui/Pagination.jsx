import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Fenêtre de numéros de page autour de la page courante (avec ellipses). */
function pageWindow(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const nums = new Set([1, pages, page - 1, page, page + 1])
  const sorted = [...nums].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const n of sorted) {
    if (n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
}

/**
 * Pagination sans rechargement : uniquement des <button> → setState → fetch.
 * Aucun <a>, aucun window.location.
 */
export function Pagination({ page, pages, onChange, className }) {
  if (!pages || pages <= 1) return null

  return (
    <nav className={cn('flex items-center justify-center gap-1.5 flex-wrap', className)} aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-orange/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronLeft size={16} />
      </button>

      {pageWindow(page, pages).map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="px-1 text-label text-[var(--text-muted)]">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={cn(
              'min-w-9 h-9 px-2 rounded-xl text-label font-semibold transition-colors',
              n === page
                ? 'bg-orange text-white shadow-orange-glow'
                : 'bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-orange/40',
            )}
          >
            {n}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Page suivante"
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-orange/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
