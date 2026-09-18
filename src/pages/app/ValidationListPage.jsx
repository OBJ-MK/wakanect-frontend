import { useEffect } from 'react'
import { ChevronLeft, PackageSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useValidationStore } from '@/store/validationStore'
import { ValidationPendingList } from '@/components/features/parsing/ValidationPendingList'

export function ValidationListPage() {
  const { pending, orphans, loading, fetchPending, attachOrphan, deleteOrphan } = useValidationStore()

  useEffect(() => { fetchPending(true) }, [])

  // Tant qu'un message est encore en cours d'analyse (parsing IA, 4-10s en
  // pratique), on repolle pour que la carte se complète automatiquement.
  const hasProcessing = pending.some(p => p.status === 'processing')
  useEffect(() => {
    if (!hasProcessing) return
    const interval = setInterval(() => fetchPending(true, true), 2500)
    return () => clearInterval(interval)
  }, [hasProcessing])

  return (
    // lg: split liste/détail côte à côte comme OrdersPage — la liste est
    // toujours affichée ici (pas de sélection sur cette route), la colonne
    // de droite invite à ouvrir un produit. Mobile inchangé (liste seule).
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-navy-deep lg:h-[calc(100dvh-2rem)] lg:overflow-hidden lg:flex lg:items-stretch lg:gap-5 lg:p-6">
      {/* Colonne liste */}
      <div className="flex flex-col w-full lg:w-[390px] lg:shrink-0 lg:min-h-0 lg:sticky lg:top-6 lg:self-start lg:h-full lg:rounded-3xl lg:bg-navy/45 lg:ring-1 lg:ring-white/8 lg:shadow-card lg:overflow-hidden">
        <div className="sticky top-0 z-20 glass border-b border-white/6 px-4 py-3 lg:shrink-0 lg:static lg:!bg-transparent lg:!backdrop-blur-none lg:!border-0 lg:!shadow-none lg:px-5 lg:pt-5 lg:pb-4">
          <div className="max-w-lg mx-auto flex items-center gap-3 lg:max-w-none">
            <Link to="/app" className="p-2 -ml-2 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-colors lg:hidden">
              <ChevronLeft size={20} />
            </Link>
            <div className="flex-1">
              <h1 className="font-display font-bold text-h3 text-white">Nouveau produit à valider</h1>
              <p className="text-micro text-white/45">{pending.length} en attente</p>
            </div>
          </div>
        </div>

        <div className="page-container lg:mx-0 lg:w-full py-4 flex flex-col gap-3 lg:max-w-none lg:px-4 lg:pb-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {loading ? (
            <div className="glass rounded-3xl overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-white/6 last:border-0 animate-pulse">
                  <div className="h-12 w-12 rounded-2xl bg-white/8 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-20 bg-white/8 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : pending.length === 0 && orphans.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald/15 flex items-center justify-center mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-body font-semibold text-white">Tout est traité !</p>
              <p className="text-label text-white/45 mt-1">Aucun produit en attente de validation</p>
            </div>
          ) : (
            <ValidationPendingList pending={pending} orphans={orphans} onAttach={attachOrphan} onDelete={deleteOrphan} />
          )}
        </div>
      </div>

      {/* Colonne détail — desktop uniquement, rien à montrer tant qu'aucun
          produit n'est ouvert (comportement identique à OrdersPage). */}
      <div className="hidden lg:flex flex-1 min-w-0 lg:min-h-0 flex-col items-center justify-center text-center px-8 rounded-3xl bg-navy/25 ring-1 ring-white/8">
        <div className="w-16 h-16 rounded-full bg-white/6 flex items-center justify-center mb-4">
          <PackageSearch size={26} className="text-white/25" />
        </div>
        <p className="text-body text-white/40">Sélectionnez un produit pour le valider</p>
      </div>
    </div>
  )
}
