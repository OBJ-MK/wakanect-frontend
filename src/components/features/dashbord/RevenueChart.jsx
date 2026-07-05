import { formatFCFA } from '@/lib/formatters'

/** Graphique en barres du revenu quotidien réel (series du backend) */
export function RevenueChart({ series }) {
  if (!series || series.length === 0) return null
  const max = Math.max(...series.map(p => p.total), 1)
  const fmtDay = (iso) => {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
  const gap = series.length > 30 ? 'gap-px' : 'gap-1'

  return (
    <div className="mt-4">
      <div className={`flex items-end ${gap} h-16`}>
        {series.map(p => (
          <div
            key={p.date}
            title={`${fmtDay(p.date)} — ${formatFCFA(p.total)}`}
            className={`flex-1 rounded-t-sm min-h-[2px] ${
              p.total > 0
                ? 'bg-gradient-to-t from-orange to-amber'
                : 'bg-white/8'
            }`}
            style={{ height: p.total > 0 ? `${Math.max((p.total / max) * 100, 8)}%` : '2px' }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-white/30">{fmtDay(series[0].date)}</span>
        <span className="text-[10px] text-white/30">{fmtDay(series[series.length - 1].date)}</span>
      </div>
    </div>
  )
}
