import { Outlet, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { BottomNav } from '@/components/ui/BottomNav'
import { Sidebar } from '@/components/ui/Sidebar'
import { useAuthStore } from '@/store/authStore'
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { merchant, login } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useSidebarCollapsed()

  const backupRaw = sessionStorage.getItem('waka_admin_backup')
  const backup = backupRaw ? JSON.parse(backupRaw) : null

  function handleReturnToAdmin() {
    if (!backup) return
    localStorage.setItem('waka_token', backup.token)
    login(backup.token, backup.merchant)
    sessionStorage.removeItem('waka_admin_backup')
    navigate('/admin/boutiques')
  }

  return (
    <div className="min-h-dvh bg-navy-deep dark:bg-navy-deep">
      {backup && (
        <div className={cn(
          'bg-amber flex items-center justify-between px-4 py-2.5 text-sm font-medium text-navy',
          collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64',
        )}>
          <span>
            Connecté en tant que <strong>{merchant?.businessName}</strong>
          </span>
          <button
            onClick={handleReturnToAdmin}
            className="flex items-center gap-1.5 bg-navy/10 hover:bg-navy/20 rounded-md px-2.5 py-1 transition-colors"
            aria-label="Revenir à l'admin"
          >
            <X className="w-3.5 h-3.5" />
            Revenir à l'admin
          </button>
        </div>
      )}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <main className={cn('pb-24 lg:pb-8 transition-[padding] duration-200', collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-60')}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}