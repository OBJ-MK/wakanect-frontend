import { cn } from '@/lib/utils'

export function ConfidenceBadge({ score }) {
  const level = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'

  const styles = {
    high: { bg: 'bg-emerald/15', text: 'text-emerald', label: 'Haute confiance' },
    medium: { bg: 'bg-amber/15', text: 'text-amber', label: 'Confiance moyenne' },
    low: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Faible confiance' },
  }

  const { bg, text, label } = styles[level]

  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl', bg)}>
      <div className="flex gap-0.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={cn(
              'w-1.5 h-3 rounded-full',
              (level === 'high' && i <= 3) || (level === 'medium' && i <= 2) || (level === 'low' && i <= 1)
                ? 'bg-current opacity-100'
                : 'bg-current opacity-20',
              text,
            )}
          />
        ))}
      </div>
      <span className={cn('text-micro font-semibold', text)}>{label} — {score}%</span>
    </div>
  )
}
