import { useState } from 'react'
import { formatFCFA } from '@/lib/formatters'

function fmtDay(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

/**
 * Graphique en barres du revenu quotidien réel (series du backend).
 * `height` (px) et `showAxis` par défaut reproduisent le comportement
 * historique (h-16, pas de repères) pour ne rien changer sur le Dashboard.
 */
export function RevenueChart({ series, height = 64, showAxis = false }) {
  const [hovered, setHovered] = useState(null)
  if (!series || series.length === 0) return null

  const max = Math.max(...series.map(p => p.total), 1)
  const gap = series.length > 30 ? 'gap-px' : 'gap-1'
  const active = hovered ?? series[series.length - 1]

  return (
    <div className="mt-4">
      {showAxis && (
        <div className="mb-2">
          <p className="text-micro text-white/40">{fmtDay(active.date)}</p>
          <p className="font-display font-bold text-h3 text-white leading-tight">
            {formatFCFA(active.total)}
          </p>
        </div>
      )}

      <div className="relative" style={{ height }}>
        {showAxis && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1, 0.5, 0].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="text-[10px] text-white/25 w-14 shrink-0 text-right leading-none">
                  {formatFCFA(Math.round(max * f))}
                </span>
                <span className="flex-1 border-t border-white/6" />
              </div>
            ))}
          </div>
        )}
        <div className={`absolute inset-0 flex items-end ${gap} ${showAxis ? 'pl-16' : ''}`}>
          {series.map(p => (
            <div
              key={p.date}
              title={`${fmtDay(p.date)} — ${formatFCFA(p.total)}`}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p)}
              onBlur={() => setHovered(null)}
              className={`flex-1 rounded-t-sm min-h-[2px] transition-colors ${
                p.total > 0
                  ? 'bg-gradient-to-t from-orange to-amber'
                  : 'bg-white/8'
              } ${hovered === p ? 'brightness-110' : ''}`}
              style={{ height: p.total > 0 ? `${Math.max((p.total / max) * 100, 8)}%` : '2px' }}
            />
          ))}
        </div>
      </div>

      <div className={`flex justify-between mt-1.5 ${showAxis ? 'pl-16' : ''}`}>
        <span className="text-[10px] text-white/30">{fmtDay(series[0].date)}</span>
        <span className="text-[10px] text-white/30">{fmtDay(series[series.length - 1].date)}</span>
      </div>
    </div>
  )
}
