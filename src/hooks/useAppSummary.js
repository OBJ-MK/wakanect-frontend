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

  return { summary, loading, error }
}
