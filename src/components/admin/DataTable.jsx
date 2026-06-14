/**
 * DataTable — tableau desktop / cartes empilées mobile
 *
 * columns: Array<{ key, label, render?, className? }>
 *   render(value, row) → ReactNode  (optionnel)
 * rows: Array<object>
 * onRowClick(row) — rend les lignes cliquables
 * emptyNode — affiché si rows.length === 0
 */
export function DataTable({ columns, rows = [], onRowClick, emptyNode, className = '' }) {
  if (!rows.length && emptyNode) return emptyNode

  return (
    <div className={className}>
      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto rounded-xl">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-admin-fill">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`text-left py-3 px-4 text-label text-admin-muted font-medium whitespace-nowrap border-b border-admin-line ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id ?? row.slug ?? i}
                onClick={() => onRowClick?.(row)}
                className={`bg-white border-b border-admin-line last:border-0 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-admin-fill' : ''
                }`}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 text-admin-ink tabular-nums ${col.className ?? ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-2.5">
        {rows.map((row, i) => (
          <div
            key={row.id ?? row.slug ?? i}
            onClick={() => onRowClick?.(row)}
            className={`bg-white rounded-xl p-4 shadow-admin-card transition-transform ${
              onRowClick ? 'cursor-pointer active:scale-[0.985]' : ''
            }`}
          >
            {/* Première colonne = titre de la carte */}
            <div className="font-semibold text-navy text-body mb-2.5">
              {columns[0].render
                ? columns[0].render(row[columns[0].key], row)
                : (row[columns[0].key] ?? '—')}
            </div>

            {/* Reste en grille libellé / valeur */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {columns.slice(1).map(col => (
                <div key={col.key}>
                  <div className="text-micro text-admin-muted uppercase tracking-wide mb-0.5">
                    {col.label}
                  </div>
                  <div className="text-label text-admin-ink tabular-nums">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
