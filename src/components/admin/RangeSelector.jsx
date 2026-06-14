const OPTIONS = [
  { value: '7d',   label: '7 j' },
  { value: '30d',  label: '30 j' },
  { value: 'pilot', label: 'Pilot' },
]

export function RangeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5 bg-admin-fill border border-admin-line rounded-lg p-0.5">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-label rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange ${
            value === opt.value
              ? 'bg-white text-navy font-semibold shadow-admin-card'
              : 'text-admin-muted hover:text-admin-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
