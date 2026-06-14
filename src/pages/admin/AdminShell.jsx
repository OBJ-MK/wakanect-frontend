import { Outlet } from 'react-router-dom'
import { useAdmin } from './AdminApp'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { AdminBottomNav } from '@/components/admin/AdminBottomNav'
import { X } from 'lucide-react'

export default function AdminShell() {
  const { impersonating, setImpersonating } = useAdmin()

  return (
    <div className="admin-shell flex min-h-screen bg-admin-fill">
      {/* Sidebar — desktop uniquement */}
      <AdminSidebar />

      {/* Zone principale */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        <AdminTopBar />

        {/* Bandeau impersonate — persistant tant que session active */}
        {impersonating && (
          <div className="bg-amber flex items-center justify-between px-4 py-2.5 text-sm font-medium text-navy">
            <span>
              Connecté en tant que <strong>{impersonating.name}</strong> ({impersonating.slug})
            </span>
            <button
              onClick={() => setImpersonating(null)}
              className="flex items-center gap-1.5 bg-navy/10 hover:bg-navy/20 rounded-md px-2.5 py-1 transition-colors"
              aria-label="Revenir à l'admin"
            >
              <X className="w-3.5 h-3.5" />
              Revenir à l'admin
            </button>
          </div>
        )}

        {/* Contenu — cream canvas, padding adaptatif */}
        <main className="flex-1 bg-cream p-4 md:p-6 pb-24 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Navigation basse — mobile uniquement */}
      <AdminBottomNav />
    </div>
  )
}
