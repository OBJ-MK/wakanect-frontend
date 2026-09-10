import { useEffect, useRef } from 'react'
import { track } from '@/lib/track'

/**
 * Mesure le temps passé sur une page publique et l'envoie au pixel quand le
 * client la quitte — soit par navigation SPA (cleanup React), soit par
 * fermeture d'onglet/rafraîchissement (événement pagehide, le cleanup React
 * ne se déclenche pas dans ce cas).
 *
 * @param slug       slug de la boutique
 * @param page       'catalogue' | 'product' | 'checkout' | 'confirmation' | 'tracking'
 * @param extra      données additionnelles à joindre à l'event (ex. { productId })
 * @param resetKey   valeur qui, si elle change, redémarre le chrono (ex. l'id produit
 *                    quand on navigue d'une fiche produit à une autre sans démonter la page)
 */
export function usePageDuration(slug, page, extra = {}, resetKey = null) {
  const extraRef = useRef(extra)
  extraRef.current = extra

  useEffect(() => {
    const startedAt = Date.now()
    let sent = false

    function sendOnce() {
      if (sent) return
      sent = true
      track(slug, 'page_duration', { page, durationMs: Date.now() - startedAt, ...extraRef.current })
    }

    window.addEventListener('pagehide', sendOnce)

    return () => {
      sendOnce()
      window.removeEventListener('pagehide', sendOnce)
    }
  }, [slug, page, resetKey])
}