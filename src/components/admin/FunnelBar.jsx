/**
 * FunnelBar — entonnoir d'escalade parsing
 * Mapping couleur (§1 design system) :
 *   Regex     = admin.fill/line  (gratuit, neutre)
 *   Cloudflare = amber           (attention)
 *   Haiku      = orange          (payant, ressort)
 *   Échec      = danger          (anomalie)
 */
const SEGMENTS = [
  {
    key: 'pctRegexOnly',
    label: 'Regex',
    note: 'Gratuit',
    bar: 'bg-admin-fill border border-admin-line',
    dot: 'bg-admin-line border border-admin-muted',
    text: 'text-admin-ink-2',
  },
  {
    key: 'pctEscalateCloudflare',
    label: 'Cloudflare',
    note: 'Coût modéré',
    bar: 'bg-amber',
    dot: 'bg-amber',
    text: 'text-amber-700',
  },
  {
    key: 'pctEscalateHaiku',
    label: 'Haiku',
    note: 'Payant',
    bar: 'bg-orange',
    dot: 'bg-orange',
    text: 'text-orange font-semibold',
  },
  {
    key: 'pctFailed',
    label: 'Échec',
    note: 'Anomalie',
    bar: 'bg-danger',
    dot: 'bg-danger',
    text: 'text-danger',
  },
]

export function FunnelBar({ data }) {
  if (!data) return null

  const active = SEGMENTS.filter(s => (data[s.key] ?? 0) > 0)

  return (
    <div className="space-y-4">
      {/* Barre segmentée */}
      <div className="flex h-9 rounded-xl overflow-hidden gap-px">
        {SEGMENTS.map(seg => {
          const pct = data[seg.key] ?? 0
          if (pct <= 0) return null
          return (
            <div
              key={seg.key}
              style={{ width: `${pct}%` }}
              className={`${seg.bar} flex items-center justify-center transition-all`}
              title={`${seg.label}: ${pct}%`}
            >
              {pct > 6 && (
                <span className={`text-micro font-medium ${seg.key === 'pctRegexOnly' ? 'text-admin-ink-2' : 'text-white'}`}>
                  {pct}%
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {SEGMENTS.map(seg => {
          const pct = data[seg.key] ?? 0
          return (
            <div key={seg.key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${seg.dot}`} />
              <span className="text-label text-admin-ink-2">
                {seg.label}{' '}
                <span className={`tabular-nums ${seg.text}`}>{pct}%</span>
              </span>
              <span className="text-micro text-admin-muted hidden sm:inline">· {seg.note}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
