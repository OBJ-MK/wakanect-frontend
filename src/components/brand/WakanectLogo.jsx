import { cn } from '@/lib/utils'

export function WakanectLogo({ variant = 'full', theme = 'dark', className = '' }) {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F1C3F'
  const taglineColor = theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(15,28,63,0.55)'

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-10 w-10', className)}
        aria-label="Wakanect"
        role="img"
      >
        <rect width="40" height="40" rx="10" fill="#0F1C3F" />
        <path
          d="M8 28L14 12L20 24L26 12L32 28"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 20L22 20"
          stroke="#FFB347"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-9', className)}
      aria-label="Wakanect"
      role="img"
    >
      {/* W letterform */}
      <path
        d="M6 10L11 28L16 18L21 28L26 10"
        stroke={textColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* a */}
      <text x="30" y="29" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="22" fill={textColor}>aka</text>
      {/* n — amber signature */}
      <text x="80" y="29" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="22" fill="#FFB347">n</text>
      {/* ect */}
      <text x="94" y="29" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="22" fill={textColor}>ect</text>
      {/* thread line */}
      <line x1="30" y1="34" x2="140" y2="34" strokeWidth="1.5" strokeLinecap="round">
        <linearGradient id="thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EC5E2A" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
        <animate attributeName="stroke" values="#EC5E2A;#FFB347;#EC5E2A" dur="4s" repeatCount="indefinite" />
      </line>
      <line x1="30" y1="34" x2="140" y2="34" stroke="url(#thread)" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EC5E2A" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
      </defs>
    </svg>
  )
}
