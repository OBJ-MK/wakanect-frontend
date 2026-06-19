export function LogoMark({ size = 36, className = '' }) {
  const gid = 'wk-mark-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Wakanect"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EC5E2A" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="120" rx="30" fill={`url(#${gid})`} />
      <polyline
        points="32,40 46,82 60,56 74,82 88,40"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="40" r="9" fill="#25D366" />
    </svg>
  );
}

export default function Logo({ size = 34, withText = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withText && (
        <span className="font-display font-extrabold tracking-[0.01em] text-cream text-[1.35rem] leading-none">
          Wakanect
        </span>
      )}
    </span>
  );
}
