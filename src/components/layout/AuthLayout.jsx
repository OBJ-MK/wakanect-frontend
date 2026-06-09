import { Outlet } from 'react-router-dom'
import { WakanectLogo } from '@/components/brand/WakanectLogo'

export function AuthLayout() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-hero px-4 py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <WakanectLogo variant="full" theme="dark" className="h-10" />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
