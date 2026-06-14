/**
 * KpiCard — carte métrique admin
 * variant 'default' : fond blanc, texte navy
 * variant 'accent'  : fond navy, texte blanc (Haiku cost)
 */
export function KpiCard({ label, value, sub, delta, variant = 'default', icon: Icon, className = '' }) {
  const isAccent = variant === 'accent'

  const base = isAccent
    ? 'bg-navy text-white'
    : 'bg-white shadow-admin-card'

  const labelCls = isAccent ? 'text-white/60' : 'text-admin-muted'
  const valueCls = isAccent ? 'text-white' : 'text-navy'
  const iconCls  = isAccent ? 'text-orange' : 'text-admin-muted'

  const deltaPositive = typeof delta === 'number' ? delta >= 0 : null

  return (
    <div className={`rounded-xl p-4 ${base} ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-label font-medium ${labelCls}`}>{label}</span>
        {Icon && <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconCls}`} />}
      </div>

      <div className={`text-h2 font-display font-bold tabular-nums leading-none ${valueCls}`}>
        {value}
      </div>

      {(sub || delta !== undefined) && (
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          {sub && (
            <span className={`text-label ${isAccent ? 'text-white/50' : 'text-admin-muted'}`}>{sub}</span>
          )}
          {delta !== undefined && deltaPositive !== null && (
            <span className={`text-label font-medium ${deltaPositive ? 'text-wa-green' : 'text-danger'}`}>
              {deltaPositive ? '↑' : '↓'} {Math.abs(delta)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
