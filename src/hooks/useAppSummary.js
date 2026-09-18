import { useEffect } from 'react'
import { useSummaryStore } from '@/store/summaryStore'

/**
 * Résumé léger du tableau de bord (badges Sidebar/BottomNav + page Dashboard).
 * Partage un cache module-level : plusieurs montages simultanés (Sidebar +
 * BottomNav) ne déclenchent qu'un seul appel réseau. Pour les stats
 * détaillées par période, voir useDashboard.
 */
export function useAppSummary() {
  const summary = useSummaryStore((s) => s.summary)
  const loading = useSummaryStore((s) => s.loading)
  const error = useSummaryStore((s) => s.error)
  const fetchSummary = useSummaryStore((s) => s.fetchSummary)

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  // Sidebar/BottomNav ne se démontent jamais pendant la navigation : sans ça
  // le badge reste figé si l'utilisateur revient sur l'onglet après un moment.
  // La garde de fraîcheur 30s du store (fetchSummary non forcé) évite le spam.
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') fetchSummary()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [fetchSummary])

  const refreshSummary = () => fetchSummary(true)

  return { summary, loading, error, refreshSummary }
}
