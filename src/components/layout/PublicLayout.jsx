import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-dvh bg-cream dark:bg-navy-deep">
      <Outlet />
    </div>
  )
}
