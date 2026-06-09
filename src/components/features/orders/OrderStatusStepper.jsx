import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Nouvelle', 'Confirmée', 'Livrée']

export function OrderStatusStepper({ status, onUpdate, loading = false }) {
  const currentIndex = STEPS.indexOf(status)

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        const isLast = i === STEPS.length - 1

        return (
          <div key={step} className="flex items-center flex-1">
            <button
              onClick={() => !done && !active && onUpdate && onUpdate(step)}
              disabled={done || active || loading}
              className={cn(
                'flex flex-col items-center gap-1.5 flex-1',
                'disabled:pointer-events-none',
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                  done && 'bg-emerald border-emerald text-white',
                  active && 'bg-orange border-orange text-white shadow-orange-glow',
                  !done && !active && 'bg-transparent border-white/20 text-white/30',
                )}
              >
                {done ? <Check size={14} /> : (
                  <span className="text-micro font-bold">{i + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-micro text-center',
                  active ? 'text-orange font-semibold' : done ? 'text-emerald' : 'text-white/30',
                )}
              >
                {step}
              </span>
            </button>

            {!isLast && (
              <div
                className={cn(
                  'h-0.5 w-8 mb-5 transition-colors',
                  i < currentIndex ? 'bg-emerald' : 'bg-white/15',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
