import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/ui/BottomNav'
import { useAuthStore } from '@/store/authStore'

export function AppShell() {
  const { merchant } = useAuthStore()

  return (
    <div className="min-h-dvh bg-navy-deep dark:bg-navy-deep">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
