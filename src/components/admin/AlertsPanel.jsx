import { AlertTriangle, XCircle, Info } from 'lucide-react'

const LEVEL_STYLES = {
  error:   { icon: XCircle,       bar: 'bg-danger',  text: 'text-danger',     bg: 'bg-danger/5 border-danger/15' },
  warning: { icon: AlertTriangle, bar: 'bg-amber',   text: 'text-amber-700',  bg: 'bg-amber/5 border-amber/20' },
  info:    { icon: Info,          bar: 'bg-navy/30', text: 'text-navy',       bg: 'bg-admin-fill border-admin-line' },
}

export function AlertsPanel({ alerts = [] }) {
  if (!alerts.length) {
    return (
      <div className="text-center py-8 text-admin-muted text-label">
        Aucune alerte active
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert, i) => {
        const style = LEVEL_STYLES[alert.level] ?? LEVEL_STYLES.info
        const Icon = style.icon
        return (
          <div key={i} className={`flex gap-3 p-3 rounded-xl border ${style.bg}`}>
            <div className={`w-1 rounded-full self-stretch shrink-0 ${style.bar}`} />
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${style.text}`} />
            <div className="min-w-0">
              <p className="text-body text-admin-ink leading-snug">{alert.message}</p>
              {alert.ref && (
                <p className="text-micro text-admin-muted mt-0.5">{alert.ref}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
