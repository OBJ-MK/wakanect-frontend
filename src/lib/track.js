import { API_BASE } from '@/lib/constants'

function getSessionId() {
  try {
    let id = sessionStorage.getItem('waka_session_id')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('waka_session_id', id)
    }
    return id
  } catch {
    return null // sessionStorage indisponible (navigation privée stricte, etc.)
  }
}

/**
 * Envoie un événement au pixel de tracking. Fire-and-forget : ne doit jamais
 * bloquer l'UI ni faire échouer une action utilisateur. Utilise sendBeacon
 * quand disponible (survit même si la page se ferme juste après).
 */
export function track(slug, eventType, extra = {}) {
  if (!slug) return

  const payload = JSON.stringify({
    slug,
    eventType,
    sessionId: getSessionId(),
    ...extra,
  })

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_BASE}/api/track`, new Blob([payload], { type: 'application/json' }))
      return
    }
  } catch {
    // repli sur fetch ci-dessous
  }

  fetch(`${API_BASE}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}